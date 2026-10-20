<?php

/*
|--------------------------------------------------------------------------
| Shop / White-Label Theme Configuration
|--------------------------------------------------------------------------
|
| This file holds ONLY structural / infrastructure values (domains, routes,
| admin bootstrap credentials). All *content* values — branding, contact
| details, colors, delivery charges, payment toggles — are stored in the
| `settings` table and editable from the admin panel.
|
| The values below act as fallbacks so a brand-new install still renders
| before the seeder runs. See database/seeders/SettingsSeeder.php.
|
*/

return [
    // --- Infrastructure ---------------------------------------------------
    'domain' => env('APP_DOMAIN', 'localhost'),
    'admin_domain' => env('ADMIN_DOMAIN', 'admin.localhost'),

    /*
    | When true the admin panel is also served from {APP_DOMAIN}/admin.
    | Useful when the hosting plan has no wildcard/extra subdomain
    | (e.g. free cPanel subdomains cannot create admin.* subdomains).
    */
    'admin_same_domain' => (bool) env('ADMIN_SAME_DOMAIN', false),

    // --- Branding fallbacks (overridden by settings table) ----------------
    'name' => env('SHOP_NAME', 'সুকুন হাট'),
    'tagline' => env('SHOP_TAGLINE', "পবিত্রতার আস্থায় প্রশান্তির বাজার\nস্মার্ট জীবন শুরু হোক এখান থেকেই!"),
    'subtagline' => env('SHOP_SUBTAGLINE', 'খাবার | গ্যাজেট | টেক — সব এক জায়গায়'),
    'address' => env('SHOP_ADDRESS', 'সানাড়পাড়, ডেমরা, ঢাকা, Dhaka, Bangladesh, 1360'),
    'phone' => env('SHOP_PHONE', '01568772054'),
    'phone_display' => env('SHOP_PHONE_DISPLAY', '01568-772054'),
    'whatsapp' => env('SHOP_WHATSAPP', '8801568772054'),
    'email' => env('SHOP_EMAIL', 'brandsukun@gmail.com'),
    'facebook' => env('SHOP_FACEBOOK', 'https://www.facebook.com/sukunhut1'),
    'messenger' => env('SHOP_MESSENGER', 'https://m.me/sukunhut1'),
    'logo' => env('SHOP_LOGO', null),
    'favicon' => env('SHOP_FAVICON', null),

    // --- Store fallbacks (overridden by settings table) -------------------
    'bkash' => env('SHOP_BKASH', '01568772054'),
    'nagad' => env('SHOP_NAGAD', '01568772054'),
    'delivery_in' => (int) env('DELIVERY_IN', 70),
    'delivery_out' => (int) env('DELIVERY_OUT', 120),
    'free_over' => (int) env('FREE_DELIVERY_OVER', 2000),
    'currency_symbol' => env('CURRENCY_SYMBOL', '৳'),

    'coupon_code' => env('COUPON_CODE', 'SUKUN10'),
    'coupon_percent' => (int) env('COUPON_PERCENT', 10),
    'fb_pixel' => env('FB_PIXEL_ID'),

    // --- Feature flags (plug & play modules) ------------------------------
    'features' => [
        'coupon' => (bool) env('FEATURE_COUPON', true),
        'variation' => (bool) env('FEATURE_VARIATION', true),
        'review' => (bool) env('FEATURE_REVIEW', false),
        'wishlist' => (bool) env('FEATURE_WISHLIST', false),
    ],

    // --- Admin bootstrap account ------------------------------------------
    'admin' => [
        'name' => env('ADMIN_NAME', 'Sukun Admin'),
        'email' => env('ADMIN_EMAIL', 'admin@sukunhut.test'),
        'password' => env('ADMIN_PASSWORD', 'ChangeMe-12345'),
    ],
];

