import { usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Icon } from './Icons';

// Global cache outside component lifecycle to prevent duplicate toasts across re-renders
let globalLastToast = { message: '', time: 0 };

const normalizeToastText = (str) =>
    String(str || '')
        .replace(/^[✓✕ℹ❤️\s]+/, '')
        .replace(/[।\.!\s]+$/, '')
        .trim();

export default function ToastContainer() {
    const { flash } = usePage().props;
    const [toasts, setToasts] = useState([]);

    const addToast = (message, type = 'success') => {
        if (!message) return;
        const normalized = normalizeToastText(message);
        const now = Date.now();

        // Prevent duplicate toast if identical message was triggered within 2.5 seconds
        if (globalLastToast.message === normalized && now - globalLastToast.time < 2500) {
            return;
        }
        globalLastToast = { message: normalized, time: now };

        const id = now + Math.random();
        setToasts((prev) => {
            // Deduplicate if already present in active toast stack
            if (prev.some((t) => normalizeToastText(t.message) === normalized)) {
                return prev;
            }
            return [...prev, { id, message, type }];
        });

        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 3200);
    };

    // Listen to Inertia flash messages
    useEffect(() => {
        if (flash?.success) {
            addToast(flash.success, 'success');
        }
        if (flash?.error) {
            addToast(flash.error, 'error');
        }
    }, [flash]);

    // Listen to custom 'app:toast' events
    useEffect(() => {
        const handleCustomToast = (e) => {
            if (e.detail?.message) {
                addToast(e.detail.message, e.detail.type || 'success');
            }
        };

        window.addEventListener('app:toast', handleCustomToast);
        return () => window.removeEventListener('app:toast', handleCustomToast);
    }, []);

    if (toasts.length === 0) return null;

    const COLORS = {
        success: { bg: '#0f291e', border: 'var(--pri, #0d7a5f)', iconName: 'check', iconBg: 'var(--pri, #0d7a5f)' },
        error: { bg: '#2b1215', border: '#c0392b', iconName: 'x', iconBg: '#c0392b' },
        info: { bg: '#102230', border: 'var(--acc, #e9a820)', iconName: 'lightbulb', iconBg: 'var(--acc, #e9a820)' },
    };

    return (
        <div
            style={{
                position: 'fixed',
                bottom: 'calc(24px + env(safe-area-inset-bottom, 0px))',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 99999,
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                alignItems: 'center',
                pointerEvents: 'none',
                maxWidth: '92vw',
            }}
        >
            {toasts.map((t) => {
                const conf = COLORS[t.type] || COLORS.success;
                return (
                    <div
                        key={t.id}
                        style={{
                            background: conf.bg,
                            color: '#fff',
                            border: `1.5px solid ${conf.border}`,
                            padding: '10px 18px',
                            borderRadius: 999,
                            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.35)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 10,
                            fontSize: 14.5,
                            fontWeight: 600,
                            letterSpacing: '0.2px',
                            pointerEvents: 'auto',
                            animation: 'toast-pop 0.28s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                        }}
                    >
                        <span
                            style={{
                                width: 22,
                                height: 22,
                                borderRadius: '50%',
                                background: conf.iconBg,
                                color: '#fff',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                            }}
                        >
                            <Icon name={conf.iconName} size={14} color="#fff" />
                        </span>
                        <span>{t.message}</span>
                    </div>
                );
            })}
        </div>
    );
}
