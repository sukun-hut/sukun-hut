import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '../../../Layouts/AdminLayout';
import Thumb from '../../../Components/Thumb';
import { bn, tk } from '../../../lib/format';

export default function Form({ product, categories }) {
    const path = window.location.pathname;
    const pfx = path.startsWith('/admin') ? '/admin' : '';

    const f = useForm({
        name: product?.name ?? '',
        slug: product?.slug ?? '',
        category_id: product?.category_id ?? categories[0]?.id ?? '',
        price: product?.price ?? '',
        old_price: product?.old_price ?? '',
        description: product?.description ?? '',
        emoji: product?.emoji ?? '',
        in_stock: product?.in_stock ?? true,
        is_active: product?.is_active ?? true,
        images: [],
    });

    const [variations, setVariations] = useState(
        product?.variations?.map((v) => ({
            id: v.id,
            name: v.name,
            price: v.price,
            old_price: v.old_price ?? '',
            in_stock: v.in_stock ?? true,
        })) || []
    );

    const [previews, setPreviews] = useState([]);

    const d = f.data;
    const set = (k) => (e) => f.setData(k, e.target.value);

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        f.setData('images', files);
        const objUrls = files.map((file) => ({
            name: file.name,
            size: (file.size / 1024 / 1024).toFixed(2),
            url: URL.createObjectURL(file),
        }));
        setPreviews(objUrls);
    };

    const addVariation = () => {
        setVariations((prev) => [
            ...prev,
            { id: null, name: '', price: d.price || '', old_price: '', in_stock: true },
        ]);
    };

    const updateVariation = (index, field, value) => {
        setVariations((prev) =>
            prev.map((v, i) => (i === index ? { ...v, [field]: value } : v))
        );
    };

    const removeVariation = (index) => {
        setVariations((prev) => prev.filter((_, i) => i !== index));
    };

    const submit = (e) => {
        e.preventDefault();

        // If variations are configured and product price is empty, default base price to lowest variation
        const cleanedVariations = variations.filter((v) => v.name.trim() !== '' && Number(v.price) > 0);
        let basePrice = d.price;
        if (!basePrice && cleanedVariations.length > 0) {
            basePrice = Math.min(...cleanedVariations.map((v) => Number(v.price)));
            f.setData('price', basePrice);
        }

        const transformFn = (x) => ({
            ...x,
            price: x.price || basePrice,
            ...(product ? { _method: 'put' } : {}),
            variations: JSON.stringify(cleanedVariations),
        });

        if (product) {
            f.transform(transformFn).post(`${pfx}/products/${product.id}`, { forceFormData: true });
        } else {
            f.transform(transformFn).post(`${pfx}/products`, { forceFormData: true });
        }
    };

    const err = (k) => <div className="er">{f.errors[k]}</div>;

    return (
        <>
            <Head title={product ? 'পণ্য এডিট' : 'নতুন পণ্য'} />
            <Link href={`${pfx}/products`}>← পণ্যের তালিকায় ফিরুন</Link>
            <h1 style={{ fontSize: 28, margin: '8px 0 14px' }}>{product ? 'পণ্য এডিট' : 'নতুন পণ্য'}</h1>

            {categories.length === 0 && (
                <div className="card" style={{ marginBottom: 12 }}>
                    আগে <Link href={`${pfx}/categories`}><u>ক্যাটাগরি</u></Link> তৈরি করুন।
                </div>
            )}

            <form className="card fd" style={{ maxWidth: 700 }} onSubmit={submit}>
                <label htmlFor="name">পণ্যের নাম *</label>
                <input id="name" value={d.name} onChange={set('name')} placeholder="যেমন: খাঁটি সুন্দরবন মধু" required />
                {err('name')}

                <label htmlFor="category_id">ক্যাটাগরি *</label>
                <select id="category_id" value={d.category_id} onChange={set('category_id')}>
                    {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                </select>
                {err('category_id')}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div>
                        <label htmlFor="price">মূল দাম (টাকা) *</label>
                        <input id="price" type="number" min="1" value={d.price} onChange={set('price')} placeholder="যেমন: ৮৫০" required />
                        {err('price')}
                    </div>
                    <div>
                        <label htmlFor="old_price">আগের দাম (ঐচ্ছিক, ছাড় দেখাতে)</label>
                        <input id="old_price" type="number" min="1" value={d.old_price} onChange={set('old_price')} placeholder="যেমন: ৯৫০" />
                        {err('old_price')}
                    </div>
                </div>

                {/* PRODUCT VARIATIONS SECTION */}
                <div style={{ marginTop: 14, marginBottom: 14, padding: 14, border: '1px solid var(--line)', borderRadius: 12, background: 'var(--soft)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                        <div>
                            <h3 style={{ fontSize: 18, color: 'var(--pri)', margin: 0 }}>পণ্য ভেরিয়েশন (Product Variations)</h3>
                            <small style={{ color: 'var(--mut)' }}>যেমন: ১ কেজি, ২ কেজি, ৫০০ গ্রাম বা সাইজ অনুযায়ী আলাদা মূল্য</small>
                        </div>
                        <button type="button" className="mini" onClick={addVariation} style={{ background: 'var(--card)', fontWeight: 600 }}>
                            + ভেরিয়েশন যোগ করুন
                        </button>
                    </div>

                    {variations.length === 0 ? (
                        <p style={{ margin: '6px 0 0', color: 'var(--mut)', fontSize: 14 }}>
                            কোনো ভেরিয়েশন যোগ করা হয়নি। পণ্যটির একক দাম নির্ধারিত থাকবে। ভেরিয়েশন যুক্ত করতে উপরের বাটনে ক্লিক করুন।
                        </p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {variations.map((v, idx) => (
                                <div key={idx} style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1.5fr auto auto', gap: 8, alignItems: 'center', background: 'var(--card)', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--line)' }}>
                                    <div>
                                        <label style={{ fontSize: 12, margin: '0 0 2px' }}>ভেরিয়েশন নাম *</label>
                                        <input
                                            type="text"
                                            value={v.name}
                                            onChange={(e) => updateVariation(idx, 'name', e.target.value)}
                                            placeholder="যেমন: ১ কেজি / XL"
                                            required
                                            style={{ padding: '6px 10px', fontSize: 14 }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: 12, margin: '0 0 2px' }}>বিক্রয় মূল্য (৳) *</label>
                                        <input
                                            type="number"
                                            min="1"
                                            value={v.price}
                                            onChange={(e) => updateVariation(idx, 'price', e.target.value)}
                                            placeholder="যেমন: ৮৫০"
                                            required
                                            style={{ padding: '6px 10px', fontSize: 14 }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: 12, margin: '0 0 2px' }}>আগের মূল্য (৳)</label>
                                        <input
                                            type="number"
                                            min="1"
                                            value={v.old_price}
                                            onChange={(e) => updateVariation(idx, 'old_price', e.target.value)}
                                            placeholder="ঐচ্ছিক"
                                            style={{ padding: '6px 10px', fontSize: 14 }}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <label style={{ fontSize: 12, margin: '0 0 2px' }}>স্টক</label>
                                        <input
                                            type="checkbox"
                                            checked={v.in_stock}
                                            onChange={(e) => updateVariation(idx, 'in_stock', e.target.checked)}
                                            style={{ width: 'auto', margin: 6 }}
                                            title="স্টকে আছে কি না"
                                        />
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'flex-end', height: '100%' }}>
                                        <button
                                            type="button"
                                            className="mini"
                                            onClick={() => removeVariation(idx)}
                                            style={{ color: '#c0392b', border: '1px solid #c0392b', padding: '6px 10px' }}
                                            title="মুছুন"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <label htmlFor="description">বিবরণ</label>
                <textarea id="description" rows={4} value={d.description} onChange={set('description')} />
                {err('description')}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 12 }}>
                    <div>
                        <label htmlFor="emoji">ইমোজি (ছবি না থাকলে)</label>
                        <input id="emoji" maxLength={8} value={d.emoji} onChange={set('emoji')} placeholder="যেমন: 🍯" />
                        {err('emoji')}
                    </div>
                    <div>
                        <label htmlFor="slug">লিংকের নাম (URL Slug, ঐচ্ছিক)</label>
                        <input id="slug" value={d.slug} onChange={set('slug')} placeholder="খালি রাখলে নাম থেকে স্বয়ংক্রিয় হবে" />
                        {err('slug')}
                    </div>
                </div>

                {/* IMAGES SECTION */}
                <div style={{ marginTop: 14 }}>
                    <label style={{ fontWeight: 600 }}>পণ্যের ছবি (প্রথম ছবিটি মূল ছবি হিসেবে প্রদর্শিত হবে)</label>

                    {product?.images?.length > 0 && (
                        <div style={{ margin: '8px 0 12px' }}>
                            <small style={{ color: 'var(--mut)', display: 'block', marginBottom: 6 }}>বর্তমানে সংরক্ষিত ছবি:</small>
                            {product.images.map((im, i) => (
                                <div key={im.id} style={{ display: 'flex', gap: 10, alignItems: 'center', margin: '6px 0', background: 'var(--card)', border: '1px solid var(--line)', padding: '6px 10px', borderRadius: 8 }}>
                                    <div className="th"><Thumb src={im.url} /></div>
                                    <small style={{ flex: 1, fontWeight: i === 0 ? 600 : 400 }}>ছবি {bn(i + 1)}{i === 0 && ' (★ মূল ছবি)'}</small>
                                    {i > 0 && (
                                        <button
                                            type="button"
                                            className="mini"
                                            onClick={() => router.patch(`${pfx}/products/${product.id}/images/${im.id}/main`, {}, { preserveScroll: true })}
                                        >
                                            মূল ছবি করুন
                                        </button>
                                    )}
                                    <button
                                        type="button"
                                        className="mini"
                                        style={{ color: '#c0392b' }}
                                        onClick={() => window.confirm('ছবিটি নিশ্চিত মুছে ফেলতে চান?') && router.delete(`${pfx}/products/${product.id}/images/${im.id}`, { preserveScroll: true })}
                                    >
                                        মুছুন
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    <div style={{ border: '2px dashed var(--line)', padding: 14, borderRadius: 10, textAlign: 'center', background: 'var(--card)' }}>
                        <input
                            type="file"
                            id="images_input"
                            accept="image/jpeg,image/png,image/webp,image/jpg"
                            multiple
                            onChange={handleFileChange}
                            style={{ display: 'none' }}
                        />
                        <label htmlFor="images_input" style={{ cursor: 'pointer', display: 'inline-block', margin: 0 }}>
                            <span className="btn o" style={{ margin: '4px 0' }}>📁 নতুন ছবি বাছাই করুন</span>
                            <small style={{ display: 'block', color: 'var(--mut)', marginTop: 4 }}>JPG, PNG বা WebP ফরম্যাট (সর্বোচ্চ ৫ MB)</small>
                        </label>
                    </div>

                    {previews.length > 0 && (
                        <div style={{ marginTop: 10 }}>
                            <small style={{ color: 'var(--pri)', fontWeight: 600, display: 'block', marginBottom: 6 }}>
                                নির্বাচিত নতুন ছবি ({bn(previews.length)}টি সংরক্ষণে যোগ হবে):
                            </small>
                            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                                {previews.map((pv, i) => (
                                    <div key={i} style={{ width: 80, textAlign: 'center' }}>
                                        <img src={pv.url} alt="" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8, border: '1px solid var(--line)' }} />
                                        <span style={{ fontSize: 11, color: 'var(--mut)', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{pv.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {Object.keys(f.errors).filter((k) => k.startsWith('images')).map((k) => (
                        <div className="er" key={k}>{f.errors[k]}</div>
                    ))}
                </div>

                <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <label><input type="checkbox" checked={d.in_stock} onChange={(e) => f.setData('in_stock', e.target.checked)} /> স্টকে আছে</label>
                    <label><input type="checkbox" checked={d.is_active} onChange={(e) => f.setData('is_active', e.target.checked)} /> সাইটে দেখাও (টিক উঠিয়ে দিলে পণ্য কাস্টমারদের কাছে লুকানো থাকবে)</label>
                </div>

                <div className="row2" style={{ marginTop: 18 }}>
                    <button className="btn" disabled={f.processing}>{f.processing ? 'সংরক্ষণ হচ্ছে...' : 'সংরক্ষণ করুন'}</button>
                    <Link className="btn o" href={`${pfx}/products`}>বাতিল</Link>
                </div>
            </form>
        </>
    );
}

Form.layout = (page) => <AdminLayout>{page}</AdminLayout>;
