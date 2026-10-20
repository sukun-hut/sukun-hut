import '../css/app.css';
import { createInertiaApp, router } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';

// Minimal professional loading spinner shown during Inertia page visits
// (replaces the default top progress bar for a cleaner look)
function Spinner() {
    let el = document.getElementById('inertia-spinner');
    if (!el) {
        el = document.createElement('div');
        el.id = 'inertia-spinner';
        el.style.cssText = `
            position: fixed; top: 50%; left: 50%; margin: -18px 0 0 -18px;
            width: 36px; height: 36px; border-radius: 50%;
            border: 3px solid rgba(0,0,0,.1); border-top-color: var(--pri, #0d7a5f);
            animation: spinner-rotate .7s linear infinite; z-index: 99999;
            pointer-events: none; display: none;
        `;
        const style = document.createElement('style');
        style.textContent = '@keyframes spinner-rotate{to{transform:rotate(360deg)}}';
        document.head.appendChild(style);
        document.body.appendChild(el);
    }
    return el;
}

router.on('start', () => { Spinner().style.display = 'block'; });
router.on('finish', () => { Spinner().style.display = 'none'; });

// Global network/CSRF failure feedback — Inertia's router fires 'error' on 419/429/500
router.on('error', () => {
    const flash = document.getElementById('net-error-flash');
    if (flash) {
        flash.style.display = 'block';
        setTimeout(() => { flash.style.display = 'none'; }, 5000);
    }
});

createInertiaApp({
    title: (t) => t || 'সুকুন হাট',
    resolve: (name) => {
        const pages = import.meta.glob('./Pages/**/*.jsx', { eager: true });
        return pages[`./Pages/${name}.jsx`];
    },
    setup({ el, App, props }) {
        createRoot(el).render(<App {...props} />);
    },
    progress: false,
});
