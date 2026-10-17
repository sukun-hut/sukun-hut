import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import Gallery from '../../Components/Gallery';
import ProductCard, { Buttons, Price, Stock } from '../../Components/ProductCard';
import StoreLayout from '../../Layouts/StoreLayout';
import { hue } from '../../lib/format';

export default function Product({ product: p, related }) {
    const [copied, setCopied] = useState(false);
    const copy = async () => {
        try { await navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch { window.prompt('লিংক কপি করুন', window.location.href); }
    };

    return (
        <>
            <Head title={`${p.name} – সুকুন হাট`} />
            <div className="w">
                <div className="pd">
                    <Gallery images={p.images} emoji={p.emoji} hue={hue(p.id)} alt={p.name} />
                    <div>
                        <Link href="/">সব পণ্যে ফিরুন</Link>
                        <p style={{ margin: '10px 0 0', color: 'var(--mut)' }}>{p.category?.name}</p>
                        <h1>{p.name}</h1>
                        <Price p={p} />
                        <Stock p={p} />
                        <p style={{ whiteSpace: 'pre-line' }}>{p.description}</p>
                        <Buttons p={p} />
                        <button className="btn o" style={{ marginTop: 10 }} onClick={copy}>{copied ? 'লিংক কপি হয়েছে' : 'পণ্যের লিংক কপি করুন'}</button>
                    </div>
                </div>
                {related.length > 0 && (
                    <section style={{ marginTop: 20 }}>
                        <h2 style={{ fontSize: 24, marginBottom: 12 }}>আরও পণ্য</h2>
                        <div className="pgrid">{related.map((r) => <ProductCard key={r.id} p={r} />)}</div>
                    </section>
                )}
            </div>
        </>
    );
}

Product.layout = (page) => <StoreLayout>{page}</StoreLayout>;
