import { Link, router, usePage } from '@inertiajs/react';

const NAV = [
    ['/', 'ড্যাশবোর্ড'],
    ['/products', 'পণ্য'],
    ['/categories', 'ক্যাটাগরি'],
    ['/orders', 'অর্ডার'],
    ['/settings', 'ডেলিভারি সেটিংস'],
];

export default function AdminLayout({ children }) {
    const { auth, flash, siteUrl } = usePage().props;
    const path = window.location.pathname;
    const pfx = path.startsWith('/admin') ? '/admin' : '';
    const norm = (h) => (h === '/' ? (pfx || '/') : `${pfx}${h}`);
    const on = (h) => (h === '/' ? (path === '/' || path === '/admin' || path === '/admin/') : path.startsWith(`${pfx}${h}`));

    return (
        <>
            <header className="hdr">
                <div className="w hb" style={{ flexWrap: 'wrap' }}>
                    <Link className="logo" href={norm('/')}><img src="/images/logo.jpg" alt="" width="40" height="40" /><b>অ্যাডমিন</b></Link>
                    <nav className="chips" style={{ flex: 1 }}>
                        {NAV.map(([h, l]) => <Link key={h} href={norm(h)} className={`chip${on(h) ? ' on' : ''}`}>{l}</Link>)}
                    </nav>
                    <a className="mini" href={siteUrl} target="_blank" rel="noopener">সাইট দেখুন</a>
                    <button className="mini" onClick={() => router.post(`${pfx}/logout`)}>লগআউট ({auth.user?.name})</button>
                </div>
            </header>
            <main className="w" style={{ padding: '20px 18px 60px' }}>
                {flash.success && <div className="card" style={{ background: 'var(--soft)', marginBottom: 14 }}>{flash.success}</div>}
                {flash.error && <div className="card" style={{ color: '#a5281b', marginBottom: 14 }}>{flash.error}</div>}
                {children}
            </main>
        </>
    );
}
