import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Icon } from '../../Components/Icons';
import ProductCard from '../../Components/ProductCard';
import StoreLayout from '../../Layouts/StoreLayout';
import { bn } from '../../lib/format';
import { getWishlist } from '../../lib/wishlist';

export default function Wishlist({ products = [] }) {
    const { shop } = usePage().props;
    const [wishIds, setWishIds] = useState(() => getWishlist());

    useEffect(() => {
        const onUpdate = (e) => {
            setWishIds(e.detail?.list ?? getWishlist());
        };
        window.addEventListener('wishlist:updated', onUpdate);
        return () => window.removeEventListener('wishlist:updated', onUpdate);
    }, []);

    const wishProducts = products.filter((p) => wishIds.includes(Number(p.id)));

    return (
        <>
            <Head title={`পছন্দের তালিকা (${wishProducts.length}) – ${shop.name}`} />
            <div className="w" style={{ padding: '24px 18px 60px' }}>
                <div style={{ marginBottom: 20 }}>
                    <Link
                        href="/"
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 6,
                            color: 'var(--pri)',
                            fontWeight: 600,
                            fontSize: 14,
                            marginBottom: 8,
                        }}
                    >
                        ← সকল পণ্যে ফিরুন
                    </Link>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 10 }}>
                        <h1 style={{ fontSize: 28, margin: 0, color: 'var(--pri)', display: 'flex', alignItems: 'center', gap: 10 }}>
                            <Icon name="heart" size={26} color="#e11d48" />
                            <span>পছন্দের তালিকা (Wishlist)</span>
                        </h1>
                        <span style={{ color: 'var(--mut)', fontSize: 14 }}>
                            মোট সংরক্ষিত: <b>{bn(wishProducts.length)}</b> টি পণ্য
                        </span>
                    </div>
                </div>

                {wishProducts.length > 0 ? (
                    <div className="pgrid">
                        {wishProducts.map((p) => (
                            <ProductCard key={p.id} p={p} />
                        ))}
                    </div>
                ) : (
                    <div
                        className="card"
                        style={{
                            textAlign: 'center',
                            padding: '60px 20px',
                            background: 'var(--card)',
                            borderRadius: 18,
                            border: '1px solid var(--line)',
                            maxWidth: 520,
                            margin: '30px auto',
                        }}
                    >
                        <div
                            style={{
                                width: 68,
                                height: 68,
                                borderRadius: '50%',
                                background: 'var(--soft)',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: 16,
                            }}
                        >
                            <Icon name="heart" size={32} color="#e11d48" />
                        </div>
                        <h2 style={{ fontSize: 22, margin: '0 0 8px', color: 'var(--ink)' }}>
                            আপনার পছন্দের তালিকা বর্তমানে খালি
                        </h2>
                        <p style={{ color: 'var(--mut)', margin: '0 0 24px', fontSize: 14.5 }}>
                            পছন্দের পণ্যের ওপর হার্ট আইকনে ক্লিক করে সহজেই এখানে সেভ করে রাখতে পারেন।
                        </p>
                        <Link className="btn" href="/" style={{ padding: '12px 28px', fontSize: 16 }}>
                            পণ্য দেখুন ও পছন্দ করুন
                        </Link>
                    </div>
                )}
            </div>
        </>
    );
}

Wishlist.layout = (page) => <StoreLayout>{page}</StoreLayout>;
