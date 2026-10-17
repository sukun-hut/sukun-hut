import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import StoreLayout from '../../Layouts/StoreLayout';
import { PAY, bn, tk } from '../../lib/format';

export default function Thanks({ order: o }) {
    const { shop } = usePage().props;
    const [copied, setCopied] = useState(false);
    const [showModal, setShowModal] = useState(true);

    const text =
        `অর্ডার #${o.number}\nনাম: ${o.name}\nমোবাইল: ${o.phone}\nঠিকানা: ${o.address}\n\n` +
        o.items.map((i) => `• ${i.product_name}${i.variation_name ? ` (${i.variation_name})` : ''} × ${i.quantity} = ${tk(i.price * i.quantity)}`).join('\n') +
        `\n\nসাবটোটাল: ${tk(o.subtotal)}\nডেলিভারি: ${o.delivery_fee ? tk(o.delivery_fee) : 'ফ্রি'}\n` +
        (o.discount ? `ছাড়: -${tk(o.discount)}\n` : '') +
        `মোট: ${tk(o.total)}\nপেমেন্ট: ${PAY[o.payment_method] || 'ক্যাশ অন ডেলিভারি'}`;

    useEffect(() => {
        try {
            window.fbq?.('track', 'Purchase', { value: o.total, currency: 'BDT' });
        } catch {
            /* ignore */
        }
    }, []);

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 1800);
        } catch {
            window.prompt('কপি করুন', text);
        }
    };

    return (
        <div className="w" style={{ maxWidth: 620, padding: '30px 18px 60px' }}>
            <Head title="অর্ডার কনফার্মড – সুকুন হাট" />

            {/* CELEBRATORY ORDER CONFIRMED POPUP MODAL */}
            {showModal && (
                <div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(0, 0, 0, 0.65)',
                        zIndex: 9999,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 18,
                        backdropFilter: 'blur(3px)',
                    }}
                    onClick={() => setShowModal(false)}
                >
                    <div
                        style={{
                            background: 'var(--card)',
                            border: '2px solid var(--pri)',
                            borderRadius: 20,
                            maxWidth: 480,
                            width: '100%',
                            padding: '30px 24px',
                            textAlign: 'center',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                            position: 'relative',
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div style={{ fontSize: 54, lineHeight: 1, marginBottom: 12 }}>🎉</div>
                        <h2 style={{ fontSize: 26, color: 'var(--pri)', margin: '0 0 6px' }}>
                            Order Confirmed!
                        </h2>
                        <h3 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 10px' }}>
                            আপনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে
                        </h3>
                        <div
                            style={{
                                background: 'var(--soft)',
                                padding: '10px 16px',
                                borderRadius: 10,
                                margin: '14px 0',
                                display: 'inline-block',
                            }}
                        >
                            <span style={{ color: 'var(--mut)', fontSize: 14 }}>অর্ডার নম্বর:</span>{' '}
                            <strong style={{ fontSize: 18, color: 'var(--pri)' }}>#{o.number}</strong>
                        </div>
                        <p style={{ color: 'var(--mut)', fontSize: 15, margin: '10px 0 20px', lineHeight: 1.5 }}>
                            ধন্যবাদ, <strong>{o.name}</strong>! আপনার অর্ডারটি নিশ্চিত করা হয়েছে।
                            আমাদের প্রতিনিধি শীঘ্রই <strong>{o.phone}</strong> নম্বরে কল করে ডেলিভারির অগ্রগতি জানিয়ে দেবেন।
                        </p>
                        <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                            <button
                                className="btn"
                                style={{ flex: 1 }}
                                onClick={() => setShowModal(false)}
                            >
                                রসিদ / বিস্তারিত দেখুন
                            </button>
                            <Link className="btn o" href="/" style={{ flex: 1 }}>
                                হোমপেজে যান
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {/* RECEIPT / SUMMARY VIEW */}
            <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 48, marginBottom: 6 }}>✅</div>
                <h1 style={{ fontSize: 28, color: 'var(--pri)' }}>অর্ডার কনফার্মেশন রসিদ</h1>
                <p style={{ color: 'var(--mut)', marginTop: 4 }}>
                    অর্ডার নম্বর: <b>#{o.number}</b> | পেমেন্ট: <b>ক্যাশ অন ডেলিভারি</b>
                </p>
            </div>

            <div className="card" style={{ marginTop: 20, padding: 18 }}>
                <h3 style={{ fontSize: 18, borderBottom: '1px solid var(--line)', paddingBottom: 8, marginBottom: 12 }}>
                    অর্ডারের আইটেমসমূহ
                </h3>
                <div className="sm" style={{ margin: 0, border: 'none', padding: 0 }}>
                    {o.items.map((i, k) => (
                        <div key={k} style={{ padding: '6px 0', borderBottom: '1px dashed var(--line)' }}>
                            <span>
                                <strong>{i.product_name}</strong>
                                {i.variation_name && (
                                    <small style={{ color: 'var(--pri)', fontWeight: 600, display: 'block' }}>
                                        ভেরিয়েশন: {i.variation_name}
                                    </small>
                                )}
                                <span style={{ color: 'var(--mut)', fontSize: 13 }}> × {bn(i.quantity)}</span>
                            </span>
                            <b>{tk(i.price * i.quantity)}</b>
                        </div>
                    ))}
                    <div style={{ paddingTop: 8 }}>সাবটোটাল<span>{tk(o.subtotal)}</span></div>
                    <div>ডেলিভারি চার্জ<span>{o.delivery_fee ? tk(o.delivery_fee) : 'ফ্রি'}</span></div>
                    {o.discount > 0 && <div>ছাড়<span>-{tk(o.discount)}</span></div>}
                    <div className="t">সর্বমোট প্রদেয়<span>{tk(o.total)}</span></div>
                </div>
            </div>

            <div className="card" style={{ marginTop: 14, padding: 18 }}>
                <h3 style={{ fontSize: 18, borderBottom: '1px solid var(--line)', paddingBottom: 8, marginBottom: 10 }}>
                    ডেলিভারির ঠিকানা
                </h3>
                <p style={{ margin: '4px 0', fontSize: 15 }}>
                    <strong>নাম:</strong> {o.name}<br />
                    <strong>মোবাইল:</strong> <a href={`tel:${o.phone}`}>{o.phone}</a><br />
                    <strong>ঠিকানা:</strong> {o.address}
                </p>
            </div>

            <div style={{ marginTop: 20 }}>
                <p style={{ color: 'var(--mut)', fontSize: 14, textAlign: 'center', marginBottom: 12 }}>
                    দ্রুত যোগাযোগের জন্য সরাসরি হোয়াটসঅ্যাপ বা মেসেঞ্জারে অর্ডারের তথ্য পাঠাতে পারেন:
                </p>
                <div className="row2">
                    <a className="btn o" href={`https://wa.me/${shop.whatsapp}?text=${encodeURIComponent(text)}`} target="_blank" rel="noopener">
                        💬 হোয়াটসঅ্যাপ
                    </a>
                    <a className="btn o" href={shop.messenger} target="_blank" rel="noopener">
                        ⚡ মেসেঞ্জার
                    </a>
                </div>
                <button className="btn o" style={{ width: '100%', marginTop: 8 }} onClick={copy}>
                    {copied ? '✓ অর্ডারের লেখা কপি হয়েছে' : '📋 অর্ডারের লেখা কপি করুন'}
                </button>
                <Link className="btn" style={{ width: '100%', marginTop: 10 }} href="/">
                    আরও কেনাকাটা করুন
                </Link>
            </div>
        </div>
    );
}

Thanks.layout = (page) => <StoreLayout>{page}</StoreLayout>;
