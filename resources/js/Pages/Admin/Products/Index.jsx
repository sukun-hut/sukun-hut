import { Head, Link, router, usePage } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import Thumb from '../../../Components/Thumb';
import { tk } from '../../../lib/format';

export default function Index({ products }) {
    const { siteUrl } = usePage().props;
    const del = (p) => { if (window.confirm(`"${p.name}" মুছে ফেলবেন?`)) router.delete(`/products/${p.id}`, { preserveScroll: true }); };
    return (
        <>
            <Head title="পণ্য" />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <h1 style={{ fontSize: 28 }}>পণ্য</h1>
                <Link className="btn" href="/products/create">নতুন পণ্য যোগ করুন</Link>
            </div>
            {products.length === 0 && <p className="empty">কোনো পণ্য নেই</p>}
            {products.map((p) => (
                <div className="card" key={p.id} style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', marginBottom: 8, opacity: p.is_active ? 1 : 0.6 }}>
                    <div className="th"><Thumb src={p.images[0]} emoji={p.emoji} /></div>
                    <div style={{ flex: 1, minWidth: 160 }}>
                        <b>{p.name}</b>{!p.is_active && <small> (লুকানো)</small>}<br />
                        <small style={{ color: 'var(--mut)' }}>{p.category?.name || 'ক্যাটাগরি নেই'}</small> <b>{tk(p.price)}</b>
                    </div>
                    <button className={`stk ${p.in_stock ? 'in' : 'out'}`} style={{ cursor: 'pointer', padding: '4px 12px' }} onClick={() => router.patch(`/products/${p.id}/stock`, {}, { preserveScroll: true })}>
                        {p.in_stock ? 'স্টকে আছে' : 'স্টক নেই'}
                    </button>
                    <a className="mini" href={`${siteUrl}/product/${p.slug}`} target="_blank" rel="noopener">দেখুন</a>
                    <Link className="mini" href={`/products/${p.id}/edit`}>এডিট</Link>
                    <button className="mini" onClick={() => del(p)}>মুছুন</button>
                </div>
            ))}
        </>
    );
}

Index.layout = (page) => <AdminLayout>{page}</AdminLayout>;
