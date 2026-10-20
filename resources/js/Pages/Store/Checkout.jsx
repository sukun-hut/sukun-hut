import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import Thumb from '../../Components/Thumb';
import { Icon } from '../../Components/Icons';
import StoreLayout from '../../Layouts/StoreLayout';
import { useCart } from '../../lib/cart';
import { bn, csrf, delivery, hue, tk } from '../../lib/format';
import { toast } from '../../lib/toast';

export default function Checkout({ buy }) {
    const { shop } = usePage().props;
    const cart = useCart();
    const [buyQty, setBuyQty] = useState(1);
    const [pct, setPct] = useState(0);
    const [cMsg, setCMsg] = useState('');
    const initialPayment = shop.payment_cod_enabled
        ? 'cod'
        : shop.payment_bkash_enabled
        ? 'bkash'
        : shop.payment_nagad_enabled
        ? 'nagad'
        : 'cod';

    const form = useForm({
        name: '',
        phone: '',
        address: '',
        zone: 'in',
        payment_method: initialPayment,
        trx_id: '',
        coupon: '',
    });
    const d = form.data;

    const lines = buy
        ? [
              {
                  key: buy.selected_variation ? `${buy.id}_${buy.selected_variation.id}` : String(buy.id),
                  id: buy.id,
                  variation_id: buy.selected_variation ? buy.selected_variation.id : null,
                  variation_name: buy.selected_variation ? buy.selected_variation.name : null,
                  name: buy.name,
                  price: buy.selected_variation ? buy.selected_variation.price : buy.price,
                  image: buy.images?.[0],
                  emoji: buy.emoji,
                  qty: buyQty,
              },
          ]
        : cart.items;

    const setQty = (key, q) =>
        buy ? setBuyQty(Math.max(1, Math.min(20, q))) : cart.setQty(key, q);

    const sub = lines.reduce((a, l) => a + Number(l.price) * Number(l.qty), 0);
    const fee = delivery(shop, sub, d.zone);
    const disc = Math.round((sub * pct) / 100);
    const total = sub + fee - disc;

    const applyCoupon = async () => {
        if (!d.coupon || !d.coupon.trim()) {
            toast.error('কুপন কোড লিখুন');
            return;
        }
        try {
            const r = await fetch('/coupon', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-XSRF-TOKEN': csrf(),
                },
                body: JSON.stringify({ code: d.coupon }),
            });
            const j = await r.json();
            setPct(j.percent || 0);
            if (j.valid) {
                setCMsg(`${bn(j.percent)}% ছাড় প্রয়োগ হয়েছে`);
                toast.success(`✓ কুপন কোড সফল! ${bn(j.percent)}% ছাড় পেয়েছেন`);
            } else {
                setCMsg('কুপন কোডটি সঠিক নয়');
                toast.error('✕ কুপন কোডটি সঠিক নয় বা মেয়াদ শেষ');
            }
        } catch {
            setCMsg('কুপন যাচাই করা যায়নি');
            toast.error('✕ কুপন যাচাই করা যায়নি');
        }
    };

    const handlePhoneChange = (val) => {
        // Convert Bengali digits (০-৯) to English digits (0-9)
        const converted = String(val).replace(/[০-৯]/g, (d) => '০১২৩৪৫৬৭৮৯'.indexOf(d));
        // Strip everything except numbers (0-9) and limit to 11 digits
        const onlyDigits = converted.replace(/\D/g, '').slice(0, 11);
        form.setData('phone', onlyDigits);
    };

    const submit = (e) => {
        e.preventDefault();

        // 1. Client-side pre-validation with immediate Toast Error feedback
        if (!d.name || !d.name.trim()) {
            toast.error('অনুগ্রহ করে আপনার নাম লিখুন');
            document.getElementById('name')?.focus();
            return;
        }

        if (d.name.trim().length < 3) {
            toast.error('নাম অন্তত ৩ অক্ষরের হতে হবে');
            document.getElementById('name')?.focus();
            return;
        }

        if (!d.phone || !d.phone.trim()) {
            toast.error('অনুগ্রহ করে মোবাইল নম্বর লিখুন');
            document.getElementById('phone')?.focus();
            return;
        }

        if (!/^01[3-9]\d{8}$/.test(d.phone.trim())) {
            toast.error('সঠিক ১১ সংখ্যার মোবাইল নম্বর দিন (যেমন: 017XXXXXXXX)');
            document.getElementById('phone')?.focus();
            return;
        }

        if (!d.address || !d.address.trim()) {
            toast.error('অনুগ্রহ করে পূর্ণ ঠিকানা লিখুন (বাসা/রোড, থানা, জেলা)');
            document.getElementById('address')?.focus();
            return;
        }

        if (d.address.trim().length < 10) {
            toast.error('থানা ও জেলাসহ পূর্ণ ঠিকানা বিস্তারিত লিখুন (অন্তত ১০ অক্ষর)');
            document.getElementById('address')?.focus();
            return;
        }

        if ((d.payment_method === 'bkash' || d.payment_method === 'nagad') && (!d.trx_id || !d.trx_id.trim())) {
            toast.error('পেমেন্টের ট্রানজেকশন আইডি (TrxID) লিখুন');
            document.getElementById('trx_id')?.focus();
            return;
        }

        if (!lines || lines.length === 0) {
            toast.error('আপনার কার্ট খালি। আগে পণ্য বাছাই করুন');
            return;
        }

        form.clearErrors();

        form.transform((x) => ({
            ...x,
            items: lines.map((l) => ({
                id: l.id,
                variation_id: l.variation_id || null,
                qty: l.qty,
            })),
        }));

        form.post('/checkout', {
            onSuccess: () => {
                if (!buy) cart.clear();
                toast.success('✓ আপনার অর্ডারটি সফলভাবে সম্পন্ন হয়েছে!');
            },
            onError: (errors) => {
                const keys = Object.keys(errors || {});
                if (keys.length > 0) {
                    const firstMsg = errors[keys[0]];
                    toast.error(typeof firstMsg === 'string' ? firstMsg : 'ফর্মে কিছু তথ্য সঠিক নয়');
                    const el = document.getElementById(keys[0]);
                    (el || document.querySelector('.er:not(:empty)'))?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                } else {
                    toast.error('অর্ডার সম্পন্ন করা যায়নি। অনুগ্রহ করে পেজ রিফ্রেশ করে আবার চেষ্টা করুন।');
                }
            },
        });
    };

    if (!lines.length) {
        return (
            <div className="w" style={{ padding: '40px 0', textAlign: 'center' }}>
                <Head title="চেকআউট – সুকুন হাট" />
                <p className="empty">কার্ট খালি। আগে পণ্য বেছে নিন।</p>
                <Link className="btn" href="/">পণ্য দেখুন</Link>
            </div>
        );
    }

    const field = (id, label, props = {}, textarea = false) => (
        <>
            <label htmlFor={id} style={{ fontWeight: 600 }}>{label}</label>
            {textarea ? (
                <textarea
                    id={id}
                    rows={3}
                    value={d[id]}
                    onChange={(e) => form.setData(id, e.target.value)}
                    {...props}
                />
            ) : id === 'phone' ? (
                <input
                    id="phone"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel"
                    placeholder="01XXXXXXXXX"
                    value={d.phone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    onKeyDown={(e) => {
                        // Allow navigation, delete, backspace, and shortcuts
                        if (['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'Enter'].includes(e.key)) return;
                        if (e.ctrlKey || e.metaKey) return;
                        // Block any non-digit character directly
                        if (!/^[0-9০-৯]$/.test(e.key)) {
                            e.preventDefault();
                        }
                    }}
                    {...props}
                />
            ) : (
                <input
                    id={id}
                    value={d[id]}
                    onChange={(e) => form.setData(id, e.target.value)}
                    {...props}
                />
            )}
            <div className="er">{form.errors[id]}</div>
        </>
    );

    return (
        <div className="w" style={{ maxWidth: 640, padding: '24px 18px' }}>
            <Head title="চেকআউট – সুকুন হাট" />
            <h1 style={{ fontSize: 30 }}>{buy ? 'এখনই কিনুন' : 'অর্ডারের তথ্য'}</h1>

            {lines.map((l) => {
                const itemKey = l.key || String(l.id);
                return (
                    <div className="ci" key={itemKey}>
                        <div className="e" style={{ background: `hsl(${hue(l.id)} 45% 88%)` }}>
                            <Thumb src={l.image} emoji={l.emoji} />
                        </div>
                        <div>
                            <b>{l.name}</b>
                            {l.variation_name && (
                                <small style={{ display: 'block', color: 'var(--pri)', fontWeight: 600 }}>
                                    {l.variation_name}
                                </small>
                            )}
                            <div className="q">
                                <button type="button" onClick={() => setQty(itemKey, l.qty - 1)} aria-label="কমান">−</button>
                                {bn(l.qty)}
                                <button type="button" onClick={() => setQty(itemKey, l.qty + 1)} aria-label="বাড়ান">+</button>
                            </div>
                        </div>
                        <b>{tk(l.price * l.qty)}</b>
                    </div>
                );
            })}
            <div className="er">{form.errors.items}</div>

            <form className="fd" onSubmit={submit}>
                {field('name', 'আপনার নাম *', { type: 'text', autoComplete: 'name', placeholder: 'যেমন: মোহাম্মদ আব্দুল্লাহ', required: true })}
                {field('phone', 'মোবাইল নম্বর (১১ ডিজিট) *', { type: 'tel', placeholder: '01XXXXXXXXX', autoComplete: 'tel', required: true })}
                {field('address', 'পূর্ণ ঠিকানা (বাসা/রোড, থানা, জেলা) *', { placeholder: 'যেমন: বাড়ি ১২, রোড ৪, সেক্টর ৭, উত্তরা, ঢাকা', required: true }, true)}

                <label htmlFor="zone" style={{ fontWeight: 600 }}>ডেলিভারি এলাকা *</label>
                <select id="zone" value={d.zone} onChange={(e) => form.setData('zone', e.target.value)}>
                    <option value="in">ঢাকার ভেতরে ({shop.delivery_in ? tk(shop.delivery_in) : 'ফ্রি'})</option>
                    <option value="out">ঢাকার বাইরে ({shop.delivery_out ? tk(shop.delivery_out) : 'ফ্রি'})</option>
                </select>

                {/* DYNAMIC PAYMENT METHOD GATEWAYS */}
                <label style={{ fontWeight: 600, marginTop: 14 }}>পেমেন্ট পদ্ধতি *</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {shop.payment_cod_enabled && (
                        <div
                            onClick={() => form.setData('payment_method', 'cod')}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 12,
                                padding: '12px 14px',
                                border: d.payment_method === 'cod' ? '2px solid var(--pri)' : '1px solid var(--line)',
                                borderRadius: 10,
                                background: d.payment_method === 'cod' ? 'var(--soft)' : 'var(--card)',
                                cursor: 'pointer',
                            }}
                        >
                            <input
                                type="radio"
                                id="pm_cod"
                                name="payment_method"
                                checked={d.payment_method === 'cod'}
                                onChange={() => form.setData('payment_method', 'cod')}
                                style={{ width: 'auto', margin: 0, cursor: 'pointer' }}
                            />
                            <label htmlFor="pm_cod" style={{ margin: 0, flex: 1, cursor: 'pointer' }}>
                                <strong style={{ fontSize: 16, color: 'var(--pri)', display: 'block' }}>
                                    ক্যাশ অন ডেলিভারি (Cash on Delivery)
                                </strong>
                                <small style={{ color: 'var(--mut)' }}>
                                    পণ্য হাতে পেয়ে মূল্য পরিশোধ করুন। কোনো অগ্রিম পেমেন্টের প্রয়োজন নেই।
                                </small>
                            </label>
                        </div>
                    )}

                    {shop.payment_bkash_enabled && (
                        <div
                            onClick={() => form.setData('payment_method', 'bkash')}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 8,
                                padding: '12px 14px',
                                border: d.payment_method === 'bkash' ? '2px solid #e2136e' : '1px solid var(--line)',
                                borderRadius: 10,
                                background: d.payment_method === 'bkash' ? '#fdf2f7' : 'var(--card)',
                                cursor: 'pointer',
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <input
                                    type="radio"
                                    id="pm_bkash"
                                    name="payment_method"
                                    checked={d.payment_method === 'bkash'}
                                    onChange={() => form.setData('payment_method', 'bkash')}
                                    style={{ width: 'auto', margin: 0, cursor: 'pointer' }}
                                />
                                <label htmlFor="pm_bkash" style={{ margin: 0, flex: 1, cursor: 'pointer' }}>
                                    <strong style={{ fontSize: 16, color: '#e2136e', display: 'block' }}>
                                        বিকাশ পেমেন্ট (bKash)
                                    </strong>
                                    <small style={{ color: 'var(--mut)' }}>
                                        বিকাশের মাধ্যমে সরাসরি পেমেন্ট বা সেন্ড মানি করুন।
                                    </small>
                                </label>
                            </div>
                            {d.payment_method === 'bkash' && (
                                <div style={{ background: '#fff', border: '1px solid #f9c2db', padding: '10px 12px', borderRadius: 8, marginTop: 4 }}>
                                    <p style={{ margin: '0 0 6px', fontSize: 13, color: '#12261f' }}>
                                        বিকাশ নম্বর: <strong style={{ color: '#e2136e', fontSize: 15 }}>{shop.bkash_number || shop.phone}</strong> (Send Money / Payment)
                                    </p>
                                    <p style={{ margin: '0 0 8px', fontSize: 12.5, color: 'var(--mut)' }}>
                                        পেমেন্ট সম্পন্ন করে নিচের বক্সে আপনার বিকাশ TrxID (Transaction ID) লিখুন:
                                    </p>
                                    <input
                                        type="text"
                                        placeholder="যেমন: 9J7K3X1L"
                                        value={d.trx_id}
                                        onChange={(e) => form.setData('trx_id', e.target.value)}
                                        style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #e2136e' }}
                                    />
                                    <div className="er">{form.errors.trx_id}</div>
                                </div>
                            )}
                        </div>
                    )}

                    {shop.payment_nagad_enabled && (
                        <div
                            onClick={() => form.setData('payment_method', 'nagad')}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 8,
                                padding: '12px 14px',
                                border: d.payment_method === 'nagad' ? '2px solid #f7941d' : '1px solid var(--line)',
                                borderRadius: 10,
                                background: d.payment_method === 'nagad' ? '#fffaf2' : 'var(--card)',
                                cursor: 'pointer',
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <input
                                    type="radio"
                                    id="pm_nagad"
                                    name="payment_method"
                                    checked={d.payment_method === 'nagad'}
                                    onChange={() => form.setData('payment_method', 'nagad')}
                                    style={{ width: 'auto', margin: 0, cursor: 'pointer' }}
                                />
                                <label htmlFor="pm_nagad" style={{ margin: 0, flex: 1, cursor: 'pointer' }}>
                                    <strong style={{ fontSize: 16, color: '#f7941d', display: 'block' }}>
                                        নগদ পেমেন্ট (Nagad)
                                    </strong>
                                    <small style={{ color: 'var(--mut)' }}>
                                        নগদের মাধ্যমে সরাসরি পেমেন্ট বা সেন্ড মানি করুন।
                                    </small>
                                </label>
                            </div>
                            {d.payment_method === 'nagad' && (
                                <div style={{ background: '#fff', border: '1px solid #fed7aa', padding: '10px 12px', borderRadius: 8, marginTop: 4 }}>
                                    <p style={{ margin: '0 0 6px', fontSize: 13, color: '#12261f' }}>
                                        নগদ নম্বর: <strong style={{ color: '#f7941d', fontSize: 15 }}>{shop.nagad_number || shop.phone}</strong> (Send Money / Payment)
                                    </p>
                                    <p style={{ margin: '0 0 8px', fontSize: 12.5, color: 'var(--mut)' }}>
                                        পেমেন্ট সম্পন্ন করে নিচের বক্সে আপনার নগদ TrxID (Transaction ID) লিখুন:
                                    </p>
                                    <input
                                        type="text"
                                        placeholder="যেমন: 7H8B9N2X"
                                        value={d.trx_id}
                                        onChange={(e) => form.setData('trx_id', e.target.value)}
                                        style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #f7941d' }}
                                    />
                                    <div className="er">{form.errors.trx_id}</div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
                <div className="er">{form.errors.payment_method}</div>

                {shop.features?.coupon && (
                    <>
                        <label htmlFor="coupon" style={{ fontWeight: 600, marginTop: 14 }}>কুপন কোড (থাকলে)</label>
                        <div style={{ display: 'flex', gap: 8 }}>
                            <input
                                id="coupon"
                                value={d.coupon}
                                onChange={(e) => form.setData('coupon', e.target.value)}
                                placeholder="কুপন কোড লিখুন"
                            />
                            <button type="button" className="btn o" onClick={applyCoupon} style={{ flex: 'none' }}>
                                প্রয়োগ
                            </button>
                        </div>
                        <div className="er" style={{ color: pct ? 'var(--pri)' : undefined }}>{cMsg}</div>
                    </>
                )}

                {cMsg && (
                    <div
                        style={{
                            background: pct ? 'var(--soft)' : '#fdecea',
                            color: pct ? 'var(--pri)' : '#c0392b',
                            border: `1px solid ${pct ? 'var(--line)' : '#f5c6cb'}`,
                            borderRadius: 10,
                            padding: '10px 14px',
                            fontWeight: 500,
                            marginTop: 12,
                        }}
                    >
                        {cMsg}
                    </div>
                )}

                <div className="sm">
                    <div>সাবটোটাল<span>{tk(sub)}</span></div>
                    <div>
                        ডেলিভারি চার্জ
                        <span>{fee ? tk(fee) : <span style={{ color: 'var(--pri)', fontWeight: 600 }}>ফ্রি ডেলিভারি</span>}</span>
                    </div>
                    {shop.free_over > 0 && sub < shop.free_over && fee > 0 && (
                        <div style={{ fontSize: 12.5, color: 'var(--mut)', display: 'flex', alignItems: 'center', gap: 6 }}>
                            <Icon name="lightbulb" size={14} color="var(--pri)" />
                            <span>আর {tk(shop.free_over - sub)} এর পণ্য যোগ করলেই ফ্রি ডেলিভারি!</span>
                        </div>
                    )}
                    {disc > 0 && <div>কুপন ছাড়<span>-{tk(disc)}</span></div>}
                    <div className="t">সর্বমোট<span>{tk(total)}</span></div>
                </div>

                <button
                    type="submit"
                    className="btn"
                    style={{ width: '100%', padding: '14px 20px', fontSize: 18 }}
                    disabled={form.processing}
                >
                    {form.processing ? 'অর্ডার প্রক্রিয়াধীন...' : 'অর্ডার কনফার্ম করুন'}
                </button>
            </form>
        </div>
    );
}

Checkout.layout = (page) => <StoreLayout>{page}</StoreLayout>;
