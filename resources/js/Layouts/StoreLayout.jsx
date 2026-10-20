import { Link, router, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import CartDrawer from '../Components/CartDrawer';
import ToastContainer from '../Components/ToastContainer';
import { CartProvider, useCart } from '../lib/cart';
import { bn, clean } from '../lib/format';
import { getWishlist } from '../lib/wishlist';

function Shell({ children }) {
    const { shop, filters } = usePage().props;
    const cart = useCart();
    const [q, setQ] = useState(() => new URLSearchParams(window.location.search).get('q') || '');
    const [wishlistCount, setWishlistCount] = useState(() => getWishlist().length);
    const first = useRef(true);

    // Live theme variables sync on storefront
    useEffect(() => {
        if (shop?.primary_color) {
            document.documentElement.style.setProperty('--pri', shop.primary_color);
        }
        if (shop?.secondary_color) {
            document.documentElement.style.setProperty('--acc', shop.secondary_color);
        }
    }, [shop?.primary_color, shop?.secondary_color]);

    // Keep wishlist badge count reactive
    useEffect(() => {
        const onWishlistUpdate = (e) => {
            setWishlistCount(e.detail?.list?.length ?? getWishlist().length);
        };
        window.addEventListener('wishlist:updated', onWishlistUpdate);
        return () => window.removeEventListener('wishlist:updated', onWishlistUpdate);
    }, []);

    useEffect(() => {
        if (first.current) { first.current = false; return; }
        const t = setTimeout(() => {
            router.get('/', clean({ q, category: filters?.category, sort: filters?.sort, wishlist: filters?.wishlist }), { preserveState: true, replace: true });
        }, 350);
        return () => clearTimeout(t);
    }, [q]);

    const showWishlistOnly = () => {
        router.get('/', clean({ ...filters, wishlist: filters?.wishlist ? null : '1' }), { preserveState: true, preserveScroll: true, replace: true });
    };

    return (
        <>
            <header className="hdr">
                <div className="w hb" style={{ gap: 8, flexWrap: 'wrap' }}>
                    <Link className="logo" href="/"><img src={shop.logo || '/images/logo.jpg'} alt={`${shop.name} লোগো`} width="44" height="44" /><b>{shop.name}</b></Link>
                    <input className="sr" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="নাম বা ক্যাটাগরি খুঁজুন" aria-label="পণ্য খুঁজুন" />

                    {/* PLUG & PLAY: Wishlist Header Button */}
                    {shop.features?.wishlist && (
                        <button
                            type="button"
                            className="cb"
                            style={{
                                background: filters?.wishlist ? 'var(--acc)' : 'var(--card)',
                                color: filters?.wishlist ? '#12261f' : 'var(--ink)',
                                border: '1px solid var(--line)',
                                padding: '8px 14px',
                            }}
                            onClick={showWishlistOnly}
                            title="পছন্দের পণ্যের তালিকা দেখুন"
                        >
                            ❤️ <span style={{ position: 'static', display: 'inline-block', marginLeft: 4 }}>{bn(wishlistCount)}</span>
                        </button>
                    )}

                    <button className="cb" onClick={() => cart.setOpen(true)} aria-label="কার্ট খুলুন">কার্ট<span>{bn(cart.count)}</span></button>
                </div>
            </header>
            <main>{children}</main>
            <footer className="ftr">
                <div className="w f">
                    <div>
                        <h3>{shop.name}</h3>
                        <p>{shop.subtagline}</p>
                        <a className="btn" href={shop.facebook || '#'} target="_blank" rel="noopener">ফেসবুকে মেসেজ দিন</a>
                    </div>
                    <div>
                        <h3>যোগাযোগ</h3>
                        <p>{shop.address}</p>
                        <p><a href={`tel:${shop.phone}`}>{shop.phone_display || shop.phone}</a></p>
                        <p><a href={`mailto:${shop.email}`}>{shop.email}</a></p>
                        {/* PLUG & PLAY: Blog Link in footer */}
                        {shop.features?.blog && (
                            <p style={{ marginTop: 8 }}>
                                <a href="/#blog" style={{ color: 'var(--acc)', fontWeight: 600 }}>📝 কেনাকাটার দরকারি টিপস ও ব্লগ</a>
                            </p>
                        )}
                    </div>
                    <div>
                        <h3>ডেলিভারি</h3>
                        <p>ঢাকার ভেতরে {bn(shop.delivery_in)} {window.__CURRENCY_SYMBOL__ || 'টাকা'}, ঢাকার বাইরে {bn(shop.delivery_out)} {window.__CURRENCY_SYMBOL__ || 'টাকা'}।{shop.free_over > 0 && ` ${bn(shop.free_over)} এর বেশি কিনলে ফ্রি।`}</p>
                    </div>
                </div>
                <div className="w fcredit">
                    Developed by: <a href="https://www.facebook.com/QawmianSheba" target="_blank" rel="noopener">Qawmian Sheba</a>
                </div>
            </footer>
            <div className="fl">
                <a className="fcall" href={`tel:${shop.phone}`} aria-label={`${shop.phone_display}-এ কল করুন`} title="কল করুন">
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
                        <path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.24 11.4 11.4 0 0 0 3.6.58 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11.4 11.4 0 0 0 .57 3.6 1 1 0 0 1-.25 1z" />
                    </svg>
                    <span className="fltip">কল করুন</span>
                </a>
                <a className="fwa" href={`https://wa.me/${shop.whatsapp}`} target="_blank" rel="noopener" aria-label="হোয়াটসঅ্যাপে মেসেজ দিন" title="হোয়াটসঅ্যাপ">
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden="true">
                        <path d="M19.05 4.91A9.82 9.82 0 0 0 12.04 2c-5.46 0-9.9 4.44-9.9 9.9 0 1.74.45 3.44 1.32 4.94L2 22l5.3-1.39a9.87 9.87 0 0 0 4.72 1.2h.01c5.46 0 9.9-4.44 9.9-9.9 0-2.64-1.03-5.13-2.88-6.99zm-7.01 15.24h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.25-8.23a8.2 8.2 0 0 1 5.83 2.41 8.18 8.18 0 0 1 2.42 5.83c0 4.54-3.7 8.23-8.25 8.23zm4.52-6.16c-.25-.13-1.47-.72-1.69-.8-.23-.09-.39-.13-.56.12-.16.25-.64.8-.78.97-.14.16-.29.18-.54.06a6.7 6.7 0 0 1-1.97-1.21 7.35 7.35 0 0 1-1.36-1.7c-.14-.25 0-.38.11-.51.11-.11.25-.29.37-.43.12-.15.16-.25.25-.41.08-.17.04-.31-.03-.44-.06-.12-.55-1.34-.76-1.83-.2-.48-.4-.42-.55-.42h-.48a.92.92 0 0 0-.66.31c-.23.25-.87.85-.87 2.07s.9 2.4 1.02 2.56c.13.17 1.77 2.7 4.28 3.79.6.26 1.06.41 1.42.53.6.19 1.14.16 1.57.1.48-.07 1.47-.6 1.68-1.18.2-.58.2-1.08.14-1.18-.06-.11-.22-.17-.47-.3z" />
                    </svg>
                    <span className="fltip">হোয়াটসঅ্যাপ</span>
                </a>
            </div>
            <CartDrawer />
            <ToastContainer />
        </>
    );
}

export default function StoreLayout({ children }) {
    return <CartProvider><Shell>{children}</Shell></CartProvider>;
}
