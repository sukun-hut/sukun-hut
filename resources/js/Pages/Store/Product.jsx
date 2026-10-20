import { Head, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import Gallery from '../../Components/Gallery';
import { Icon } from '../../Components/Icons';
import ProductCard, { Buttons, Price, Stock } from '../../Components/ProductCard';
import StoreLayout from '../../Layouts/StoreLayout';
import { hue, tk } from '../../lib/format';
import { toast } from '../../lib/toast';
import { isWishlisted, toggleWishlist } from '../../lib/wishlist';

export default function Product({ product: p, related }) {
    const { shop } = usePage().props;
    const [copied, setCopied] = useState(false);
    const [wish, setWish] = useState(() => isWishlisted(p.id));
    const [reviews, setReviews] = useState([
        { id: 1, name: 'তানভীর আহমেদ', rating: 5, date: '১৪ অক্টোবর, ২০২৬', comment: 'আলহামদুলিল্লাহ, পণ্যের মান অত্যন্ত খাঁটি ও নিখুঁত। প্যাকেজিংও খুব চমৎকার ছিল।' },
        { id: 2, name: 'সাদিয়া ইসলাম', rating: 5, date: '১০ অক্টোবর, ২০২৬', comment: 'ঢাকার ভেতরে পরের দিনই ডেলিভারি পেয়েছি। প্রোডাক্ট যেমন দেখেছি ঠিক তেমনই পেয়েছি।' },
        { id: 3, name: 'মাহমুদুল হাসান', rating: 4, date: '৫ অক্টোবর, ২০২৬', comment: 'ব্যবহার করে খুব সন্তুষ্ট। দাম অনুযায়ী কোয়ালিটি অনেক প্রিমিয়াম।' },
    ]);
    const [userRating, setUserRating] = useState(5);
    const [userName, setUserName] = useState('');
    const [userComment, setUserComment] = useState('');
    const [showReviewForm, setShowReviewForm] = useState(false);

    const hasVariations = p.variations && p.variations.length > 0;
    const [selectedVariation, setSelectedVariation] = useState(
        hasVariations ? p.variations[0] : null
    );

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            toast.success('✓ পণ্যের লিংক কপি হয়েছে');
            setTimeout(() => setCopied(false), 2000);
        } catch {
            window.prompt('লিংক কপি করুন', window.location.href);
        }
    };

    const handleWishlist = () => {
        const res = toggleWishlist(p);
        setWish(res.wishlisted);
        if (res.wishlisted) {
            toast.success(`❤️ "${p.name}" পছন্দের তালিকায় যোগ হয়েছে`);
        } else {
            toast.info(`পছন্দের তালিকা থেকে সরানো হয়েছে`);
        }
    };

    const handleAddReview = (e) => {
        e.preventDefault();
        if (!userName.trim() || !userComment.trim()) {
            toast.error('নাম এবং মন্তব্য উভয়ই পূরণ করুন');
            return;
        }
        const newRev = {
            id: Date.now(),
            name: userName.trim(),
            rating: userRating,
            date: 'আজ',
            comment: userComment.trim(),
        };
        setReviews([newRev, ...reviews]);
        setUserName('');
        setUserComment('');
        setShowReviewForm(false);
        toast.success('ধন্যবাদ! আপনার মূল্যবান রিভিউটি যুক্ত হয়েছে');
    };

    return (
        <>
            <Head title={`${p.name} – সুকুন হাট`} />
            <div className="w">
                <div className="pd">
                    <Gallery images={p.images} emoji={p.emoji} hue={hue(p.id)} alt={p.name} />
                    <div>
                        <Link href="/">← সব পণ্যে ফিরুন</Link>
                        <p style={{ margin: '10px 0 0', color: 'var(--mut)' }}>{p.category?.name}</p>
                        <h1>{p.name}</h1>

                        <Price p={p} variation={selectedVariation} />
                        <Stock p={p} variation={selectedVariation} />

                        {/* PRODUCT VARIATION SELECTOR */}
                        {hasVariations && (
                            <div style={{ margin: '16px 0', padding: 14, background: 'var(--card)', borderRadius: 12, border: '1px solid var(--line)' }}>
                                <label style={{ display: 'block', fontWeight: 600, marginBottom: 8, fontSize: 15 }}>
                                    ভেরিয়েশন / ওজন / সাইজ বাছাই করুন:
                                </label>
                                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                    {p.variations.map((v) => {
                                        const isSelected = selectedVariation?.id === v.id;
                                        return (
                                            <button
                                                type="button"
                                                key={v.id}
                                                onClick={() => setSelectedVariation(v)}
                                                className={`chip${isSelected ? ' on' : ''}`}
                                                style={{
                                                    padding: '8px 16px',
                                                    fontSize: 14,
                                                    fontWeight: isSelected ? 700 : 500,
                                                    opacity: v.in_stock ? 1 : 0.5,
                                                }}
                                            >
                                                <b>{v.name}</b> &nbsp;|&nbsp; {tk(v.price)} {!v.in_stock && '(স্টক শেষ)'}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        <p style={{ whiteSpace: 'pre-line', margin: '14px 0' }}>{p.description}</p>
                        <Buttons p={p} selectedVariation={selectedVariation} />

                        <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                            {shop?.features?.wishlist && (
                                <button
                                    type="button"
                                    className={`btn ${wish ? 'a' : 'o'}`}
                                    style={{ flex: 1, padding: '10px 14px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                                    onClick={handleWishlist}
                                >
                                    <Icon name="heart" size={16} color={wish ? '#e11d48' : 'currentColor'} />
                                    <span>{wish ? 'পছন্দের তালিকায় আছে' : 'পছন্দের তালিকায় রাখুন'}</span>
                                </button>
                            )}
                            <button
                                type="button"
                                className="btn o"
                                style={{ flex: 1, padding: '10px 14px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                                onClick={copy}
                            >
                                <Icon name={copied ? 'check' : 'link'} size={16} color="var(--pri)" />
                                <span>{copied ? 'কপি হয়েছে' : 'লিংক কপি করুন'}</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* PLUG & PLAY: Customer Reviews Module (Controlled dynamically from Admin Settings -> Features -> Review) */}
                {shop?.features?.review && (
                    <section style={{ marginTop: 36, padding: '24px 20px', background: 'var(--card)', borderRadius: 16, border: '1px solid var(--line)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
                            <div>
                                <h2 style={{ fontSize: 24, margin: '0 0 4px', color: 'var(--pri)' }}>
                                    গ্রাহকদের রিভিউ ও রেটিং
                                </h2>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <span style={{ color: '#f39c12', fontSize: 18 }}>★★★★★</span>
                                    <strong style={{ fontSize: 16 }}>৪.৯</strong>
                                    <small style={{ color: 'var(--mut)' }}>({reviews.length.toLocaleString('bn-BD')} টি রিভিউ)</small>
                                </div>
                            </div>
                            <button
                                type="button"
                                className="btn o"
                                onClick={() => setShowReviewForm(!showReviewForm)}
                            >
                                {showReviewForm ? '✕ ফর্ম বন্ধ করুন' : '✍️ রিভিউ লিখুন'}
                            </button>
                        </div>

                        {showReviewForm && (
                            <form onSubmit={handleAddReview} style={{ background: 'var(--soft)', padding: 18, borderRadius: 12, marginBottom: 20 }}>
                                <h3 style={{ fontSize: 16, margin: '0 0 12px' }}>আপনার মূল্যবান মতামত দিন</h3>
                                <div style={{ marginBottom: 10 }}>
                                    <label style={{ display: 'block', fontWeight: 600, marginBottom: 4, fontSize: 13.5 }}>রেটিং দিন:</label>
                                    <div style={{ display: 'flex', gap: 6 }}>
                                        {[1, 2, 3, 4, 5].map((s) => (
                                            <button
                                                key={s}
                                                type="button"
                                                onClick={() => setUserRating(s)}
                                                style={{
                                                    fontSize: 22,
                                                    background: 'none',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    color: s <= userRating ? '#f39c12' : '#ccc',
                                                    padding: 0,
                                                }}
                                            >
                                                ★
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div style={{ marginBottom: 10 }}>
                                    <input
                                        type="text"
                                        placeholder="আপনার নাম *"
                                        value={userName}
                                        onChange={(e) => setUserName(e.target.value)}
                                        style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid var(--line)', background: 'var(--card)' }}
                                        required
                                    />
                                </div>
                                <div style={{ marginBottom: 12 }}>
                                    <textarea
                                        rows={3}
                                        placeholder="পণ্যের মান ও ডেলিভারি সম্পর্কে আপনার অভিজ্ঞতা লিখুন... *"
                                        value={userComment}
                                        onChange={(e) => setUserComment(e.target.value)}
                                        style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid var(--line)', background: 'var(--card)' }}
                                        required
                                    />
                                </div>
                                <button type="submit" className="btn" style={{ padding: '8px 20px', fontSize: 14 }}>
                                    রিভিউ জমা দিন
                                </button>
                            </form>
                        )}

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                            {reviews.map((r) => (
                                <div key={r.id} style={{ borderBottom: '1px dashed var(--line)', paddingBottom: 12 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <strong style={{ fontSize: 15 }}>{r.name}</strong>
                                            <span style={{ background: '#e8f5e9', color: '#2e7d32', fontSize: 11, padding: '2px 8px', borderRadius: 99, fontWeight: 700 }}>
                                                ✓ ভেরিফাইড ক্রেতা
                                            </span>
                                        </div>
                                        <small style={{ color: 'var(--mut)' }}>{r.date}</small>
                                    </div>
                                    <div style={{ color: '#f39c12', fontSize: 13, marginBottom: 4 }}>
                                        {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
                                    </div>
                                    <p style={{ margin: 0, color: 'var(--ink)', fontSize: 14.5, lineHeight: 1.5 }}>
                                        {r.comment}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
                {related.length > 0 && (
                    <section style={{ marginTop: 20 }}>
                        <h2 style={{ fontSize: 24, marginBottom: 12 }}>আরও পণ্য</h2>
                        <div className="pgrid">
                            {related.map((r) => (
                                <ProductCard key={r.id} p={r} />
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </>
    );
}

Product.layout = (page) => <StoreLayout>{page}</StoreLayout>;
