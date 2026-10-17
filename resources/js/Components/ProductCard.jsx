import { Link, router } from '@inertiajs/react';
import { useCart } from '../lib/cart';
import { hue, tk } from '../lib/format';
import Thumb from './Thumb';

export const Price = ({ p }) => (
    <div className="pr"><strong>{tk(p.price)}</strong>{p.old_price ? <s>{tk(p.old_price)}</s> : null}</div>
);
export const Stock = ({ p }) => <span className={`stk ${p.in_stock ? 'in' : 'out'}`}>{p.in_stock ? 'স্টকে আছে' : 'Out of Stock'}</span>;

// Card view: only "Add to Cart"
export function CardButtons({ p }) {
    const cart = useCart();
    return (
        <button className="btn" style={{ width: '100%' }} disabled={!p.in_stock} onClick={() => cart.add(p)}>
            কার্টে যোগ করুন
        </button>
    );
}

// Details view: both "Add to Cart" and "Buy Now"
export function Buttons({ p }) {
    const cart = useCart();
    return (
        <div className="row2">
            <button className="btn o" disabled={!p.in_stock} onClick={() => cart.add(p)}>কার্টে যোগ করুন</button>
            <button className="btn" disabled={!p.in_stock} onClick={() => router.get('/checkout', { buy: p.slug })}>এখনই কিনুন</button>
        </div>
    );
}

export default function ProductCard({ p }) {
    return (
        <article className="pc">
            <Link className="im" href={`/product/${p.slug}`} aria-label={p.name} style={{ '--h': hue(p.id) }}>
                <Thumb src={p.images[0]} emoji={p.emoji} alt={p.name} />
                {p.old_price ? <span className="dc">{Math.round((1 - p.price / p.old_price) * 100).toLocaleString('bn-BD')}% ছাড়</span> : null}
            </Link>
            <div className="pb">
                <small>{p.category?.name}</small>
                <h3><Link href={`/product/${p.slug}`}>{p.name}</Link></h3>
                <p>{p.description}</p>
                <Price p={p} />
                <Stock p={p} />
                <div style={{ height: 8 }} />
                <CardButtons p={p} />
            </div>
        </article>
    );
}
