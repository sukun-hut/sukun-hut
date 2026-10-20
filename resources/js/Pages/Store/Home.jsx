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
    const [activeBlogModal, setActiveBlogModal] = useState(null);
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

    // Demo blog articles (rendered dynamically if shop.features.blog is turned on in admin settings)
    const BLOGS = [
        {
            id: 1,
            title: 'খাঁটি মধু ও অর্গানিক পণ্যের বিশুদ্ধতা যাচাইয়ের ৫টি সহজ কৌশল',
            date: '১৮ অক্টোবর, ২০২৬',
            readTime: '৩ মিনিট',
            tag: 'স্বাস্থ্য ও পুষ্টি',
            summary: 'বাজারে প্রচুর নকল মধু ও ভেজাল খাবার পাওয়া যায়। খাঁটি মধু চেনার ঘরোয়া পরীক্ষা ও প্রাকৃতিক উপকারিতা জানুন।',
            content: '১. পানিতে পরীক্ষা: এক গ্লাস পানিতে এক চামচ মধু ঢালুন। খাঁটি মধু সহজে মিশে যাবে না, সরাসরি নিচে জমাট বাঁধবে।\n২. বুড়ো আঙুলে পরীক্ষা: আঙুলে সামান্য মধু নিলে খাঁটি মধু গড়িয়ে পড়বে না, ঘন থাকবে।\n৩. আগুনের পরীক্ষা: দেশলাই কাঠি মধুতে ডুবিয়ে জ্বালালে সহজেই জ্বলবে যদি মধু খাঁটি হয়।\n\nসুকুন হাটে আমরা সুন্দরবনের বিশ্বস্ত চাক ভাঙা খাঁটি মধু কোনো প্রিজারভেটিভ ছাড়া সরাসরি গ্রাহকের হাতে পৌঁছে দিই।',
        },
        {
            id: 2,
            title: 'স্মার্ট গ্যাজেট ও ইয়ারবাডের ব্যাটারি দীর্ঘস্থায়ী রাখার কার্যকারী টিপস',
            date: '১৬ অক্টোবর, ২০২৬',
            readTime: '৪ মিনিট',
            tag: 'টেক ও গ্যাজেট',
            summary: 'প্রতিদিনের ব্যবহৃত ওয়্যারলেস হেডফোন ও স্মার্টওয়াচের ব্যাটারি ব্যাকআপ কিভাবে দ্বিগুণ করবেন তার প্রমাণিত নির্দেশিকা।',
            content: '১. সবসময় ৮০-২০ নিয়ম মানুন: ব্যাটারি ২০% এর নিচে নামার আগে চার্জ দিন এবং ৮০-৯০% হলে চার্জার খুলে ফেলুন।\n২. অতিরিক্ত গরমে গ্যাজেট রাখবেন না: সরাসরি সূর্যের আলোতে লিথিয়াম ব্যাটারি দ্রুত নষ্ট হয়।\n৩. অরিজিনাল ফাস্ট চার্জার ব্যবহার করুন: সঠিক ভোল্টেজ নিশ্চিত করতে মানসম্মত ব্রেইডেড ক্যাবল ও এডাপ্টার ব্যবহার জরুরি।',
        },
        {
            id: 3,
            title: 'অনলাইন কেনাকাটায় ক্যাশ অন ডেলিভারি কেন সবচেয়ে নিরাপদ?',
            date: '১২ অক্টোবর, ২০২৬',
            readTime: '২ মিনিট',
            tag: 'শপিং টিপস',
            summary: 'পণ্য হাতে পেয়ে দেখে মূল্য পরিশোধ করার সুবিধা ক্রেতাদের কেনাকাটায় শতভাগ আস্থা এনে দেয়।',
            content: 'ক্যাশ অন ডেলিভারি (COD) পদ্ধতিতে ক্রেতাকে কোনো অগ্রিম টাকা প্রদান করতে হয় না। ডেলিভারি রাইডারের উপস্থিতিতে পার্সেল চেক করে টাকা পরিশোধ করা যায়। আমাদের সকল অর্ডারে পুরো বাংলাদেশে দ্রুত ক্যাশ অন ডেলিভারি সুবিধা চালু রয়েছে।',
        },
    ];

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

                {/* PLUG & PLAY: Blog & Tips Section (Controlled dynamically from Admin Settings -> Features -> Blog) */}
                {shop.features?.blog && (
                    <section id="blog" style={{ marginTop: 50, paddingTop: 30, borderTop: '1px solid var(--line)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 10, marginBottom: 20 }}>
                            <div>
                                <span style={{ color: 'var(--pri)', fontWeight: 700, fontSize: 13, textTransform: 'uppercase', letterSpacing: '1px' }}>
                                    ব্লগ ও লাইফস্টাইল
                                </span>
                                <h2 style={{ fontSize: 28, margin: '4px 0 0', color: 'var(--pri)' }}>
                                    দরকারি কেনাকাটার টিপস ও আর্টিকেল
                                </h2>
                            </div>
                            <span style={{ color: 'var(--mut)', fontSize: 14 }}>সেরা ও খাঁটি পণ্যের বিশ্বস্ত গাইড</span>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 18 }}>
                            {BLOGS.map((b) => (
                                <div
                                    key={b.id}
                                    className="card"
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        padding: '18px 20px',
                                        borderRadius: 14,
                                        border: '1px solid var(--line)',
                                        background: 'var(--card)',
                                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                                        <span style={{ background: 'var(--soft)', color: 'var(--pri)', padding: '2px 10px', borderRadius: 99, fontSize: 12, fontWeight: 600 }}>
                                            {b.tag}
                                        </span>
                                        <small style={{ color: 'var(--mut)' }}>{b.readTime}</small>
                                    </div>
                                    <h3 style={{ fontSize: 17, margin: '6px 0 8px', lineHeight: 1.4, color: 'var(--pri)' }}>
                                        {b.title}
                                    </h3>
                                    <p style={{ color: 'var(--mut)', fontSize: 13.5, flex: 1, margin: '0 0 14px', lineHeight: 1.5 }}>
                                        {b.summary}
                                    </p>
                                    <button
                                        type="button"
                                        className="btn o"
                                        style={{ alignSelf: 'flex-start', padding: '6px 14px', fontSize: 13 }}
                                        onClick={() => setActiveBlogModal(b)}
                                    >
                                        সম্পূর্ণ পড়ুন →
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Article Content Modal */}
                        {activeBlogModal && (
                            <div
                                style={{
                                    position: 'fixed',
                                    inset: 0,
                                    background: 'rgba(0,0,0,0.65)',
                                    zIndex: 9999,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: 18,
                                    backdropFilter: 'blur(3px)',
                                }}
                                onClick={() => setActiveBlogModal(null)}
                            >
                                <div
                                    className="card"
                                    style={{
                                        maxWidth: 600,
                                        width: '100%',
                                        maxHeight: '85vh',
                                        overflowY: 'auto',
                                        padding: 26,
                                        borderRadius: 18,
                                        background: 'var(--card)',
                                        boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                                        <span style={{ background: 'var(--soft)', color: 'var(--pri)', padding: '3px 12px', borderRadius: 99, fontSize: 12.5, fontWeight: 700 }}>
                                            {activeBlogModal.tag}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => setActiveBlogModal(null)}
                                            style={{ border: 'none', background: 'var(--soft)', width: 32, height: 32, borderRadius: '50%', cursor: 'pointer', fontWeight: 800 }}
                                        >
                                            ✕
                                        </button>
                                    </div>
                                    <h2 style={{ fontSize: 22, color: 'var(--pri)', margin: '0 0 8px' }}>
                                        {activeBlogModal.title}
                                    </h2>
                                    <small style={{ color: 'var(--mut)', display: 'block', marginBottom: 16 }}>
                                        🕒 {activeBlogModal.date} • পড়ার সময় {activeBlogModal.readTime}
                                    </small>
                                    <p style={{ whiteSpace: 'pre-line', fontSize: 15, lineHeight: 1.8, color: 'var(--ink)' }}>
                                        {activeBlogModal.content}
                                    </p>
                                    <button
                                        type="button"
                                        className="btn"
                                        style={{ marginTop: 20, width: '100%' }}
                                        onClick={() => setActiveBlogModal(null)}
                                    >
                                        বন্ধ করুন
                                    </button>
                                </div>
                            </div>
                        )}
                    </section>
                )}
            </div>
        </>
    );
}

Home.layout = (page) => <StoreLayout>{page}</StoreLayout>;
