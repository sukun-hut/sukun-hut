import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import Thumb from '../../Components/Thumb';
import StoreLayout from '../../Layouts/StoreLayout';
import { useCart } from '../../lib/cart';
import { PAY, bn, csrf, delivery, hue, tk } from '../../lib/format';

export default function Checkout({ buy }) {
    const { shop } = usePage().props;
    const cart = useCart();
    const [buyQty, setBuyQty] = useState(1);
    const [pct, setPct] = useState(0);
    const [cMsg, setCMsg] = useState('');
    const form = useForm({ name: '', phone: '', address: '', zone: 'in', payment_method: 'cod', trx_id: '', coupon: '' });
    const d = form.data;

    const lines = buy ? [{ id: buy.id, name: buy.name, price: buy.price, image: buy.images[0], emoji: buy.emoji, qty: buyQty }] : cart.items;
    const setQty = (id, q) => (buy ? setBuyQty(Math.max(1, Math.min(20, q))) : cart.setQty(id, q));
    const sub = lines.reduce((a, l) => a + l.price * l.qty, 0);
    const fee = delivery(shop, sub, d.zone);
    const disc = Math.round((sub * pct) / 100);
    const total = sub + fee - disc;

    const applyCoupon = async () => {
        try {
            const r = await fetch('/coupon', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Accept: 'application/json', 'X-XSRF-TOKEN': csrf() },
                body: JSON.stringify({ code: d.coupon }),
            });
            const j = await r.json();
            setPct(j.percent || 0);
            setCMsg(j.valid ? `${bn(j.percent)}% ছাড় প্রয়োগ হয়েছে` : 'কুপন কোডটি সঠিক নয়');
        } catch { setCMsg('কুপন যাচাই করা যায়নি'); }
    };

    const submit = (e) => {
        e.preventDefault();
        form.transform((x) => ({ ...x, items: lines.map((l) => ({ id: l.id, qty: l.qty })) }))
            .post('/checkout', { onSuccess: () => { if (!buy) cart.clear(); } });
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
            <label htmlFor={id}>{label}</label>
            {textarea ? <textarea id={id} rows={3} value={d[id]} onChange={(e) => form.setData(id, e.target.value)} {...props} /> : <input id={id} value={d[id]} onChange={(e) => form.setData(id, e.target.value)} {...props} />}
            <div className="er">{form.errors[id]}</div>
        </>
    );

    return (
        <div className="w" style={{ maxWidth: 640, padding: '24px 18px' }}>
            <Head title="চেকআউট – সুকুন হাট" />
            <h1 style={{ fontSize: 30 }}>{buy ? 'এখনই কিনুন' : 'অর্ডারের তথ্য'}</h1>
            {lines.map((l) => (
                <div className="ci" key={l.id}>
                    <div className="e" style={{ background: `hsl(${hue(l.id)} 45% 88%)` }}><Thumb src={l.image} emoji={l.emoji} /></div>
                    <div>
                        <b>{l.name}</b>
                        <div className="q">
                            <button type="button" onClick={() => setQty(l.id, l.qty - 1)} aria-label="কমান">−</button>
                            {bn(l.qty)}
                            <button type="button" onClick={() => setQty(l.id, l.qty + 1)} aria-label="বাড়ান">+</button>
                        </div>
                    </div>
                    <b>{tk(l.price * l.qty)}</b>
                </div>
            ))}
            <div className="er">{form.errors.items}</div>
            <form className="fd" onSubmit={submit}>
                {field('name', 'আপনার নাম', { type: 'text', autoComplete: 'name' })}
                {field('phone', 'মোবাইল নম্বর', { type: 'tel', placeholder: '01XXXXXXXXX', autoComplete: 'tel' })}
                {field('address', 'পূর্ণ ঠিকানা', { placeholder: 'বাসা/রোড, থানা, জেলা' }, true)}
                <label htmlFor="zone">ডেলিভারি এলাকা</label>
                <select id="zone" value={d.zone} onChange={(e) => form.setData('zone', e.target.value)}>
                    <option value="in">ঢাকার ভেতরে</option>
                    <option value="out">ঢাকার বাইরে</option>
                </select>
                <label>পেমেন্ট পদ্ধতি</label>
                <div className="pay">
                    {Object.entries(PAY).map(([k, v]) => (
                        <label key={k}><input type="radio" name="pm" checked={d.payment_method === k} onChange={() => form.setData('payment_method', k)} />{v}</label>
                    ))}
                </div>
                {d.payment_method !== 'cod' && (
                    <>
                        <p style={{ margin: '8px 0 0', color: 'var(--mut)' }}>{PAY[d.payment_method]} নম্বর {shop[d.payment_method]} এ মোট {tk(total)} Send Money করে TrxID লিখুন।</p>
                        {field('trx_id', 'TrxID', { type: 'text' })}
                    </>
                )}
                <label htmlFor="coupon">কুপন কোড (থাকলে)</label>
                <div style={{ display: 'flex', gap: 8 }}>
                    <input id="coupon" value={d.coupon} onChange={(e) => form.setData('coupon', e.target.value)} />
                    <button type="button" className="btn o" onClick={applyCoupon} style={{ flex: 'none' }}>প্রয়োগ</button>
                </div>
                <div className="er" style={{ color: pct ? 'var(--pri)' : undefined }}>{cMsg}</div>
                <div className="sm">
                    <div>সাবটোটাল<span>{tk(sub)}</span></div>
                    <div>ডেলিভারি<span>{fee ? tk(fee) : 'ফ্রি'}</span></div>
                    {disc > 0 && <div>কুপন ছাড়<span>-{tk(disc)}</span></div>}
                    <div className="t">মোট<span>{tk(total)}</span></div>
                </div>
                <button className="btn" style={{ width: '100%' }} disabled={form.processing}>{form.processing ? 'অর্ডার হচ্ছে...' : 'অর্ডার কনফার্ম করুন'}</button>
            </form>
        </div>
    );
}

Checkout.layout = (page) => <StoreLayout>{page}</StoreLayout>;
