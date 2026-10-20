import { Head, Link, router, usePage } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import Thumb from '../../../Components/Thumb';
import { tk } from '../../../lib/format';

export default function Index({ products }) {
    const { siteUrl } = usePage().props;
    const path = window.location.pathname;
    const pfx = path.startsWith('/admin') ? '/admin' : '';
    const del = (p) => { if (window.confirm(`"${p.name}" মুছে ফেলবেন?`)) router.delete(`${pfx}/products/${p.id}`, { preserveScroll: true }); };
    return (
        <>
            <Head title="পণ্য" />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <h1 style={{ fontSize: 28 }}>পণ্য</h1>
                <Link className="btn" href={`${pfx}/products/create`}>নতুন পণ্য যোগ করুন</Link>
            </div>
            {products.length === 0 && <p className="empty">কোনো পণ্য নেই</p>}
            {products.map((p) => (
                <div className="card" key={p.id} style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', marginBottom: 8, opacity: p.is_active ? 1 : 0.6 }}>
                    <div className="th"><Thumb src={p.images[0]} emoji={p.emoji} /></div>
                    <div style={{ flex: 1, minWidth: 160 }}>
                        <b>{p.name}</b>{!p.is_active && <small> (লুকানো)</small>}<br />
                        <small style={{ color: 'var(--mut)' }}>{p.category?.name || 'ক্যাটাগরি নেই'}</small>{' '}
                        <b>{tk(p.price)}</b>
                        {p.variations?.length > 0 && (
                            <small style={{ color: 'var(--pri)', marginLeft: 8, fontWeight: 600 }}>
                                ({p.variations.length.toLocaleString('bn-BD')}টি ভেরিয়েশন)
                            </small>
                        )}
                    </div>
                    <button
                        role="switch"
                        aria-checked={p.in_stock}
                        className={`stk ${p.in_stock ? 'in' : 'out'}`}
                        style={{ cursor: 'pointer', padding: '4px 14px', display: 'inline-flex', alignItems: 'center', gap: 8, border: 'none', borderRadius: 999 }}
                        title={p.in_stock ? 'ক্লিক করলে স্টক শেষ হবে' : 'ক্লিক করলে স্টকে আছে হবে'}
                        onClick={() => router.patch(`${pfx}/products/${p.id}/stock`, {}, { preserveScroll: true })}
                    >
                        <span style={{
                            width: 30, height: 16, borderRadius: 999, position: 'relative',
                            background: 'rgba(255,255,255,.35)', display: 'inline-block', flexShrink: 0,
                        }}>
                            <span style={{
                                position: 'absolute', top: 2, left: p.in_stock ? 16 : 2,
                                width: 12, height: 12, borderRadius: 999, background: '#fff',
                                transition: 'left .15s ease', boxShadow: '0 1px 2px rgba(0,0,0,.25)',
                            }} />
                        </span>
                        {p.in_stock ? 'স্টকে আছে' : 'স্টক নেই'}
                    </button>
                    <a className="mini" href={`${siteUrl}/product/${p.slug}`} target="_blank" rel="noopener">দেখুন</a>
                    <Link className="mini" href={`${pfx}/products/${p.id}/edit`}>এডিট</Link>
                    <button className="mini" onClick={() => del(p)}>মুছুন</button>
                </div>
            ))}
        </>
    );
}

Index.layout = (page) => <AdminLayout>{page}</AdminLayout>;
