import { Head, Link } from '@inertiajs/react';
import AdminLayout from '../../Layouts/AdminLayout';
import { PAY, bn, tk } from '../../lib/format';

const STATS = [
    ['today', 'আজকের অর্ডার', bn],
    ['pending', 'Pending অর্ডার', bn],
    ['sales', 'মোট বিক্রি (Confirmed)', tk],
    ['products', 'মোট পণ্য', bn],
    ['out', 'স্টক শেষ', bn],
];

export default function Dashboard({ stats, recent }) {
    const path = window.location.pathname;
    const pfx = path.startsWith('/admin') ? '/admin' : '';

    return (
        <>
            <Head title="ড্যাশবোর্ড – অ্যাডমিন" />
            <h1 style={{ fontSize: 28, marginBottom: 14 }}>ড্যাশবোর্ড</h1>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(170px,1fr))', gap: 12 }}>
                {STATS.map(([k, l, fm]) => (
                    <div className="card" key={k}>
                        <small style={{ color: 'var(--mut)' }}>{l}</small>
                        <div style={{ fontSize: 26, fontWeight: 700, color: 'var(--pri)' }}>{fm(stats[k])}</div>
                    </div>
                ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '24px 0 10px' }}>
                <h2 style={{ fontSize: 22 }}>সাম্প্রতিক অর্ডার</h2>
                <Link className="mini" href={`${pfx}/orders`}>সব অর্ডার দেখুন</Link>
            </div>
            {recent.length === 0 && <p className="empty">এখনো কোনো অর্ডার নেই</p>}
            {recent.map((o) => (
                <div className="card" key={o.id} style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                    <div>
                        <b>#{o.number}</b> {o.name}<br />
                        <small style={{ color: 'var(--mut)' }}>
                            <a href={`tel:${o.phone}`} style={{ color: 'var(--pri)', fontWeight: 600 }}>📞 {o.phone}</a> | {PAY[o.payment_method] || 'ক্যাশ অন ডেলিভারি'}
                        </small>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <b>{tk(o.total)}</b><br />
                        <span style={{ fontSize: 13, fontWeight: 600, color: o.status === 'confirmed' ? '#2e7d32' : o.status === 'cancelled' ? '#c62828' : '#b76e00' }}>
                            {o.status.toUpperCase()}
                        </span>
                    </div>
                </div>
            ))}
        </>
    );
}

Dashboard.layout = (page) => <AdminLayout>{page}</AdminLayout>;
