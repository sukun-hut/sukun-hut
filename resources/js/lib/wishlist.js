// Wishlist storage and helper for Sukun Hut
const KEY = 'sh_wishlist_v1';

export function getWishlist() {
    if (typeof window === 'undefined') return [];
    try {
        const raw = localStorage.getItem(KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

export function isWishlisted(id) {
    if (!id) return false;
    const list = getWishlist();
    return list.includes(Number(id));
}

export function toggleWishlist(product) {
    if (typeof window === 'undefined' || !product?.id) return { wishlisted: false, count: 0 };
    const pid = Number(product.id);
    let list = getWishlist();
    let wishlisted = false;

    if (list.includes(pid)) {
        list = list.filter((i) => i !== pid);
        wishlisted = false;
    } else {
        list.push(pid);
        wishlisted = true;
    }

    try {
        localStorage.setItem(KEY, JSON.stringify(list));
    } catch {
        /* ignore */
    }

    window.dispatchEvent(new CustomEvent('wishlist:updated', { detail: { list, productId: pid, wishlisted } }));
    return { wishlisted, count: list.length };
}
