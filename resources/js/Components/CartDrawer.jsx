import { router, usePage } from '@inertiajs/react';
import { useCart } from '../lib/cart';
import { bn, delivery, hue, tk } from '../lib/format';
import Thumb from './Thumb';

export default function CartDrawer() {
    const { shop } = usePage().props;
    const c = useCart();
    const close = () => c.setOpen(false);
    const fee = delivery(shop, c.subtotal, 'in');

    return (
        <>
            <div className={`ov${c.open ? ' open' : ''}`} onClick={close} />
            <aside className={`dr${c.open ? ' open' : ''}`} aria-label="কার্ট">
                <div className="dh"><h2>আপনার কার্ট</h2><button className="x" onClick={close} aria-label="বন্ধ করুন">✕</button></div>
                <div className="dpn">
                    {c.items.length === 0 ? (
                        <>
                            <p className="empty">কার্ট খালি। পছন্দের পণ্য যোগ করুন।</p>
                            <button className="btn" style={{ width: '100%' }} onClick={close}>পণ্য দেখুন</button>
                        </>
                    ) : (
                        <>
                            {c.items.map((i) => (
                                <div className="ci" key={i.id}>
                                    <div className="e" style={{ background: `hsl(${hue(i.id)} 45% 88%)` }}><Thumb src={i.image} emoji={i.emoji} /></div>
                                    <div>
                                        <b>{i.name}</b>
                                        <div className="q">
                                            <button onClick={() => c.setQty(i.id, i.qty - 1)} aria-label="কমান">−</button>
                                            {bn(i.qty)}
                                            <button onClick={() => c.setQty(i.id, i.qty + 1)} aria-label="বাড়ান">+</button>
                                        </div>
                                    </div>
                                    <b>{tk(i.price * i.qty)}</b>
                                </div>
                            ))}
                            <div className="sm">
                                <div>সাবটোটাল<span>{tk(c.subtotal)}</span></div>
                                <div>ডেলিভারি (ঢাকার ভেতরে)<span>{fee ? tk(fee) : 'ফ্রি'}</span></div>
                            </div>
                            <button className="btn" style={{ width: '100%' }} onClick={() => { close(); router.get('/checkout'); }}>চেকআউটে যান</button>
                        </>
                    )}
                </div>
            </aside>
        </>
    );
}
