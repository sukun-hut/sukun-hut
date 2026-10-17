import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import StoreLayout from '../../Layouts/StoreLayout';
import { PAY, tk } from '../../lib/format';

export default function Thanks({ order: o }) {
    const { shop } = usePage().props;
    const [copied, setCopied] = useState(false);

    const text =
        `অর্ডার #${o.number}\nনাম: ${o.name}\nমোবাইল: ${o.phone}\nঠিকানা: ${o.address}\n\n` +
        o.items.map((i) => `• ${i.product_name} × ${i.quantity} = ${tk(i.price * i.quantity)}`).join('\n') +
        `\n\nসাবটোটাল: ${tk(o.subtotal)}\nডেলিভারি: ${o.delivery_fee ? tk(o.delivery_fee) : 'ফ্রি'}\n` +
        (o.discount ? `ছাড়: -${tk(o.discount)}\n` : '') +
        `মোট: ${tk(o.total)}\nপেমেন্ট: ${PAY[o.payment_method]}${o.trx_id ? ` (TrxID: ${o.trx_id})` : ''}`;

    useEffect(() => {
        try { window.fbq?.('track', 'Purchase', { value: o.total, currency: 'BDT' }); } catch { /* ignore */ }
    }, []);

    const copy = async () => {
        try { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch { window.prompt('কপি করুন', text); }
    };

    return (
        <div className="w" style={{ maxWidth: 560, padding: '30px 18px' }}>
            <Head title="অর্ডার সম্পন্ন – সুকুন হাট" />
            <div style={{ textAlign: 'center', fontSize: 48 }}>✅</div>
            <h1 style={{ textAlign: 'center', fontSize: 28 }}>ধন্যবাদ, অর্ডার গ্রহণ করা হয়েছে</h1>
            <p style={{ textAlign: 'center', color: 'var(--mut)' }}>অর্ডার নম্বর <b>{o.number}</b>। আমরা শীঘ্রই ফোনে কনফার্ম করব।</p>
            <div className="sm">
                {o.items.map((i, k) => <div key={k}><span>{i.product_name} × {i.quantity}</span><span>{tk(i.price * i.quantity)}</span></div>)}
                <div>ডেলিভারি<span>{o.delivery_fee ? tk(o.delivery_fee) : 'ফ্রি'}</span></div>
                {o.discount > 0 && <div>ছাড়<span>-{tk(o.discount)}</span></div>}
                <div className="t">মোট ({PAY[o.payment_method]})<span>{tk(o.total)}</span></div>
            </div>
            <p style={{ color: 'var(--mut)' }}>দ্রুত কনফার্মেশনের জন্য চাইলে অর্ডারের সারাংশ আমাদের হোয়াটসঅ্যাপ বা মেসেঞ্জারে পাঠাতে পারেন।</p>
            <div className="row2">
                <a className="btn o" href={`https://wa.me/${shop.whatsapp}?text=${encodeURIComponent(text)}`} target="_blank" rel="noopener">হোয়াটসঅ্যাপ</a>
                <a className="btn o" href={shop.messenger} target="_blank" rel="noopener">মেসেঞ্জার</a>
            </div>
            <button className="btn o" style={{ width: '100%', marginTop: 8 }} onClick={copy}>{copied ? 'কপি হয়েছে' : 'অর্ডারের লেখা কপি করুন'}</button>
            <Link className="btn" style={{ width: '100%', marginTop: 8 }} href="/">আরও কেনাকাটা করুন</Link>
        </div>
    );
}

Thanks.layout = (page) => <StoreLayout>{page}</StoreLayout>;
