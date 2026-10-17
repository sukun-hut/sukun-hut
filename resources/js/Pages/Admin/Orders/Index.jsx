import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { PAY, bn, clean, tk } from '../../../lib/format';

const STATUSES = ['pending', 'processing', 'completed'];
const LABEL = { pending: 'Pending', processing: 'Processing', completed: 'Completed' };

export default function Index({ orders, counts, filters }) {
    const [q, setQ] = useState(filters.q || '');
    const go = (p) => router.get('/orders', clean({ ...filters, ...p }), { preserveState: true, replace: true });
    const total = Object.values(counts).reduce((a, b) => a + Number(b), 0);

    return (
        <>
            <Head title="অর্ডার" />
            <h1 style={{ fontSize: 28, marginBottom: 14 }}>অর্ডার</h1>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', marginBottom: 14 }}>
                <div className="chips" style={{ flex: 1 }}>
                    <button className={`chip${!filters.status ? ' on' : ''}`} onClick={() => go({ status: null })}>সব ({bn(total)})</button>
                    {STATUSES.map((s) => <button key={s} className={`chip${filters.status === s ? ' on' : ''}`} onClick={() => go({ status: s })}>{LABEL[s]} ({bn(counts[s] || 0)})</button>)}
                </div>
                <form onSubmit={(e) => { e.preventDefault(); go({ q }); }} style={{ display: 'flex', gap: 6 }}>
                    <input className="inp" style={{ width: 220 }} placeholder="নাম, ফোন বা অর্ডার নম্বর" value={q} onChange={(e) => setQ(e.target.value)} />
                    <button className="mini">খুঁজুন</button>
                </form>
            </div>
            {orders.data.length === 0 && <p className="empty">কোনো অর্ডার পাওয়া যায়নি</p>}
            {orders.data.map((o) => (
                <div className="card" key={o.id} style={{ marginBottom: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
                        <div>
                            <b>#{o.number}</b> <small style={{ color: 'var(--mut)' }}>{new Date(o.created_at).toLocaleString('bn-BD')}</small><br />
                            {o.name} | <a href={`tel:${o.phone}`}>{o.phone}</a>
                        </div>
                        <select value={o.status} aria-label="অর্ডারের স্ট্যাটাস" onChange={(e) => router.patch(`/orders/${o.id}/status`, { status: e.target.value }, { preserveScroll: true })}>
                            {STATUSES.map((s) => <option key={s} value={s}>{LABEL[s]}</option>)}
                        </select>
                    </div>
                    <p style={{ margin: '8px 0', whiteSpace: 'pre-line' }}>{o.address} <small>({o.zone === 'in' ? 'ঢাকার ভেতরে' : 'ঢাকার বাইরে'})</small></p>
                    <div className="sm" style={{ margin: 0 }}>
                        {o.items.map((i) => <div key={i.id}><span>{i.product_name} × {bn(i.quantity)}</span><span>{tk(i.price * i.quantity)}</span></div>)}
                        <div>ডেলিভারি<span>{o.delivery_fee ? tk(o.delivery_fee) : 'ফ্রি'}</span></div>
                        {o.discount > 0 && <div>ছাড়<span>-{tk(o.discount)}</span></div>}
                        <div className="t"><span>মোট ({PAY[o.payment_method]}{o.trx_id ? `, TrxID: ${o.trx_id}` : ''})</span><span>{tk(o.total)}</span></div>
                    </div>
                </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
                {orders.prev_page_url ? <Link className="mini" href={orders.prev_page_url}>আগের পাতা</Link> : <span />}
                {orders.next_page_url ? <Link className="mini" href={orders.next_page_url}>পরের পাতা</Link> : <span />}
            </div>
        </>
    );
}

Index.layout = (page) => <AdminLayout>{page}</AdminLayout>;
