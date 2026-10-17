import { Head, useForm } from '@inertiajs/react';

export default function Login() {
    const f = useForm({ email: '', password: '', remember: false });
    return (
        <div className="w" style={{ maxWidth: 400, paddingTop: 60 }}>
            <Head title="অ্যাডমিন লগইন" />
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
                <img src="/images/logo.jpg" alt="সুকুন হাট" width="80" height="80" style={{ borderRadius: 16, margin: '0 auto 10px' }} />
                <h1 style={{ fontSize: 26 }}>অ্যাডমিন লগইন</h1>
            </div>
            <form className="card fd" onSubmit={(e) => { e.preventDefault(); f.post('/login'); }}>
                <label htmlFor="email">ইমেইল</label>
                <input id="email" type="email" autoComplete="username" value={f.data.email} onChange={(e) => f.setData('email', e.target.value)} />
                <div className="er">{f.errors.email}</div>
                <label htmlFor="password">পাসওয়ার্ড</label>
                <input id="password" type="password" autoComplete="current-password" value={f.data.password} onChange={(e) => f.setData('password', e.target.value)} />
                <div className="er">{f.errors.password}</div>
                <label><input type="checkbox" checked={f.data.remember} onChange={(e) => f.setData('remember', e.target.checked)} /> মনে রাখুন</label>
                <button className="btn" style={{ width: '100%', marginTop: 12 }} disabled={f.processing}>লগইন</button>
            </form>
        </div>
    );
}
