import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { PAY, bn, clean, tk } from '../../../lib/format';

const PRIMARY_STATUSES = ['pending', 'confirmed', 'cancelled'];
const STATUS_LABELS = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    cancelled: 'Cancelled',
    processing: 'Processing',
    completed: 'Completed',
};

const STATUS_BADGE = {
    pending: { bg: '#fff4e5', color: '#b76e00', border: '#ffe0b2' },
    confirmed: { bg: '#e8f5e9', color: '#2e7d32', border: '#c8e6c9' },
    cancelled: { bg: '#ffebee', color: '#c62828', border: '#ffcdd2' },
    processing: { bg: '#e3f2fd', color: '#1565c0', border: '#bbdefb' },
    completed: { bg: '#e8f5e9', color: '#2e7d32', border: '#c8e6c9' },
};

export default function Index({ orders, counts, filters }) {
    const path = window.location.pathname;
    const pfx = path.startsWith('/admin') ? '/admin' : '';

    const [q, setQ] = useState(filters.q || '');
    const go = (p) => router.get(`${pfx}/orders`, clean({ ...filters, ...p }), { preserveState: true, replace: true });
    const total = Object.values(counts).reduce((a, b) => a + Number(b), 0);

    const updateStatus = (orderId, newStatus) => {
        router.patch(`${pfx}/orders/${orderId}/status`, { status: newStatus }, { preserveScroll: true });
    };

    return (
        <>
            <Head title="অর্ডার তালিকা – অ্যাডমিন" />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, flexWrap: 'wrap', gap: 10 }}>
                <h1 style={{ fontSize: 28, margin: 0 }}>অর্ডার ব্যবস্থাপনা</h1>
                <div style={{ color: 'var(--mut)', fontSize: 15 }}>
                    মোট অর্ডার: <b>{bn(total)}</b> টি
                </div>
            </div>

            {/* STATUS FILTERS & SEARCH */}
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', marginBottom: 16 }}>
                <div className="chips" style={{ flex: 1, minWidth: 260 }}>
                    <button className={`chip${!filters.status ? ' on' : ''}`} onClick={() => go({ status: null })}>
                        সব ({bn(total)})
                    </button>
                    {PRIMARY_STATUSES.map((s) => (
                        <button
                            key={s}
                            className={`chip${filters.status === s ? ' on' : ''}`}
                            onClick={() => go({ status: s })}
                        >
                            {STATUS_LABELS[s]} ({bn(counts[s] || 0)})
                        </button>
                    ))}
                </div>
                <form onSubmit={(e) => { e.preventDefault(); go({ q }); }} style={{ display: 'flex', gap: 6 }}>
                    <input
                        className="inp"
                        style={{ width: 220 }}
                        placeholder="নাম, ফোন বা অর্ডার নম্বর"
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                    />
                    <button className="mini">খুঁজুন</button>
                </form>
            </div>

            {orders.data.length === 0 && (
                <div className="card" style={{ padding: 40, textAlign: 'center', color: 'var(--mut)' }}>
                    কোনো অর্ডার পাওয়া যায়নি
                </div>
            )}

            {/* SERIAL ROW / CARDS LIST */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {orders.data.map((o, idx) => {
                    const serialNumber = (orders.current_page - 1) * orders.per_page + idx + 1;
                    const badge = STATUS_BADGE[o.status] || { bg: '#eee', color: '#333', border: '#ccc' };

                    return (
                        <div
                            className="card"
                            key={o.id}
                            style={{
                                borderLeft: `5px solid ${badge.color}`,
                                padding: '16px 18px',
                            }}
                        >
                            {/* ROW HEADER: SERIAL, NUMBER, DATE, STATUS */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10, borderBottom: '1px solid var(--line)', paddingBottom: 10, marginBottom: 12 }}>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <span style={{ background: 'var(--soft)', color: 'var(--pri)', fontWeight: 700, padding: '2px 8px', borderRadius: 6, fontSize: 13 }}>
                                            #{bn(serialNumber)}
                                        </span>
                                        <b style={{ fontSize: 17, color: 'var(--pri)' }}>অর্ডার: #{o.number}</b>
                                    </div>
                                    <small style={{ color: 'var(--mut)', marginTop: 4, display: 'block' }}>
                                        🕒 {new Date(o.created_at).toLocaleString('bn-BD', { dateStyle: 'medium', timeStyle: 'short' })}
                                    </small>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <span
                                        style={{
                                            background: badge.bg,
                                            color: badge.color,
                                            border: `1px solid ${badge.border}`,
                                            fontWeight: 700,
                                            padding: '4px 10px',
                                            borderRadius: 99,
                                            fontSize: 13,
                                        }}
                                    >
                                        {STATUS_LABELS[o.status] || o.status}
                                    </span>
                                    <select
                                        value={o.status}
                                        aria-label="অর্ডারের স্ট্যাটাস পরিবর্তন করুন"
                                        onChange={(e) => updateStatus(o.id, e.target.value)}
                                        style={{
                                            fontWeight: 600,
                                            padding: '5px 10px',
                                            cursor: 'pointer',
                                            background: 'var(--card)',
                                        }}
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="confirmed">Confirmed</option>
                                        <option value="cancelled">Cancelled</option>
                                        {o.status === 'processing' && <option value="processing">Processing</option>}
                                        {o.status === 'completed' && <option value="completed">Completed</option>}
                                    </select>
                                </div>
                            </div>

                            {/* ROW BODY: CUSTOMER INFO & CALL BUTTON, ITEMS, TOTAL */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
                                {/* CUSTOMER INFO & CLICK-TO-CALL */}
                                <div>
                                    <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 4 }}>
                                        👤 {o.name}
                                    </div>
                                    <div style={{ margin: '6px 0 10px' }}>
                                        <a
                                            href={`tel:${o.phone}`}
                                            className="btn"
                                            style={{
                                                background: '#25D366',
                                                color: '#fff',
                                                fontSize: 14,
                                                padding: '6px 14px',
                                                textDecoration: 'none',
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: 6,
                                                borderRadius: 99,
                                                boxShadow: '0 2px 6px rgba(37, 211, 102, 0.3)',
                                            }}
                                            title="কাস্টমারকে সরাসরি কল করুন"
                                        >
                                            <span style={{ fontSize: 16 }}>📞</span>
                                            <b>কল করুন: {o.phone}</b>
                                        </a>
                                    </div>
                                    <div style={{ color: 'var(--mut)', fontSize: 14, lineHeight: 1.45, background: 'var(--soft)', padding: '8px 10px', borderRadius: 8 }}>
                                        📍 <strong>ঠিকানা:</strong> {o.address}<br />
                                        <span style={{ color: 'var(--pri)', fontWeight: 600 }}>
                                            ({o.zone === 'in' ? 'ঢাকার ভেতরে' : 'ঢাকার বাইরে'})
                                        </span>
                                    </div>
                                </div>

                                {/* ORDER ITEMS WITH VARIATIONS */}
                                <div>
                                    <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 6, color: 'var(--pri)' }}>
                                        🛍️ অর্ডারের পণ্যসমূহ:
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                        {o.items.map((i) => (
                                            <div
                                                key={i.id}
                                                style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    gap: 10,
                                                    padding: '4px 0',
                                                    borderBottom: '1px dashed var(--line)',
                                                    fontSize: 14,
                                                }}
                                            >
                                                <span>
                                                    <strong>{i.product_name}</strong>
                                                    {i.variation_name && (
                                                        <span style={{ color: 'var(--pri)', fontWeight: 600, marginLeft: 6 }}>
                                                            ({i.variation_name})
                                                        </span>
                                                    )}
                                                    <span style={{ color: 'var(--mut)', marginLeft: 4 }}>
                                                        × {bn(i.quantity)}
                                                    </span>
                                                </span>
                                                <b>{tk(i.price * i.quantity)}</b>
                                            </div>
                                        ))}
                                    </div>

                                    {/* FINANCIAL BREAKDOWN */}
                                    <div className="sm" style={{ margin: '10px 0 0', padding: '8px 10px', fontSize: 13.5 }}>
                                        <div>সাবটোটাল<span>{tk(o.subtotal)}</span></div>
                                        <div>ডেলিভারি<span>{o.delivery_fee ? tk(o.delivery_fee) : 'ফ্রি'}</span></div>
                                        {o.discount > 0 && <div>ছাড়<span>-{tk(o.discount)}</span></div>}
                                        <div className="t" style={{ fontSize: 16, marginTop: 4, paddingTop: 4 }}>
                                            <span>মোট ({PAY[o.payment_method] || 'ক্যাশ অন ডেলিভারি'})</span>
                                            <span style={{ color: 'var(--pri)' }}>{tk(o.total)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* PAGINATION */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 18 }}>
                {orders.prev_page_url ? (
                    <Link className="mini" href={orders.prev_page_url}>← আগের পাতা</Link>
                ) : (
                    <span />
                )}
                <span style={{ color: 'var(--mut)', fontSize: 13 }}>
                    পাতা {bn(orders.current_page)} / {bn(orders.last_page)}
                </span>
                {orders.next_page_url ? (
                    <Link className="mini" href={orders.next_page_url}>পরের পাতা →</Link>
                ) : (
                    <span />
                )}
            </div>
        </>
    );
}

Index.layout = (page) => <AdminLayout>{page}</AdminLayout>;
