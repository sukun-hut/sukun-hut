export const bn = (n) => Number(n || 0).toLocaleString('bn-BD');
export const getCurrencySymbol = () => (typeof window !== 'undefined' && window.__CURRENCY_SYMBOL__) || '৳';
export const tk = (n, sym) => (sym || getCurrencySymbol()) + bn(n);
export const hue = (id) => (id * 47) % 360;
export const clean = (o) => Object.fromEntries(Object.entries(o).filter(([, v]) => v));
export const csrf = () => decodeURIComponent((document.cookie.match(/XSRF-TOKEN=([^;]+)/) || [])[1] || '');
export const delivery = (shop, sub, zone) =>
    !sub || (shop.free_over > 0 && sub >= shop.free_over) ? 0 : zone === 'out' ? shop.delivery_out : shop.delivery_in;
export const PAY = {
    cod: 'ক্যাশ অন ডেলিভারি (COD)',
    bkash: 'বিকাশ (bKash)',
    nagad: 'নগদ (Nagad)',
    sslcommerz: 'অনলাইন পেমেন্ট (SSLCommerz)',
};

