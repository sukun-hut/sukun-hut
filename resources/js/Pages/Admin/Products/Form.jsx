import { Head, Link, router, useForm } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import Thumb from '../../../Components/Thumb';

export default function Form({ product, categories }) {
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
    const d = f.data;
    const set = (k) => (e) => f.setData(k, e.target.value);
    const submit = (e) => {
        e.preventDefault();
        if (product) f.transform((x) => ({ ...x, _method: 'put' })).post(`/products/${product.id}`, { forceFormData: true });
        else f.post('/products', { forceFormData: true });
    };
    const err = (k) => <div className="er">{f.errors[k]}</div>;

    return (
        <>
            <Head title={product ? 'পণ্য এডিট' : 'নতুন পণ্য'} />
            <Link href="/products">পণ্যের তালিকায় ফিরুন</Link>
            <h1 style={{ fontSize: 28, margin: '8px 0 14px' }}>{product ? 'পণ্য এডিট' : 'নতুন পণ্য'}</h1>
            {categories.length === 0 && <div className="card" style={{ marginBottom: 12 }}>আগে <Link href="/categories"><u>ক্যাটাগরি</u></Link> তৈরি করুন।</div>}
            <form className="card fd" style={{ maxWidth: 640 }} onSubmit={submit}>
                <label htmlFor="name">নাম</label>
                <input id="name" value={d.name} onChange={set('name')} />{err('name')}
                <label htmlFor="category_id">ক্যাটাগরি</label>
                <select id="category_id" value={d.category_id} onChange={set('category_id')}>
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>{err('category_id')}
                <label htmlFor="price">দাম (টাকা)</label>
                <input id="price" type="number" min="1" value={d.price} onChange={set('price')} />{err('price')}
                <label htmlFor="old_price">আগের দাম (ঐচ্ছিক, ছাড় দেখাতে)</label>
                <input id="old_price" type="number" min="1" value={d.old_price} onChange={set('old_price')} />{err('old_price')}
                <label htmlFor="description">বিবরণ</label>
                <textarea id="description" rows={5} value={d.description} onChange={set('description')} />{err('description')}
                <label htmlFor="emoji">ইমোজি (ছবি না থাকলে এটি দেখাবে, ঐচ্ছিক)</label>
                <input id="emoji" maxLength={8} value={d.emoji} onChange={set('emoji')} />{err('emoji')}
                <label htmlFor="slug">লিংকের নাম (ঐচ্ছিক, ইংরেজিতে)</label>
                <input id="slug" value={d.slug} onChange={set('slug')} placeholder="খালি রাখলে নাম থেকে তৈরি হবে" />{err('slug')}

                <label>ছবি (প্রথম ছবিটিই মূল ছবি)</label>
                {product?.images.map((im, i) => (
                    <div key={im.id} style={{ display: 'flex', gap: 10, alignItems: 'center', margin: '6px 0' }}>
                        <div className="th"><Thumb src={im.url} /></div>
                        <small style={{ flex: 1 }}>ছবি {i + 1}{i === 0 && ' (মূল)'}</small>
                        {i > 0 && <button type="button" className="mini" onClick={() => router.patch(`/products/${product.id}/images/${im.id}/main`, {}, { preserveScroll: true })}>মূল করুন</button>}
                        <button type="button" className="mini" onClick={() => window.confirm('ছবিটি মুছবেন?') && router.delete(`/products/${product.id}/images/${im.id}`, { preserveScroll: true })}>মুছুন</button>
                    </div>
                ))}
                <input type="file" accept="image/*" multiple onChange={(e) => f.setData('images', [...e.target.files])} />
                {d.images.length > 0 && <small style={{ color: 'var(--mut)' }}>{d.images.length.toLocaleString('bn-BD')}টি নতুন ছবি সংরক্ষণে যোগ হবে</small>}
                {Object.keys(f.errors).filter((k) => k.startsWith('images')).slice(0, 1).map((k) => <div className="er" key={k}>{f.errors[k]}</div>)}

                <label><input type="checkbox" checked={d.in_stock} onChange={(e) => f.setData('in_stock', e.target.checked)} /> স্টকে আছে</label>
                <label><input type="checkbox" checked={d.is_active} onChange={(e) => f.setData('is_active', e.target.checked)} /> সাইটে দেখাও (বন্ধ করলে পণ্য লুকানো থাকবে)</label>
                <div className="row2" style={{ marginTop: 14 }}>
                    <button className="btn" disabled={f.processing}>{f.processing ? 'সংরক্ষণ হচ্ছে...' : 'সংরক্ষণ করুন'}</button>
                    <Link className="btn o" href="/products">বাতিল</Link>
                </div>
            </form>
        </>
    );
}

Form.layout = (page) => <AdminLayout>{page}</AdminLayout>;
