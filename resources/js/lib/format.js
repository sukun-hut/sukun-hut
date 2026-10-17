export const bn = (n) => Number(n || 0).toLocaleString('bn-BD');
export const tk = (n) => '৳' + bn(n);
export const hue = (id) => (id * 47) % 360;
export const clean = (o) => Object.fromEntries(Object.entries(o).filter(([, v]) => v));
export const csrf = () => decodeURIComponent((document.cookie.match(/XSRF-TOKEN=([^;]+)/) || [])[1] || '');
export const delivery = (shop, sub, zone) =>
    !sub || (shop.free_over > 0 && sub >= shop.free_over) ? 0 : zone === 'out' ? shop.delivery_out : shop.delivery_in;
export const PAY = { cod: 'ক্যাশ অন ডেলিভারি', bkash: 'বিকাশ', nagad: 'নগদ' };
