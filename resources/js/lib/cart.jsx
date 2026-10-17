import { createContext, useContext, useEffect, useState } from 'react';

const KEY = 'sh_cart_v3';
const Ctx = createContext(null);
export const useCart = () => useContext(Ctx);

export function CartProvider({ children }) {
    const [items, setItems] = useState(() => {
        try {
            // Check v3 first, fallback to v2 migration
            const saved = localStorage.getItem(KEY) || localStorage.getItem('sh_cart_v2');
            const parsed = JSON.parse(saved || '[]');
            return parsed.map((item) => ({
                ...item,
                key: item.key || (item.variation_id ? `${item.id}_${item.variation_id}` : String(item.id)),
            }));
        } catch {
            return [];
        }
    });
    const [open, setOpen] = useState(false);
    const [toast, setToast] = useState({ m: '', on: false });

    useEffect(() => {
        try {
            localStorage.setItem(KEY, JSON.stringify(items));
        } catch {
            /* ignore */
        }
    }, [items]);

    useEffect(() => {
        if (!toast.on) return;
        const t = setTimeout(() => setToast((x) => ({ ...x, on: false })), 1800);
        return () => clearTimeout(t);
    }, [toast]);

    const add = (p, qty = 1, variation = null) => {
        const inStock = variation ? variation.in_stock : p.in_stock;
        if (!inStock) return;

        const price = variation ? variation.price : p.price;
        const itemKey = variation ? `${p.id}_${variation.id}` : String(p.id);

        setItems((cur) => {
            const found = cur.find((i) => (i.key || String(i.id)) === itemKey);
            if (found) {
                return cur.map((i) =>
                    (i.key || String(i.id)) === itemKey
                        ? { ...i, qty: Math.min(20, i.qty + qty), price }
                        : i
                );
            }
            return [
                ...cur,
                {
                    key: itemKey,
                    id: p.id,
                    variation_id: variation ? variation.id : null,
                    variation_name: variation ? variation.name : null,
                    slug: p.slug,
                    name: p.name,
                    price,
                    image: p.images?.[0] || null,
                    emoji: p.emoji || null,
                    qty,
                },
            ];
        });
        setToast({ m: 'কার্টে যোগ হয়েছে', on: true });
    };

    const setQty = (key, q) => {
        const targetKey = String(key);
        setItems((cur) =>
            cur
                .filter((i) => (i.key || String(i.id)) !== targetKey || q > 0)
                .map((i) =>
                    (i.key || String(i.id)) === targetKey
                        ? { ...i, qty: Math.min(20, q) }
                        : i
                )
        );
    };

    const clear = () => setItems([]);
    const count = items.reduce((a, i) => a + Number(i.qty || 0), 0);
    const subtotal = items.reduce((a, i) => a + Number(i.price || 0) * Number(i.qty || 0), 0);

    return (
        <Ctx.Provider value={{ items, add, setQty, clear, count, subtotal, open, setOpen, toast }}>
            {children}
        </Ctx.Provider>
    );
}
