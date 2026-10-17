import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import Thumb from '../../Components/Thumb';
import StoreLayout from '../../Layouts/StoreLayout';
import { useCart } from '../../lib/cart';
import { bn, csrf, delivery, hue, tk } from '../../lib/format';

export default function Checkout({ buy }) {
    const { shop } = usePage().props;
    const cart = useCart();
    const [buyQty, setBuyQty] = useState(1);
    const [pct, setPct] = useState(0);
    const [cMsg, setCMsg] = useState('');
    const form = useForm({
        name: '',
        phone: '',
        address: '',
        zone: 'in',
        payment_method: 'cod',
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
            setCMsg(j.valid ? `${bn(j.percent)}% ছাড় প্রয়োগ হয়েছে` : 'কুপন কোডটি সঠিক নয়');
        } catch {
            setCMsg('কুপন যাচাই করা যায়নি');
        }
    };

    const submit = (e) => {
        e.preventDefault();
        form.transform((x) => ({
            ...x,
            payment_method: 'cod',
            items: lines.map((l) => ({
                id: l.id,
                variation_id: l.variation_id || null,
                qty: l.qty,
            })),
        })).post('/checkout', {
            onSuccess: () => {
                if (!buy) cart.clear();
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

                {/* PAYMENT METHOD: ONLY COD ACTIVE, BKASH/NAGAD DISABLED */}
                <label style={{ fontWeight: 600, marginTop: 14 }}>পেমেন্ট পদ্ধতি</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 12,
                            padding: '12px 14px',
                            border: '2px solid var(--pri)',
                            borderRadius: 10,
                            background: 'var(--soft)',
                        }}
                    >
                        <input
                            type="radio"
                            id="pm_cod"
                            name="payment_method"
                            checked={true}
                            readOnly
                            style={{ width: 'auto', margin: 0 }}
                        />
                        <label htmlFor="pm_cod" style={{ margin: 0, flex: 1, cursor: 'pointer' }}>
                            <strong style={{ fontSize: 16, color: 'var(--pri)', display: 'block' }}>
                                ক্যাশ অন ডেলিভারি (Cash on Delivery)
                            </strong>
                            <small style={{ color: 'var(--mut)' }}>
                                পণ্য হাতে পেয়ে মূল্য পরিশোধ করুন। কোনো অগ্রিম পেমেন্টের প্রয়োজন নেই।
                            </small>
                        </label>
                        <span style={{ background: 'var(--pri)', color: '#fff', fontSize: 12, padding: '3px 10px', borderRadius: 99, fontWeight: 600 }}>
                            সচল
                        </span>
                    </div>

                    <div style={{ display: 'flex', gap: 10 }}>
                        <div
                            style={{
                                flex: 1,
                                padding: '10px 12px',
                                border: '1px dashed var(--line)',
                                borderRadius: 10,
                                background: 'var(--card)',
                                opacity: 0.6,
                                cursor: 'not-allowed',
                            }}
                        >
                            <span style={{ fontWeight: 600 }}>বিকাশ (bKash)</span>
                            <small style={{ display: 'block', color: '#c0392b', fontSize: 11, fontWeight: 500 }}>
                                আপাতত বন্ধ রয়েছে
                            </small>
                        </div>
                        <div
                            style={{
                                flex: 1,
                                padding: '10px 12px',
                                border: '1px dashed var(--line)',
                                borderRadius: 10,
                                background: 'var(--card)',
                                opacity: 0.6,
                                cursor: 'not-allowed',
                            }}
                        >
                            <span style={{ fontWeight: 600 }}>নগদ (Nagad)</span>
                            <small style={{ display: 'block', color: '#c0392b', fontSize: 11, fontWeight: 500 }}>
                                আপাতত বন্ধ রয়েছে
                            </small>
                        </div>
                    </div>
                </div>

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

                <div className="sm">
                    <div>সাবটোটাল<span>{tk(sub)}</span></div>
                    <div>
                        ডেলিভারি চার্জ
                        <span>{fee ? tk(fee) : <span style={{ color: 'var(--pri)', fontWeight: 600 }}>ফ্রি ডেলিভারি</span>}</span>
                    </div>
                    {shop.free_over > 0 && sub < shop.free_over && fee > 0 && (
                        <div style={{ fontSize: 12.5, color: 'var(--mut)' }}>
                            <span>💡 আর {tk(shop.free_over - sub)} এর পণ্য যোগ করলেই ফ্রি ডেলিভারি!</span>
                        </div>
                    )}
                    {disc > 0 && <div>কুপন ছাড়<span>-{tk(disc)}</span></div>}
                    <div className="t">সর্বমোট<span>{tk(total)}</span></div>
                </div>

                <button
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
