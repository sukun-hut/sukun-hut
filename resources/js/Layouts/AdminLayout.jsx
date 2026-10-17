import { Link, router, usePage } from '@inertiajs/react';

const NAV = [
    ['/', 'ড্যাশবোর্ড'],
    ['/products', 'পণ্য'],
    ['/categories', 'ক্যাটাগরি'],
    ['/orders', 'অর্ডার'],
];

export default function AdminLayout({ children }) {
    const { auth, flash, siteUrl } = usePage().props;
    const path = window.location.pathname;
    const on = (h) => (h === '/' ? path === '/' : path.startsWith(h));

    return (
        <>
            <header className="hdr">
                <div className="w hb" style={{ flexWrap: 'wrap' }}>
                    <Link className="logo" href="/"><img src="/images/logo.jpg" alt="" width="40" height="40" /><b>অ্যাডমিন</b></Link>
                    <nav className="chips" style={{ flex: 1 }}>
                        {NAV.map(([h, l]) => <Link key={h} href={h} className={`chip${on(h) ? ' on' : ''}`}>{l}</Link>)}
                    </nav>
                    <a className="mini" href={siteUrl} target="_blank" rel="noopener">সাইট দেখুন</a>
                    <button className="mini" onClick={() => router.post('/logout')}>লগআউট ({auth.user?.name})</button>
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
