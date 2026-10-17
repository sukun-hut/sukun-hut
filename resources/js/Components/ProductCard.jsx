import { Link, router } from '@inertiajs/react';
import { useCart } from '../lib/cart';
import { hue, tk } from '../lib/format';
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

export default function ProductCard({ p }) {
    const hasVariations = p.variations && p.variations.length > 0;
    const displayPrice = hasVariations
        ? Math.min(...p.variations.map((v) => v.price))
        : p.price;
    const displayOldPrice = hasVariations ? p.variations[0]?.old_price : p.old_price;

    return (
        <article className="pc">
            <Link className="im" href={`/product/${p.slug}`} aria-label={p.name} style={{ '--h': hue(p.id) }}>
                <Thumb src={p.images[0]} emoji={p.emoji} alt={p.name} />
                {displayOldPrice && displayOldPrice > displayPrice ? (
                    <span className="dc">{Math.round((1 - displayPrice / displayOldPrice) * 100).toLocaleString('bn-BD')}% ছাড়</span>
                ) : null}
            </Link>
            <div className="pb">
                <small>{p.category?.name}</small>
                <h3><Link href={`/product/${p.slug}`}>{p.name}</Link></h3>
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
