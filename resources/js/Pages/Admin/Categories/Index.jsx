import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '../../../Layouts/AdminLayout';

function Row({ c }) {
    const [name, setName] = useState(c.name);
    return (
        <div className="card" style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginBottom: 8 }}>
            <input className="inp" style={{ flex: 1, minWidth: 160 }} value={name} onChange={(e) => setName(e.target.value)} aria-label="ক্যাটাগরির নাম" />
            <small style={{ color: 'var(--mut)' }}>{c.products_count.toLocaleString('bn-BD')}টি পণ্য</small>
            <button className="mini" disabled={!name.trim() || name === c.name} onClick={() => router.put(`/categories/${c.id}`, { name }, { preserveScroll: true })}>সংরক্ষণ</button>
            <button className="mini" onClick={() => window.confirm(`"${c.name}" মুছবেন?`) && router.delete(`/categories/${c.id}`, { preserveScroll: true })}>মুছুন</button>
        </div>
    );
}

export default function Index({ categories }) {
    const f = useForm({ name: '' });
    return (
        <>
            <Head title="ক্যাটাগরি" />
            <h1 style={{ fontSize: 28, marginBottom: 14 }}>ক্যাটাগরি</h1>
            <form className="card" style={{ marginBottom: 14 }} onSubmit={(e) => { e.preventDefault(); f.post('/categories', { preserveScroll: true, onSuccess: () => f.reset() }); }}>
                <div style={{ display: 'flex', gap: 8 }}>
                    <input className="inp" placeholder="নতুন ক্যাটাগরির নাম" value={f.data.name} onChange={(e) => f.setData('name', e.target.value)} />
                    <button className="btn" style={{ flex: 'none' }} disabled={f.processing}>যোগ করুন</button>
                </div>
                <div className="er">{f.errors.name}</div>
            </form>
            {categories.length === 0 && <p className="empty">কোনো ক্যাটাগরি নেই</p>}
            {categories.map((c) => <Row key={c.id} c={c} />)}
        </>
    );
}

Index.layout = (page) => <AdminLayout>{page}</AdminLayout>;
