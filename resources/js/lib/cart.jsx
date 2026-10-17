import { createContext, useContext, useEffect, useState } from 'react';

const KEY = 'sh_cart_v2';
const Ctx = createContext(null);
export const useCart = () => useContext(Ctx);

export function CartProvider({ children }) {
    const [items, setItems] = useState(() => {
        try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; }
    });
    const [open, setOpen] = useState(false);
    const [toast, setToast] = useState({ m: '', on: false });

    useEffect(() => {
        try { localStorage.setItem(KEY, JSON.stringify(items)); } catch { /* ignore */ }
    }, [items]);
    useEffect(() => {
        if (!toast.on) return;
        const t = setTimeout(() => setToast((x) => ({ ...x, on: false })), 1800);
        return () => clearTimeout(t);
    }, [toast]);

    const add = (p, qty = 1) => {
        if (!p.in_stock) return;
        setItems((cur) => {
            const found = cur.find((i) => i.id === p.id);
            if (found) return cur.map((i) => (i.id === p.id ? { ...i, qty: Math.min(20, i.qty + qty), price: p.price } : i));
            return [...cur, { id: p.id, slug: p.slug, name: p.name, price: p.price, image: p.images?.[0] || null, emoji: p.emoji || null, qty }];
        });
        setToast({ m: 'কার্টে যোগ হয়েছে', on: true });
    };
    const setQty = (id, q) => setItems((cur) => cur.filter((i) => i.id !== id || q > 0).map((i) => (i.id === id ? { ...i, qty: Math.min(20, q) } : i)));
    const clear = () => setItems([]);
    const count = items.reduce((a, i) => a + i.qty, 0);
    const subtotal = items.reduce((a, i) => a + i.price * i.qty, 0);

    return <Ctx.Provider value={{ items, add, setQty, clear, count, subtotal, open, setOpen, toast }}>{children}</Ctx.Provider>;
}
