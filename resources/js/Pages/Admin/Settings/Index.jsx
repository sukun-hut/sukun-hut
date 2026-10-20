import { Head, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { Icon } from '../../../Components/Icons';
import { tk } from '../../../lib/format';
import { toast } from '../../../lib/toast';

const TABS = [
    { id: 'branding', label: 'ব্র্যান্ডিং', icon: 'building' },
    { id: 'theme', label: 'থিম ও কালার', icon: 'palette' },
    { id: 'store', label: 'স্টোর ও ডেলিভারি', icon: 'cart' },
    { id: 'payment', label: 'পেমেন্ট গেটওয়ে', icon: 'payment' },
    { id: 'features', label: 'ফিচার মডিউল', icon: 'features' },
    { id: 'data', label: 'ডেমো ডাটা', icon: 'database' },
];

const PRESETS = [
    { id: 'sukun', name: 'সুকুন হাট (ডিফল্ট)', primary: '#0d7a5f', secondary: '#f39c12' },
    { id: 'ocean', name: 'ওশান ব্লু', primary: '#1a5fb4', secondary: '#26a269' },
    { id: 'royal', name: 'রয়েল পার্পল', primary: '#613583', secondary: '#e91e63' },
    { id: 'crimson', name: 'ক্রিমসন রেড', primary: '#c0392b', secondary: '#e67e22' },
    { id: 'midnight', name: 'মিডনাইট', primary: '#2c3e50', secondary: '#3498db' },
    { id: 'forest', name: 'ফরেস্ট গ্রিন', primary: '#1e6b34', secondary: '#8bc34a' },
];

export default function SettingsIndex({ settings }) {
    const path = window.location.pathname;
    const pfx = path.startsWith('/admin') ? '/admin' : '';

    // Active Tab persistence via URL parameter ?tab=... (preserves active tab across saves and reloads)
    const getInitialTab = () => {
        if (typeof window === 'undefined') return 'branding';
        const params = new URLSearchParams(window.location.search);
        const fromParam = params.get('tab') || params.get('sub');
        if (fromParam && TABS.some((t) => t.id === fromParam)) return fromParam;
        const hash = window.location.hash.replace('#', '');
        if (hash && TABS.some((t) => t.id === hash)) return hash;
        return 'branding';
    };

    const [tab, setTab] = useState(getInitialTab);

    const changeTab = (newTab) => {
        setTab(newTab);
        if (typeof window !== 'undefined') {
            const url = new URL(window.location.href);
            url.searchParams.set('tab', newTab);
            window.history.replaceState({}, '', url.toString());
        }
    };

    // Keep active tab in sync if user presses browser back/forward buttons
    useEffect(() => {
        const onPopState = () => {
            const current = getInitialTab();
            setTab(current);
        };
        window.addEventListener('popstate', onPopState);
        return () => window.removeEventListener('popstate', onPopState);
    }, []);

    const form = useForm({ ...settings });
    const d = form.data;
    const set = (k, v) => form.setData(k, v);

    const submit = (e) => {
        e?.preventDefault();
        form.post(`${pfx}/settings?tab=${tab}`, {
            preserveScroll: true,
            preserveState: true,
            onError: (errs) => {
                const first = Object.values(errs || {})[0];
                toast.error(first || 'সেটিংস সংরক্ষণে কিছু ত্রুটি রয়েছে');
            },
        });
    };

    // Live-preview CSS variables for the theme tab
    const previewVars = { '--pri': d.primary_color || '#0d7a5f', '--sec': d.secondary_color || '#f39c12' };

    // Live CSS variable reflection on the DOM
    useEffect(() => {
        if (d.primary_color) {
            document.documentElement.style.setProperty('--pri', d.primary_color);
        }
        if (d.secondary_color) {
            document.documentElement.style.setProperty('--acc', d.secondary_color);
        }
    }, [d.primary_color, d.secondary_color]);

    const Toggle = ({ name, label, hint, icon }) => (
        <label
            style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
                padding: '10px 14px', border: '1px solid var(--line)', borderRadius: 10, background: 'var(--card)',
                cursor: 'pointer', marginBottom: 8,
            }}
        >
            <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {icon && <Icon name={icon} size={18} color="var(--pri)" />}
                <span>
                    <strong style={{ display: 'block' }}>{label}</strong>
                    {hint && <small style={{ color: 'var(--mut)' }}>{hint}</small>}
                </span>
            </span>
            <input
                type="checkbox"
                checked={!!d[name]}
                onChange={(e) => set(name, e.target.checked)}
                style={{ width: 20, height: 20, cursor: 'pointer', flexShrink: 0 }}
            />
        </label>
    );

    return (
        <>
            <Head title="সাইট সেটিংস – অ্যাডমিন" />
            <h1 style={{ fontSize: 28, margin: '8px 0 6px' }}>⚙️ সাইট সেটিংস ও থিম কাস্টমাইজেশন</h1>
            <p style={{ color: 'var(--mut)', marginBottom: 20 }}>
                ব্র্যান্ডিং, থিম, ডেলিভারি, পেমেন্ট গেটওয়ে এবং ফিচার মডিউল — সব এক জায়গা থেকে নিয়ন্ত্রণ করুন।
                পরিবর্তন সংরক্ষণ করলে সাথে সাথেই ফ্রন্টএন্ডে কার্যকর হবে।
            </p>

            {/* TAB NAVIGATION */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20, borderBottom: '2px solid var(--line)', paddingBottom: 10 }}>
                {TABS.map((t) => (
                    <button
                        key={t.id}
                        type="button"
                        onClick={() => changeTab(t.id)}
                        className="btn"
                        style={{
                            background: tab === t.id ? 'var(--pri)' : 'var(--card)',
                            color: tab === t.id ? '#fff' : 'var(--tx)',
                            border: '1px solid var(--line)',
                            fontSize: 14,
                            padding: '8px 14px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 8,
                        }}
                    >
                        <Icon name={t.icon} size={16} color={tab === t.id ? '#fff' : 'var(--pri)'} />
                        <span>{t.label}</span>
                    </button>
                ))}
            </div>

            {/* ============ TAB: BRANDING ============ */}
            {tab === 'branding' && (
                <form className="fd" onSubmit={submit}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 20 }}>
                        <div className="card">
                            <h3 style={{ fontSize: 18, marginBottom: 14, color: 'var(--pri)', display: 'flex', alignItems: 'center', gap: 8 }}>
                                <Icon name="tag" size={18} color="var(--pri)" />
                                <span>ব্র্যান্ড পরিচিতি</span>
                            </h3>

                            <label>ওয়েবসাইটের নাম</label>
                            <input value={d.site_name || ''} onChange={(e) => set('site_name', e.target.value)} placeholder="যেমন: সুকুন হাট" />
                            <div className="er">{form.errors.site_name}</div>

                            <label>স্লোগান / ট্যাগলাইন</label>
                            <textarea rows={2} value={d.tagline || ''} onChange={(e) => set('tagline', e.target.value)} />
                            <div className="er">{form.errors.tagline}</div>

                            <label>সাব-ট্যাগলাইন</label>
                            <input value={d.subtagline || ''} onChange={(e) => set('subtagline', e.target.value)} />
                            <div className="er">{form.errors.subtagline}</div>

                            <label>ইমেইল</label>
                            <input type="email" value={d.email || ''} onChange={(e) => set('email', e.target.value)} />
                            <div className="er">{form.errors.email}</div>

                            <label>ফোন নম্বর (ডিসপ্লে)</label>
                            <input value={d.phone_display || ''} onChange={(e) => set('phone_display', e.target.value)} placeholder="যেমন: 01568-772054" />
                            <div className="er">{form.errors.phone_display}</div>

                            <label>ঠিকানা</label>
                            <textarea rows={2} value={d.address || ''} onChange={(e) => set('address', e.target.value)} />
                            <div className="er">{form.errors.address}</div>
                        </div>

                        <div className="card">
                            <h3 style={{ fontSize: 18, marginBottom: 14, color: 'var(--pri)', display: 'flex', alignItems: 'center', gap: 8 }}>
                                <Icon name="link" size={18} color="var(--pri)" />
                                <span>সোশ্যাল ও যোগাযোগ লিংক</span>
                            </h3>

                            <label>ফেসবুক পেজ লিংক</label>
                            <input value={d.facebook || ''} onChange={(e) => set('facebook', e.target.value)} placeholder="https://facebook.com/..." />
                            <div className="er">{form.errors.facebook}</div>

                            <label>মেসেঞ্জার লিংক</label>
                            <input value={d.messenger || ''} onChange={(e) => set('messenger', e.target.value)} placeholder="https://m.me/..." />
                            <div className="er">{form.errors.messenger}</div>

                            <label>হোয়াটসঅ্যাপ নম্বর (আন্তর্জাতিক ফরম্যাট, যেমন: 8801568772054)</label>
                            <input value={d.whatsapp || ''} onChange={(e) => set('whatsapp', e.target.value)} />
                            <div className="er">{form.errors.whatsapp}</div>

                            <label>লোগো আপলোড</label>
                            <input type="file" accept="image/png,image/jpeg,image/svg+xml,image/webp" onChange={(e) => set('logo', e.target.files[0])} />
                            <small style={{ color: 'var(--mut)', display: 'block', marginTop: 4 }}>
                                PNG/JPG/SVG/WebP (সর্বোচ্চ 2MB)
                            </small>
                            <div className="er">{form.errors.logo}</div>

                            <label>ফেভিকন আপলোড</label>
                            <input type="file" accept="image/png,image/x-icon,image/svg+xml" onChange={(e) => set('favicon', e.target.files[0])} />
                            <small style={{ color: 'var(--mut)', display: 'block', marginTop: 4 }}>
                                .ico বা 32×32 PNG (সর্বোচ্চ 1MB)
                            </small>
                            <div className="er">{form.errors.favicon}</div>

                            <label>ফেসবুক পিক্সেল ID (অপশনাল)</label>
                            <input value={d.fb_pixel || ''} onChange={(e) => set('fb_pixel', e.target.value)} placeholder="যেমন: 1234567890" />
                            <div className="er">{form.errors.fb_pixel}</div>
                        </div>
                    </div>

                    {/* Single unified, prominent save button for Branding */}
                    <div style={{ marginTop: 18 }}>
                        <button className="btn" disabled={form.processing} style={{ minWidth: 220, padding: '12px 28px', fontSize: 16 }}>
                            {form.processing ? 'সংরক্ষণ হচ্ছে...' : 'ব্র্যান্ডিং তথ্য সংরক্ষণ করুন'}
                        </button>
                    </div>
                </form>
            )}

            {/* ============ TAB: THEME ============ */}
            {tab === 'theme' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 20 }}>
                    <form className="card fd" onSubmit={submit}>
                        <h3 style={{ fontSize: 18, marginBottom: 14, color: 'var(--pri)', display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Icon name="palette" size={18} color="var(--pri)" />
                            <span>CSS থিম ভেরিয়েবল</span>
                        </h3>

                        <label>প্রাইমারি কালার (প্রধান ব্র্যান্ড রং)</label>
                        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                            <input
                                type="color"
                                value={d.primary_color || '#0d7a5f'}
                                onChange={(e) => set('primary_color', e.target.value)}
                                style={{ width: 60, height: 40, padding: 2, cursor: 'pointer' }}
                            />
                            <input value={d.primary_color || ''} onChange={(e) => set('primary_color', e.target.value)} style={{ flex: 1 }} placeholder="#0d7a5f" />
                        </div>
                        <div className="er">{form.errors.primary_color}</div>

                        <label>সেকেন্ডারি কালার (অ্যাকসেন্ট/হাইলাইট রং)</label>
                        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                            <input
                                type="color"
                                value={d.secondary_color || '#f39c12'}
                                onChange={(e) => set('secondary_color', e.target.value)}
                                style={{ width: 60, height: 40, padding: 2, cursor: 'pointer' }}
                            />
                            <input value={d.secondary_color || ''} onChange={(e) => set('secondary_color', e.target.value)} style={{ flex: 1 }} placeholder="#f39c12" />
                        </div>
                        <div className="er">{form.errors.secondary_color}</div>

                        <h4 style={{ margin: '16px 0 8px', fontSize: 15, display: 'flex', alignItems: 'center', gap: 6 }}>
                            <Icon name="star" size={15} color="#f39c12" />
                            <span>রেডিমেড কালার প্রিসেট</span>
                        </h4>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 8 }}>
                            {PRESETS.map((p) => (
                                <button
                                    key={p.id}
                                    type="button"
                                    onClick={() => { set('primary_color', p.primary); set('secondary_color', p.secondary); }}
                                    style={{
                                        padding: '8px 10px', borderRadius: 10, cursor: 'pointer', textAlign: 'left', fontSize: 12.5,
                                        border: d.primary_color === p.primary ? '2px solid var(--pri)' : '1px solid var(--line)',
                                        background: 'var(--card)',
                                    }}
                                >
                                    <span style={{ display: 'inline-block', width: 12, height: 12, borderRadius: 99, background: p.primary, marginRight: 6 }} />
                                    <span style={{ display: 'inline-block', width: 12, height: 12, borderRadius: 99, background: p.secondary, marginRight: 8 }} />
                                    {p.name}
                                </button>
                            ))}
                        </div>

                        <label style={{ marginTop: 16 }}>কারেন্সি সিম্বল</label>
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                            {['৳', '$', '€', '£', '₹', '﷼'].map((s) => (
                                <button
                                    key={s}
                                    type="button"
                                    onClick={() => set('currency_symbol', s)}
                                    style={{
                                        padding: '8px 14px', fontSize: 18, borderRadius: 10, cursor: 'pointer',
                                        border: d.currency_symbol === s ? '2px solid var(--pri)' : '1px solid var(--line)',
                                        background: d.currency_symbol === s ? 'var(--soft)' : 'var(--card)',
                                    }}
                                >
                                    {s}
                                </button>
                            ))}
                            <input
                                value={d.currency_symbol || ''}
                                onChange={(e) => set('currency_symbol', e.target.value)}
                                style={{ width: 80, textAlign: 'center' }}
                                placeholder="কাস্টম"
                            />
                        </div>
                        <div className="er">{form.errors.currency_symbol}</div>

                        <button className="btn" disabled={form.processing} style={{ marginTop: 16 }}>
                            {form.processing ? 'সংরক্ষণ হচ্ছে...' : 'থিম সংরক্ষণ করুন'}
                        </button>
                    </form>

                    {/* LIVE PREVIEW */}
                    <div className="card" style={{ height: 'fit-content' }}>
                        <h3 style={{ fontSize: 18, marginBottom: 14, color: 'var(--pri)', display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Icon name="eye" size={18} color="var(--pri)" />
                            <span>লাইভ প্রিভিউ</span>
                        </h3>
                        <div style={{ ...previewVars, padding: 16, borderRadius: 12, background: 'var(--card)', border: '1px solid var(--line)' }}>
                            <div style={{ background: 'var(--pri)', color: '#fff', padding: '12px 16px', borderRadius: 10, marginBottom: 12 }}>
                                <strong style={{ fontSize: 17 }}>{d.site_name || 'সাইটের নাম'}</strong>
                                <div style={{ fontSize: 12.5, opacity: 0.9 }}>{d.tagline || 'ট্যাগলাইন এখানে দেখাবে'}</div>
                            </div>
                            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                                <button type="button" style={{ background: 'var(--pri)', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: 10, fontWeight: 600, cursor: 'pointer' }}>
                                    প্রাইমারি বাটন
                                </button>
                                <button type="button" style={{ background: 'var(--sec)', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: 10, fontWeight: 600, cursor: 'pointer' }}>
                                    সেকেন্ডারি বাটন
                                </button>
                            </div>
                            <div style={{ display: 'flex', gap: 8 }}>
                                <div style={{ flex: 1, border: '1px solid var(--line)', borderRadius: 10, padding: 12, textAlign: 'center' }}>
                                    <div style={{ margin: '8px auto', display: 'inline-block' }}>
                                        <Icon name="shopping-bag" size={32} color="var(--pri)" />
                                    </div>
                                    <div style={{ fontWeight: 600, fontSize: 13.5 }}>ডেমো প্রোডাক্ট</div>
                                    <div style={{ color: 'var(--pri)', fontWeight: 700 }}>{tk(999, d.currency_symbol || '৳')}</div>
                                    <button type="button" style={{ marginTop: 8, width: '100%', background: 'var(--pri)', color: '#fff', border: 'none', padding: '8px 0', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}>
                                        অর্ডার করুন
                                    </button>
                                </div>
                            </div>
                        </div>
                        <small style={{ color: 'var(--mut)', display: 'block', marginTop: 10, textAlign: 'center' }}>
                            সংরক্ষণ করলে সম্পূর্ণ সাইটে এই রংগুলো প্রয়োগ হবে।
                        </small>
                    </div>
                </div>
            )}

            {/* ============ TAB: STORE ============ */}
            {tab === 'store' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 20 }}>
                    <form className="card fd" onSubmit={submit} style={{ maxWidth: 560 }}>
                        <h3 style={{ fontSize: 18, marginBottom: 14, color: 'var(--pri)', display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Icon name="truck" size={18} color="var(--pri)" />
                            <span>ডেলিভারি চার্জ সেটিংস</span>
                        </h3>

                        <label>ঢাকার ভেতরে ডেলিভারি চার্জ</label>
                        <input id="delivery_in" type="number" min="0" value={d.delivery_in ?? 70} onChange={(e) => set('delivery_in', e.target.value)} placeholder="যেমন: ৭০" />
                        <div className="er">{form.errors.delivery_in}</div>

                        <label>ঢাকার বাইরে ডেলিভারি চার্জ</label>
                        <input id="delivery_out" type="number" min="0" value={d.delivery_out ?? 120} onChange={(e) => set('delivery_out', e.target.value)} placeholder="যেমন: ১২০" />
                        <div className="er">{form.errors.delivery_out}</div>

                        <label>ফ্রি ডেলিভারির ন্যূনতম অর্ডার (০ দিলে বন্ধ)</label>
                        <input id="free_over" type="number" min="0" value={d.free_over ?? 2000} onChange={(e) => set('free_over', e.target.value)} placeholder="যেমন: ২০০০" />
                        <small style={{ color: 'var(--mut)', display: 'block', marginTop: 4 }}>
                            সাবটোটাল এই পরিমাণের সমান বা বেশি হলে ডেলিভারি ফ্রি হবে।
                        </small>
                        <div className="er">{form.errors.free_over}</div>

                        <h3 style={{ fontSize: 18, margin: '20px 0 12px', color: 'var(--pri)', display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Icon name="receipt" size={18} color="var(--pri)" />
                            <span>ট্যাক্স / ভ্যাট</span>
                        </h3>

                        <label>ভ্যাট হার (%) — ০ দিলে ভ্যাট নেই</label>
                        <input type="number" min="0" max="100" step="0.5" value={d.tax_percent ?? 0} onChange={(e) => set('tax_percent', e.target.value)} placeholder="যেমন: ৫" />
                        <div className="er">{form.errors.tax_percent}</div>

                        <h3 style={{ fontSize: 18, margin: '20px 0 12px', color: 'var(--pri)', display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Icon name="hash" size={18} color="var(--pri)" />
                            <span>অর্ডার নম্বর প্রিফিক্স</span>
                        </h3>
                        <input value={d.order_prefix || ''} onChange={(e) => set('order_prefix', e.target.value)} placeholder="যেমন: SH-" />
                        <small style={{ color: 'var(--mut)', display: 'block', marginTop: 4 }}>অর্ডার নম্বরের আগে এই প্রিফিক্স যুক্ত হবে।</small>

                        <button className="btn" disabled={form.processing} style={{ marginTop: 16, width: '100%' }}>
                            {form.processing ? 'সংরক্ষণ হচ্ছে...' : 'স্টোর সেটিংস সংরক্ষণ'}
                        </button>
                    </form>

                    <div className="card" style={{ height: 'fit-content', background: 'var(--soft)' }}>
                        <h3 style={{ fontSize: 18, marginBottom: 10, color: 'var(--pri)', display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Icon name="lightbulb" size={18} color="var(--pri)" />
                            <span>বর্তমান সারাংশ</span>
                        </h3>
                        <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 2 }}>
                            <li><strong>ঢাকার ভেতরে:</strong> {tk(d.delivery_in || 0, d.currency_symbol)}</li>
                            <li><strong>ঢাকার বাইরে:</strong> {tk(d.delivery_out || 0, d.currency_symbol)}</li>
                            <li>
                                <strong>ফ্রি ডেলিভারি:</strong>{' '}
                                {Number(d.free_over) > 0 ? tk(d.free_over, d.currency_symbol) + '+' : 'বন্ধ রয়েছে'}
                            </li>
                            <li><strong>ভ্যাট:</strong> {Number(d.tax_percent) > 0 ? d.tax_percent + '%' : 'নেই'}</li>
                            <li><strong>কারেন্সি:</strong> {d.currency_symbol || '৳'}</li>
                        </ul>
                    </div>
                </div>
            )}

            {/* ============ TAB: PAYMENT ============ */}
            {tab === 'payment' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 20 }}>
                    <form className="card fd" onSubmit={submit} style={{ maxWidth: 560 }}>
                        <h3 style={{ fontSize: 18, marginBottom: 6, color: 'var(--pri)', display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Icon name="credit-card" size={18} color="var(--pri)" />
                            <span>পেমেন্ট গেটওয়ে সুইচ</span>
                        </h3>
                        <p style={{ color: 'var(--mut)', fontSize: 13.5, marginBottom: 14 }}>
                            যে পেমেন্ট পদ্ধতি চালু করবেন, সেটি চেকআউট পেজে কাস্টমারের কাছে দেখাবে।
                        </p>

                        <Toggle name="payment_cod_enabled" label="ক্যাশ অন ডেলিভারি (COD)" hint="পণ্য হাতে পেয়ে টাকা পরিশোধ" icon="truck" />
                        <Toggle name="payment_bkash_enabled" label="বিকাশ (bKash)" hint="বিকাশ সেন্ড মানি + TrxID ভেরিফিকেশন" icon="credit-card" />
                        <Toggle name="payment_nagad_enabled" label="নগদ (Nagad)" hint="নগদ সেন্ড মানি + TrxID ভেরিফিকেশন" icon="credit-card" />
                        <Toggle name="payment_sslcommerz_enabled" label="SSLCommerz (কার্ড/অনলাইন)" hint="কার্ড, নেটব্যাংকিং ও মোবাইল ব্যাংকিং (অ্যাডভান্সড — .env ফাইলে API কি সেট করতে হবে)" icon="credit-card" />

                        <h3 style={{ fontSize: 18, margin: '18px 0 12px', color: 'var(--pri)', display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Icon name="phone" size={18} color="var(--pri)" />
                            <span>মোবাইল ব্যাংকিং নম্বর</span>
                        </h3>

                        <label>বিকাশ নম্বর</label>
                        <input value={d.bkash_number || ''} onChange={(e) => set('bkash_number', e.target.value)} placeholder="যেমন: 01568772054" />
                        <div className="er">{form.errors.bkash_number}</div>

                        <label>নগদ নম্বর</label>
                        <input value={d.nagad_number || ''} onChange={(e) => set('nagad_number', e.target.value)} placeholder="যেমন: 01568772054" />
                        <div className="er">{form.errors.nagad_number}</div>

                        <button className="btn" disabled={form.processing} style={{ marginTop: 16, width: '100%' }}>
                            {form.processing ? 'সংরক্ষণ হচ্ছে...' : 'পেমেন্ট সেটিংস সংরক্ষণ'}
                        </button>
                    </form>

                    <div className="card" style={{ height: 'fit-content', background: 'var(--soft)' }}>
                        <h3 style={{ fontSize: 18, marginBottom: 10, color: 'var(--pri)', display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Icon name="credit-card" size={18} color="var(--pri)" />
                            <span>বর্তমান অবস্থা</span>
                        </h3>
                        <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 2 }}>
                            <li>COD: {d.payment_cod_enabled ? <strong style={{ color: 'var(--pri)' }}>✓ চালু</strong> : '✕ বন্ধ'}</li>
                            <li>bKash: {d.payment_bkash_enabled ? <strong style={{ color: 'var(--pri)' }}>✓ চালু</strong> : '✕ বন্ধ'}</li>
                            <li>Nagad: {d.payment_nagad_enabled ? <strong style={{ color: 'var(--pri)' }}>✓ চালু</strong> : '✕ বন্ধ'}</li>
                            <li>SSLCommerz: {d.payment_sslcommerz_enabled ? <strong style={{ color: 'var(--pri)' }}>✓ চালু</strong> : '✕ বন্ধ'}</li>
                        </ul>
                        <small style={{ color: 'var(--mut)', display: 'block', marginTop: 10 }}>
                            SSLCommerz ব্যবহারের জন্য <code>.env</code> ফাইলে <code>SSLCOMMERZ_STORE_ID</code> ও <code>SSLCOMMERZ_SECRET</code> সেট করতে হবে।
                        </small>
                    </div>
                </div>
            )}

            {/* ============ TAB: FEATURES ============ */}
            {tab === 'features' && (
                <form className="card fd" onSubmit={submit} style={{ maxWidth: 640 }}>
                    <h3 style={{ fontSize: 18, marginBottom: 6, color: 'var(--pri)', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Icon name="puzzle" size={18} color="var(--pri)" />
                        <span>ফিচার মডিউল টগল</span>
                    </h3>
                    <p style={{ color: 'var(--mut)', fontSize: 13.5, marginBottom: 14 }}>
                        প্লাগ-অ্যান্ড-প্লে মডিউল — যেকোনো ফিচার অন/অফ করুন। বন্ধ করলে সংশ্লিষ্ট UI ফ্রন্টএন্ড থেকে সরে যাবে।
                    </p>

                    <Toggle name="feature_coupons" label="কুপন / ডিসকাউন্ট সিস্টেম" hint="চেকআউটে কুপন কোড ইনপুট দেখাবে" icon="ticket" />
                    <Toggle name="feature_variations" label="প্রোডাক্ট ভেরিয়েশন (সাইজ/কালার)" hint="প্রোডাক্ট পেজে ভেরিয়েন্ট সিলেক্টর দেখাবে" icon="layers" />
                    <Toggle name="feature_reviews" label="কাস্টমার রিভিউ ও রেটিং" hint="প্রোডাক্ট পেজে রিভিউ ও স্টার রেটিং দেখাবে" icon="star" />
                    <Toggle name="feature_wishlist" label="উইশলিস্ট (পছন্দের তালিকা)" hint="কার্টে ও কার্ডে উইশলিস্ট বাটন দেখাবে" icon="heart" />

                    <button className="btn" disabled={form.processing} style={{ marginTop: 16 }}>
                        {form.processing ? 'সংরক্ষণ হচ্ছে...' : 'ফিচার সেটিংস সংরক্ষণ'}
                    </button>
                </form>
            )}

            {/* ============ TAB: DATA ============ */}
            {tab === 'data' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 20 }}>
                    <div className="card" style={{ maxWidth: 520 }}>
                        <h3 style={{ fontSize: 18, marginBottom: 8, color: 'var(--pri)', display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Icon name="database" size={18} color="var(--pri)" />
                            <span>ডেমো কন্টেন্ট ম্যানেজমেন্ট</span>
                        </h3>
                        <p style={{ color: 'var(--mut)', fontSize: 13.5, marginBottom: 16 }}>
                            ক্লায়েন্ট হ্যান্ডওভারের সময় ডেমো প্রোডাক্ট, ক্যাটাগরি ও টেস্ট অর্ডার মুছে স্টোর ফাঁকা করুন।
                            <strong style={{ color: '#c0392b' }}> এটি ফেরানো যাবে না!</strong>
                        </p>

                        <button
                            type="button"
                            className="btn"
                            style={{ background: '#c0392b', width: '100%', marginBottom: 10, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                            onClick={() => {
                                if (confirm('সব ডেমো প্রোডাক্ট, ক্যাটাগরি ও অর্ডার মুছে যাবে। আপনি কি নিশ্চিত?')) {
                                    form.post(`${pfx}/settings/clear-data`, {
                                        data: { type: 'all' },
                                        preserveScroll: true,
                                    });
                                }
                            }}
                        >
                            <Icon name="trash" size={16} color="#fff" />
                            <span>ডেমো কন্টেন্ট মুছে ফেলুন (ক্লিন হ্যান্ডওভার)</span>
                        </button>

                        <button
                            type="button"
                            className="btn"
                            style={{ width: '100%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                            onClick={() => {
                                form.post(`${pfx}/settings/reset-demo`, { preserveScroll: true });
                            }}
                        >
                            <Icon name="refresh" size={16} color="#fff" />
                            <span>Reset to Default Data — ডিফল্ট ডেমো রিস্টোর করুন</span>
                        </button>
                        <small style={{ color: 'var(--mut)', display: 'block', marginTop: 10 }}>
                            "Reset" ডেমো প্রোডাক্ট/ক্যাটাগরি আবার তৈরি করবে। "Clear" সবকিছু মুছে স্টোর খালি করবে।
                        </small>
                    </div>

                    <div className="card" style={{ height: 'fit-content', background: 'var(--soft)' }}>
                        <h3 style={{ fontSize: 18, marginBottom: 10, color: 'var(--pri)', display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Icon name="zap" size={18} color="var(--pri)" />
                            <span>ফ্রেশ ইনস্টল (CLI)</span>
                        </h3>
                        <p style={{ fontSize: 13.5, lineHeight: 1.8 }}>
                            নতুন ক্লায়েন্ট সাইট সেটআপের সময় টার্মিনাল থেকে চালান:
                        </p>
                        <pre style={{ background: '#1e293b', color: '#e2e8f0', padding: 12, borderRadius: 10, fontSize: 13, overflowX: 'auto' }}>
{'php artisan migrate:fresh --seed'}
                        </pre>
                        <p style={{ fontSize: 13.5, marginTop: 10, lineHeight: 1.8 }}>
                            এক কমান্ডেই ডেমো প্রোডাক্ট, ক্যাটাগরি, সাইট সেটিংস ও ডিফল্ট অ্যাডমিন অ্যাকাউন্ট তৈরি হবে।
                        </p>
                    </div>
                </div>
            )}
        </>
    );
}

SettingsIndex.layout = (page) => <AdminLayout>{page}</AdminLayout>;
