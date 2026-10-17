<?php

return [
    'name' => env('SHOP_NAME', 'সুকুন হাট'),
    'domain' => env('APP_DOMAIN', 'localhost'),
    'admin_domain' => env('ADMIN_DOMAIN', 'admin.localhost'),

    /*
    | When true the admin panel is also served from {APP_DOMAIN}/admin.
    | Useful when the hosting plan has no wildcard/extra subdomain
    | (e.g. free cPanel subdomains cannot create admin.* subdomains).
    */
    'admin_same_domain' => (bool) env('ADMIN_SAME_DOMAIN', false),
    'tagline' => "পবিত্রতার আস্থায় প্রশান্তির বাজার\nস্মার্ট জীবন শুরু হোক এখান থেকেই!",
    'subtagline' => 'খাবার | গ্যাজেট | টেক — সব এক জায়গায়',
    'address' => 'সানাড়পাড়, ডেমরা, ঢাকা, Dhaka, Bangladesh, 1360',
    'phone' => env('SHOP_PHONE', '01568772054'),
    'phone_display' => '01568-772054',
    'whatsapp' => env('SHOP_WHATSAPP', '8801568772054'),
    'email' => 'brandsukun@gmail.com',
    'facebook' => 'https://www.facebook.com/sukunhut1',
    'messenger' => 'https://m.me/sukunhut1',
    'bkash' => env('SHOP_BKASH', '01568772054'),
    'nagad' => env('SHOP_NAGAD', '01568772054'),
    'delivery_in' => (int) env('DELIVERY_IN', 70),
    'delivery_out' => (int) env('DELIVERY_OUT', 120),
    'free_over' => (int) env('FREE_DELIVERY_OVER', 2000),
    'coupon_code' => env('COUPON_CODE', ''),
    'coupon_percent' => (int) env('COUPON_PERCENT', 10),
    'fb_pixel' => env('FB_PIXEL_ID'),
    'admin' => [
        'name' => env('ADMIN_NAME', 'Sukun Admin'),
        'email' => env('ADMIN_EMAIL', 'admin@sukunhut.test'),
        'password' => env('ADMIN_PASSWORD', 'ChangeMe-12345'),
    ],
];
