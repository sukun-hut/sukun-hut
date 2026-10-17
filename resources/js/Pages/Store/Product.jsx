import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import Gallery from '../../Components/Gallery';
import ProductCard, { Buttons, Price, Stock } from '../../Components/ProductCard';
import StoreLayout from '../../Layouts/StoreLayout';
import { hue, tk } from '../../lib/format';

export default function Product({ product: p, related }) {
    const [copied, setCopied] = useState(false);
    const hasVariations = p.variations && p.variations.length > 0;
    const [selectedVariation, setSelectedVariation] = useState(
        hasVariations ? p.variations[0] : null
    );

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 1800);
        } catch {
            window.prompt('লিংক কপি করুন', window.location.href);
        }
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
                        <button className="btn o" style={{ marginTop: 10, width: '100%' }} onClick={copy}>
                            {copied ? 'লিংক কপি হয়েছে' : 'পণ্যের লিংক কপি করুন'}
                        </button>
                    </div>
                </div>
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
