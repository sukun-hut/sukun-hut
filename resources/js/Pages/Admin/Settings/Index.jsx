import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { tk } from '../../../lib/format';

export default function SettingsIndex({ settings }) {
    const path = window.location.pathname;
    const pfx = path.startsWith('/admin') ? '/admin' : '';

    const form = useForm({
        delivery_in: settings?.delivery_in ?? 70,
        delivery_out: settings?.delivery_out ?? 120,
        free_over: settings?.free_over ?? 2000,
    });

    const submit = (e) => {
        e.preventDefault();
        form.post(`${pfx}/settings`, { preserveScroll: true });
    };

    return (
        <>
            <Head title="ডেলিভারি চার্জ সেটিংস – অ্যাডমিন" />
            <h1 style={{ fontSize: 28, margin: '8px 0 14px' }}>ডেলিভারি চার্জ ও ফ্রি ডেলিভারি সেটিংস</h1>
            <p style={{ color: 'var(--mut)', marginBottom: 20 }}>
                এখান থেকে ডেলিভারি চার্জ এবং ফ্রি ডেলিভারির শর্ত পরিবর্তন করতে পারেন। পরিবর্তন করার সাথে সাথে ফ্রন্টএন্ডে স্বয়ংক্রিয়ভাবে কার্যকর হবে।
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
                <form className="card fd" onSubmit={submit} style={{ maxWidth: 520 }}>
                    <div style={{ marginBottom: 12 }}>
                        <label htmlFor="delivery_in" style={{ fontWeight: 600 }}>ঢাকার ভেতরে ডেলিভারি চার্জ (টাকা)</label>
                        <input
                            id="delivery_in"
                            type="number"
                            min="0"
                            value={form.data.delivery_in}
                            onChange={(e) => form.setData('delivery_in', e.target.value)}
                            placeholder="যেমন: ৭০"
                        />
                        <div className="er">{form.errors.delivery_in}</div>
                    </div>

                    <div style={{ marginBottom: 12 }}>
                        <label htmlFor="delivery_out" style={{ fontWeight: 600 }}>ঢাকার বাইরে ডেলিভারি চার্জ (টাকা)</label>
                        <input
                            id="delivery_out"
                            type="number"
                            min="0"
                            value={form.data.delivery_out}
                            onChange={(e) => form.setData('delivery_out', e.target.value)}
                            placeholder="যেমন: ১২০"
                        />
                        <div className="er">{form.errors.delivery_out}</div>
                    </div>

                    <div style={{ marginBottom: 16 }}>
                        <label htmlFor="free_over" style={{ fontWeight: 600 }}>ফ্রি ডেলিভারির ন্যূনতম অর্ডার পরিমাণ (টাকা)</label>
                        <input
                            id="free_over"
                            type="number"
                            min="0"
                            value={form.data.free_over}
                            onChange={(e) => form.setData('free_over', e.target.value)}
                            placeholder="যেমন: ২০০০ (০ দিলে ফ্রি ডেলিভারি বন্ধ থাকবে)"
                        />
                        <small style={{ color: 'var(--mut)', display: 'block', marginTop: 4 }}>
                            কার্ট সাবটোটাল এই পরিমাণের সমান বা বেশি হলে স্বয়ংক্রিয়ভাবে ডেলিভারি ফ্রি হয়ে যাবে।
                        </small>
                        <div className="er">{form.errors.free_over}</div>
                    </div>

                    <button className="btn" disabled={form.processing} style={{ width: '100%', marginTop: 8 }}>
                        {form.processing ? 'সংরক্ষণ হচ্ছে...' : 'সেটিংস সংরক্ষণ করুন'}
                    </button>
                </form>

                <div className="card" style={{ height: 'fit-content', background: 'var(--soft)' }}>
                    <h3 style={{ fontSize: 18, marginBottom: 10, color: 'var(--pri)' }}>💡 বর্তমান ডেলিভারি রেট সারাংশ</h3>
                    <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.8 }}>
                        <li><strong>ঢাকার ভেতরে:</strong> {tk(form.data.delivery_in || 0)}</li>
                        <li><strong>ঢাকার বাইরে:</strong> {tk(form.data.delivery_out || 0)}</li>
                        <li>
                            <strong>ফ্রি ডেলিভারি:</strong>{' '}
                            {Number(form.data.free_over) > 0 ? (
                                <span>{tk(form.data.free_over)} বা তার বেশি অর্ডারে ফ্রি</span>
                            ) : (
                                <span style={{ color: '#c0392b' }}>বন্ধ রয়েছে</span>
                            )}
                        </li>
                    </ul>
                </div>
            </div>
        </>
    );
}

SettingsIndex.layout = (page) => <AdminLayout>{page}</AdminLayout>;

