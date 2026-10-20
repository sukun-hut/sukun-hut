# Sukun Hut — White-Label E-Commerce Boilerplate 🛍️

Laravel 12 + Inertia (React) ভিত্তিক একটি প্রফেশনাল, রিইউজেবল **হোয়াইট-লেবেল ই-কমার্স বয়লারপ্লেট**।
যেকোনো ক্লায়েন্টের শপের জন্য অ্যাডমিন প্যানেল থেকেই ব্র্যান্ডিং, থিম, ডেলিভারি নিয়ম, পেমেন্ট গেটওয়ে ও ফিচার মডিউল কাস্টমাইজ করে দ্রুত সাইট ডেলিভারি দেওয়া যায় — কোনো কোড পরিবর্তন ছাড়াই।

---

## ⚡ Quick Start (নতুন ক্লায়েন্ট সাইট সেটআপ)

```bash
# 1. ডিপেন্ডেন্সি ইনস্টল
composer install
npm install

# 2. এনভায়রনমেন্ট সেটআপ
cp .env.example .env
php artisan key:generate

# 3. এক কমান্ডে ডাটাবেস + ডেমো ডাটা + অ্যাডমিন অ্যাকাউন্ট
php artisan migrate:fresh --seed

# 4. স্টোরেজ লিংক
php artisan storage:link

# 5. ডেভ সার্ভার
npm run dev
php artisan serve
```

### ডিফল্ট অ্যাডমিন লগইন
| | |
|---|---|
| **URL** | `/admin` (অথবা `ADMIN_DOMAIN` কনফিগ অনুযায়ী) |
| **Email** | `.env` ফাইলের `ADMIN_EMAIL` (ডিফল্ট: `admin@sukunhut.test`) |
| **Password** | `.env` ফাইলের `ADMIN_PASSWORD` (ডিফল্ট: `ChangeMe-12345`) |

> ⚠️ **হ্যান্ডওভারের আগে অবশ্যই** `.env` এ নতুন অ্যাডমিন ইমেইল/পাসওয়ার্ড সেট করে আবার `migrate:fresh --seed` চালান।

---

## 🎛️ সাইট সেটিংস (Admin Panel)

অ্যাডমিন → **সাইট সেটিংস** পেজে ৬টি ট্যাব:

### 🏢 Branding
সাইট নাম, স্লোগান, ইমেইল, ফোন, ঠিকানা, ফেসবুক/মেসেঞ্জার/হোয়াটসঅ্যাপ লিংক, লোগো ও ফেভিকন আপলোড, ফেসবুক পিক্সেল — সব ডাটাবেস থেকে পরিচালিত, হার্ডকোড নেই।

### 🎨 Theme & Colors
- প্রাইমারি/সেকেন্ডারি কালার পিকার (CSS ভেরিয়েবল `--pri`, `--acc`)
- ৬টি রেডিমেড কালার প্রিসেট
- কারেন্সি সিম্বল সিলেক্টর (৳, $, €, ₹, কাস্টম)
- লাইভ প্রিভিউ প্যানেল

### 🛒 Store & Delivery
- ঢাকার ভেতরে/বাইরে ডেলিভারি চার্জ
- ফ্রি ডেলিভারি থ্রেশহোল্ড
- ট্যাক্স/ভ্যাট হার
- অর্ডার নম্বর প্রিফিক্স

### 💳 Payment Gateways
টগল দিয়ে অন/অফ: **COD**, **bKash** (TrxID ভেরিফিকেশনসহ), **Nagad**, **SSLCommerz**।
চালু গেটওয়েগুলোই চেকআউট পেজে কাস্টমারের কাছে দেখাবে; সার্ভার সাইডেও ভ্যালিডেশন হয়।

### 🧩 Feature Modules (Plug-and-Play)
কুপন, ভেরিয়েশন, রিভিউ, উইশলিস্ট — প্রতিটি টগল অন/অফ করলেই ফ্রন্টএন্ডে দেখা/না-দেখা হবে।

### 🗄️ Demo Data
- **Reset to Default Data** — ডেমো প্রোডাক্ট/ক্যাটাগরি রিস্টোর
- **Clean Handover** — সব ডেমো প্রোডাক্ট, ক্যাটাগরি ও টেস্ট অর্ডার মুছে ফাঁকা স্টোর ডেলিভারি

---

## 🏗️ আর্কিটেকচার

```
app/
├── Http/
│   ├── Controllers/
│   │   ├── Admin/          # অ্যাডমিন CRUD (Product, Category, Order, Setting)
│   │   └── Store/          # স্টোরফ্রন্ট (Home, Product, Checkout)
│   └── Middleware/
│       └── HandleInertiaRequests.php   # সব ডায়নামিক সেটিংস 'shop' প্রপ হিসেবে শেয়ার
├── Models/
│   └── Setting.php         # get/getInt/getBool/set + ক্যাশিং, deliverySettings()
├── Support/
│   └── Shop.php            # ডেলিভারি ফি, কুপন ডিসকাউন্ট, কারেন্সি হেল্পার
config/
├── shop.php                # ডিফল্ট ফলব্যাক ভ্যালু + admin ক্রেডেনশিয়াল
├── branding.php            # ব্র্যান্ডিং ফলব্যাক
└── store.php               # স্টোর রুলস ফলব্যাক
database/seeders/
├── DatabaseSeeder.php      # সেটিংস → অ্যাডমিন → ডেমো ডাটা (ক্রমানুসারে)
├── SettingsSeeder.php      # ৩৫+ ডিফল্ট সেটিংস
└── DemoDataSeeder.php      # ৩ ক্যাটাগরি, ৯ প্রোডাক্ট, ভেরিয়েশনসহ
resources/js/
├── Layouts/                # StoreLayout (থিম-ফ্রেন্ডলি), AdminLayout
├── Pages/
│   ├── Admin/Settings/     # ট্যাব-ভিত্তিক সেটিংস UI
│   └── Store/              # Home, Product, Checkout (ডায়নামিক পেমেন্ট UI)
└── lib/format.js           # tk(), bn() — ডায়নামিক কারেন্সি সিম্বল সাপোর্ট
```

### সেটিংস রেজলিউশন অর্ডার
1. **Database** (`settings` টেবিল) → 2. **Config** (`config/shop.php`) → 3. **Hardcoded default**

---

## 🧩 নতুন মডিউল যোগ করা (Plug-and-Play)

### নতুন সেটিংস ফিল্ড
`SettingController::update()`-এর `$map` অ্যারেতে এক লাইন যোগ করুন:

```php
'feature_reviews' => ['feature_review', 'boolean', 'features'],
```

`SettingsSeeder`-এ ডিফল্ট ভ্যালু, এবং `HandleInertiaRequests::share()`-এ `shop` প্রপে যোগ করুন — UI-তে টগল স্বয়ংক্রিয়ভাবে কাজ করবে।

### নতুন পেমেন্ট গেটওয়ে
1. `SettingController` → validation + map-এ `payment_xxx_enabled` যোগ
2. `CheckoutController::store()` → `$allowed[] = 'xxx';`
3. `Checkout.jsx` → নতুন গেটওয়ে কার্ড UI (bkash ব্লক কপি করে)
4. `.env`-এ গেটওয়ে API কি

### ফিচার ফ্ল্যাগ ফ্রন্টএন্ডে ব্যবহার

```jsx
const { shop } = usePage().props;
{shop.features.coupon && <CouponInput />}
{shop.features.wishlist && <WishlistButton />}
```

---

## 🎨 থিম-ফ্রেন্ডলি CSS

সব রং CSS ভেরিয়েবল দিয়ে চলে — থিম বদলাতে শুধু DB ভ্যালু বদলান:

```css
:root {
    --pri: #17463a;   /* admin প্যানেল থেকে ডায়নামিক */
    --acc: #e9a820;
}
.btn   { background: var(--pri); }
.badge { background: var(--acc); }
```

---

## 📦 ক্লায়েন্ট হ্যান্ডওভার চেকলিস্ট

- [ ] `.env`: `APP_NAME`, `APP_URL`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` বদলান
- [ ] `migrate:fresh --seed` চালিয়ে ডেমো রিসেট করুন
- [ ] অ্যাডমিন → সাইট সেটিংস → ক্লায়েন্টের লোগো/ফেভিকন/কালার/কন্টাক্ট সেট করুন
- [ ] পেমেন্ট গেটওয়ে টগল + বিকাশ/নগদ নম্বর সেট করুন
- [ ] ডেলিভারি চার্জ ক্লায়েন্টের নিয়ম অনুযায়ী সেট করুন
- [ ] Demo Data ট্যাব → **Clean Handover** চালিয়ে টেস্ট ডাটা মুছুন
- [ ] `php artisan config:cache && php artisan route:cache`

---

## 🛠️ Tech Stack

Laravel 12 · Inertia 2 · React 19 · Tailwind-free custom CSS (variable-driven) · Vite 6

---

## 📄 License

MIT — যেকোনো ক্লায়েন্ট প্রজেক্টে ব্যবহারযোগ্য।
