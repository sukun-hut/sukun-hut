import { Link, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Icon } from './Icons';
import { useCart } from '../lib/cart';
import { hue, tk } from '../lib/format';
import { toast } from '../lib/toast';
import { isWishlisted, toggleWishlist } from '../lib/wishlist';
import Thumb from './Thumb';

export const Price = ({ p, variation = null }) => {
    const currentPrice = variation ? variation.price : p.price;
    const currentOldPrice = variation ? variation.old_price : p.old_price;
    return (
        <div className="pr">
            <strong>{tk(currentPrice)}</strong>
            {currentOldPrice ? <s>{tk(currentOldPrice)}</s> : null}
        </div>
    );
};

export const Stock = ({ p, variation = null }) => {
    const inStock = variation ? variation.in_stock : p.in_stock;
    return (
        <span className={`stk ${inStock ? 'in' : 'out'}`}>
            {inStock ? 'স্টকে আছে' : 'স্টক শেষ'}
        </span>
    );
};

// Card view: "Add to Cart" or "Choose Variation"
export function CardButtons({ p }) {
    const cart = useCart();
    const hasMultiple = p.variations && p.variations.length > 1;

    if (hasMultiple) {
        return (
            <Link className="btn" style={{ width: '100%', textDecoration: 'none' }} href={`/product/${p.slug}`}>
                পছন্দ করুন
            </Link>
        );
    }

    const defaultVar = p.variations && p.variations.length === 1 ? p.variations[0] : null;
    const inStock = defaultVar ? defaultVar.in_stock : p.in_stock;

    return (
        <button
            className="btn"
            style={{ width: '100%' }}
            disabled={!inStock}
            onClick={() => cart.add(p, 1, defaultVar)}
        >
            কার্টে যোগ করুন
        </button>
    );
}

// Details view: both "Add to Cart" and "Buy Now"
export function Buttons({ p, selectedVariation = null }) {
    const cart = useCart();
    const inStock = selectedVariation ? selectedVariation.in_stock : p.in_stock;

    const handleBuyNow = () => {
        const query = { buy: p.slug };
        if (selectedVariation) {
            query.v = selectedVariation.id;
        }
        router.get('/checkout', query);
    };

    return (
        <div className="row2">
            <button
                className="btn o"
                disabled={!inStock}
                onClick={() => cart.add(p, 1, selectedVariation)}
            >
                কার্টে যোগ করুন
            </button>
            <button
                className="btn"
                disabled={!inStock}
                onClick={handleBuyNow}
            >
                এখনই কিনুন
            </button>
        </div>
    );
}

export default function ProductCard({ p, isHighlighted = false }) {
    const { shop } = usePage().props;
    const [wish, setWish] = useState(() => isWishlisted(p.id));

    useEffect(() => {
        const onWishlistUpdate = () => setWish(isWishlisted(p.id));
        window.addEventListener('wishlist:updated', onWishlistUpdate);
        return () => window.removeEventListener('wishlist:updated', onWishlistUpdate);
    }, [p.id]);

    const handleWishlistClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const res = toggleWishlist(p);
        setWish(res.wishlisted);
        if (res.wishlisted) {
            toast.success(`❤️ "${p.name}" পছন্দের তালিকায় যোগ হয়েছে`);
        } else {
            toast.info(`পছন্দের তালিকা থেকে সরানো হয়েছে`);
        }
    };

    const recordCardClick = () => {
        if (typeof window !== 'undefined') {
            sessionStorage.setItem('shop:lastViewedId', String(p.id));
            sessionStorage.setItem('shop:homeScrollY', String(window.scrollY));
        }
    };

    const hasVariations = p.variations && p.variations.length > 0;
    const displayPrice = hasVariations
        ? Math.min(...p.variations.map((v) => v.price))
        : p.price;
    const displayOldPrice = hasVariations ? p.variations[0]?.old_price : p.old_price;

    return (
        <article
            className={`pc${isHighlighted ? ' pc-highlighted' : ''}`}
            id={`product-card-${p.id}`}
            style={{ position: 'relative' }}
        >
            <Link
                className="im"
                href={`/product/${p.slug}`}
                aria-label={p.name}
                style={{ '--h': hue(p.id) }}
                onClick={recordCardClick}
            >
                <Thumb src={p.images[0]} emoji={p.emoji} alt={p.name} />
                {displayOldPrice && displayOldPrice > displayPrice ? (
                    <span className="dc">{Math.round((1 - displayPrice / displayOldPrice) * 100).toLocaleString('bn-BD')}% ছাড়</span>
                ) : null}

                {/* PLUG & PLAY: Wishlist Toggle Button on Card */}
                {shop?.features?.wishlist && (
                    <button
                        type="button"
                        onClick={handleWishlistClick}
                        aria-label="উইশলিস্টে রাখুন"
                        title={wish ? 'পছন্দের তালিকা থেকে সরান' : 'পছন্দের তালিকায় যোগ করুন'}
                        style={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            width: 34,
                            height: 34,
                            borderRadius: '50%',
                            background: 'rgba(255, 255, 255, 0.92)',
                            backdropFilter: 'blur(4px)',
                            border: '1px solid var(--line)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 16,
                            cursor: 'pointer',
                            zIndex: 5,
                            boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                            transition: 'transform 0.15s ease',
                        }}
                    >
                        <Icon name="heart" size={17} color={wish ? '#e11d48' : '#64748b'} />
                    </button>
                )}
            </Link>
            <div className="pb">
                <small>{p.category?.name}</small>
                <h3><Link href={`/product/${p.slug}`} onClick={recordCardClick}>{p.name}</Link></h3>

                {/* PLUG & PLAY: Customer Star Rating on Card */}
                {shop?.features?.review && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: '#f39c12' }}>
                        <span>★★★★★</span>
                        <small style={{ color: 'var(--mut)', fontWeight: 600 }}>(৪.৯)</small>
                    </div>
                )}

                <p>{p.description}</p>
                <div className="pr">
                    <strong>{hasVariations && p.variations.length > 1 ? `${tk(displayPrice)} থেকে` : tk(displayPrice)}</strong>
                    {displayOldPrice ? <s>{tk(displayOldPrice)}</s> : null}
                </div>
                <Stock p={p} />
                {hasVariations && (
                    <small style={{ color: 'var(--pri)', fontWeight: 600, marginTop: 2 }}>
                        {p.variations.length.toLocaleString('bn-BD')}টি অপশন পাওয়া যাচ্ছে
                    </small>
                )}
                <div style={{ height: 8 }} />
                <CardButtons p={p} />
            </div>
        </article>
    );
}
