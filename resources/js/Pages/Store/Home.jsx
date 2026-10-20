import { Head, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import ProductCard from '../../Components/ProductCard';
import StoreLayout from '../../Layouts/StoreLayout';
import { clean } from '../../lib/format';
import { getWishlist } from '../../lib/wishlist';

const SCROLL_KEY = 'shop:homeScrollY';

export default function Home({ products, categories, filters }) {
    const { shop } = usePage().props;
    const [l1, l2] = (shop.tagline || '').split('\n');
    const [highlightedId, setHighlightedId] = useState(null);
    const go = (p) => router.get('/', clean({ ...filters, ...p }), { preserveState: true, preserveScroll: true, replace: true });

    // Scroll restoration & Card highlight
    useEffect(() => {
        const savedScroll = sessionStorage.getItem(SCROLL_KEY);
        const lastId = sessionStorage.getItem('shop:lastViewedId');

        if (lastId) {
            setHighlightedId(Number(lastId));
            const timer = setTimeout(() => {
                setHighlightedId(null);
                sessionStorage.removeItem('shop:lastViewedId');
            }, 3500);
        }

        if (savedScroll !== null) {
            sessionStorage.removeItem(SCROLL_KEY);
            requestAnimationFrame(() => {
                window.scrollTo({ top: parseInt(savedScroll, 10) || 0, behavior: 'auto' });
            });
        }

        return () => {
            if (document.visibilityState !== 'unloaded') {
                sessionStorage.setItem(SCROLL_KEY, String(window.scrollY));
            }
        };
    }, []);

    // Filter by wishlist if ?wishlist=1
    const isWishlistActive = !!filters?.wishlist;
    const wishlistIds = typeof window !== 'undefined' ? getWishlist() : [];
    const filteredList = isWishlistActive
        ? products.filter((p) => wishlistIds.includes(p.id))
        : products;

    return (
        <>
            <Head title={`${shop.name} – অনলাইন শপ`} />
            <div className="w">
                <section className="hero">
                    <div>
                        <h1>{l1}<br />{l2}</h1>
                        <p>{shop.subtagline}</p>
                    </div>
                    <div className="hut">
                        <img className="hutlg" src={shop.logo || '/images/logo.jpg'} alt={`${shop.name} লোগো`} width="220" height="220" />
                        <p className="hutnm">{shop.name}</p>
                        <small className="huttg">{shop.subtagline}</small>
                    </div>
                </section>
                <div className="tr">
                    <span><b>ক্যাশ অন ডেলিভারি</b> সুবিধা</span>
                    <span><b>সারা দেশে</b> হোম ডেলিভারি</span>
                    <span><b>বিকাশ ও নগদে</b> পেমেন্ট</span>
                    {shop.free_over > 0 && <span><b>{shop.free_over.toLocaleString('bn-BD')} টাকার</b> উপরে ডেলিভারি ফ্রি</span>}
                </div>
                <section id="shop">
                    <div className="tools">
                        <div className="chips">
                            <button className={`chip${!filters.category ? ' on' : ''}`} onClick={() => go({ category: null })}>সব</button>
                            {categories.map((c) => (
                                <button key={c.id} className={`chip${filters.category === c.slug ? ' on' : ''}`} onClick={() => go({ category: c.slug })}>{c.name}</button>
                            ))}
                        </div>
                        <select value={filters.sort || ''} onChange={(e) => go({ sort: e.target.value })} aria-label="সাজান">
                            <option value="">সাজান: নতুন আগে</option>
                            <option value="lo">দাম: কম থেকে বেশি</option>
                            <option value="hi">দাম: বেশি থেকে কম</option>
                        </select>
                    </div>
                    <div className="pgrid">
                        {filteredList.length ? (
                            filteredList.map((p) => (
                                <ProductCard key={p.id} p={p} isHighlighted={p.id === highlightedId} />
                            ))
                        ) : (
                            <div className="empty" style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px 0' }}>
                                {isWishlistActive ? (
                                    <>
                                        <div style={{ fontSize: 44, marginBottom: 10 }}>🤍</div>
                                        <p style={{ fontSize: 18, fontWeight: 600 }}>আপনার পছন্দের তালিকায় কোনো পণ্য যোগ করা নেই</p>
                                        <button className="btn" style={{ marginTop: 12 }} onClick={() => go({ wishlist: null })}>
                                            সকল পণ্য দেখুন
                                        </button>
                                    </>
                                ) : (
                                    <p>কোনো পণ্য পাওয়া যায়নি। অন্য শব্দে খুঁজুন।</p>
                                )}
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </>
    );
}

Home.layout = (page) => <StoreLayout>{page}</StoreLayout>;
