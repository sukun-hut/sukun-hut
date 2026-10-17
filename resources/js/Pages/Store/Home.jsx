import { Head, Link, router, usePage } from '@inertiajs/react';
import ProductCard from '../../Components/ProductCard';
import StoreLayout from '../../Layouts/StoreLayout';
import { clean } from '../../lib/format';

export default function Home({ products, categories, filters }) {
    const { shop } = usePage().props;
    const [l1, l2] = shop.tagline.split('\n');
    const go = (p) => router.get('/', clean({ ...filters, ...p }), { preserveState: true, preserveScroll: true, replace: true });

    return (
        <>
            <Head title={`${shop.name} – অনলাইন শপ`} />
            <div className="w">
                <section className="hero">
                    <div>
                        <h1>{l1}<br />{l2}</h1>
                        <p>{shop.subtagline}</p>
                        <a className="btn" href="#shop">কেনাকাটা শুরু করুন</a>{' '}
                        <a className="btn o" href={shop.facebook} target="_blank" rel="noopener">ফেসবুক পেজ</a>
                    </div>
                    <div className="hut">
                        <img className="hutlg" src="/images/logo.jpg" alt={`${shop.name} লোগো`} width="220" height="220" />
                        <p className="hutnm">{shop.name}</p>
                        <small className="huttg">{shop.subtagline}</small>
                    </div>
                </section>
                <div className="tr">
                    <span><b>ক্যাশ অন ডেলিভারি</b> সুবিধা</span>
                    <span><b>সারা দেশে</b> হোম ডেলিভারি</span>
                    <span><b>বিকাশ ও নগদে</b> পেমেন্ট</span>
                    {shop.free_over > 0 && <span><b>{shop.free_over.toLocaleString('bn-BD')} টাকার</b> উপরে ডেলিভারি ফ্রি</span>}
                </div>
                <section id="shop">
                    <div className="tools">
                        <div className="chips">
                            <button className={`chip${!filters.category ? ' on' : ''}`} onClick={() => go({ category: null })}>সব</button>
                            {categories.map((c) => (
                                <button key={c.id} className={`chip${filters.category === c.slug ? ' on' : ''}`} onClick={() => go({ category: c.slug })}>{c.name}</button>
                            ))}
                        </div>
                        <select value={filters.sort || ''} onChange={(e) => go({ sort: e.target.value })} aria-label="সাজান">
                            <option value="">সাজান: নতুন আগে</option>
                            <option value="lo">দাম: কম থেকে বেশি</option>
                            <option value="hi">দাম: বেশি থেকে কম</option>
                        </select>
                    </div>
                    <div className="pgrid">
                        {products.length ? products.map((p) => <ProductCard key={p.id} p={p} />) : <p className="empty">কোনো পণ্য পাওয়া যায়নি। অন্য শব্দে খুঁজুন।</p>}
                    </div>
                </section>
            </div>
        </>
    );
}

Home.layout = (page) => <StoreLayout>{page}</StoreLayout>;
