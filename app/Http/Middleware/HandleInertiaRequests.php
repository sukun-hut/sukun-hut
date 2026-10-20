<?php

namespace App\Http\Middleware;

use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        $siteLogo = Setting::get('site_logo');
        $logoUrl = $siteLogo ? (str_starts_with($siteLogo, 'http') ? $siteLogo : asset($siteLogo)) : (config('shop.logo') ? asset(config('shop.logo')) : '/images/logo.jpg');

        $siteFavicon = Setting::get('site_favicon');
        $faviconUrl = $siteFavicon ? (str_starts_with($siteFavicon, 'http') ? $siteFavicon : asset($siteFavicon)) : '/favicon.ico';

        return array_merge(parent::share($request), [
            'shop' => fn () => [
                'name' => Setting::get('site_name', config('shop.name', 'Sukun Hut')),
                'tagline' => Setting::get('site_tagline', config('shop.tagline', '')),
                'subtagline' => Setting::get('site_subtagline', config('shop.subtagline', '')),
                'address' => Setting::get('site_address', config('shop.address', '')),
                'phone' => Setting::get('site_phone', config('shop.phone', '')),
                'phone_display' => Setting::get('site_phone_display', config('shop.phone_display', config('shop.phone', ''))),
                'whatsapp' => Setting::get('whatsapp_number', config('shop.whatsapp', '')),
                'email' => Setting::get('site_email', config('shop.email', '')),
                'facebook' => Setting::get('facebook_url', config('shop.facebook', '')),
                'messenger' => Setting::get('messenger_url', config('shop.messenger', '')),
                'logo' => $logoUrl,
                'favicon' => $faviconUrl,

                // Theme Colors
                'primary_color' => Setting::get('primary_color', '#17463a'),
                'secondary_color' => Setting::get('secondary_color', '#e9a820'),
                'accent_color' => Setting::get('accent_color', '#e2ece7'),

                // Delivery & Store rules
                'delivery_in' => Setting::getInt('delivery_in', (int) config('shop.delivery_in', 70)),
                'delivery_out' => Setting::getInt('delivery_out', (int) config('shop.delivery_out', 120)),
                'free_over' => Setting::getInt('free_over', (int) config('shop.free_over', 2000)),
                'currency_symbol' => Setting::get('currency_symbol', config('shop.currency_symbol', '৳')),
                'tax_rate' => Setting::getInt('tax_rate', 0),
                'vat_rate' => Setting::getInt('vat_rate', 0),

                // Payment Gateways
                'payment_cod_enabled' => Setting::getBool('payment_cod_enabled', true),
                'payment_bkash_enabled' => Setting::getBool('payment_bkash_enabled', true),
                'payment_nagad_enabled' => Setting::getBool('payment_nagad_enabled', false),
                'payment_sslcommerz_enabled' => Setting::getBool('payment_sslcommerz_enabled', false),
                'bkash_number' => Setting::get('bkash_number', config('shop.bkash', '')),
                'nagad_number' => Setting::get('nagad_number', config('shop.nagad', '')),

                // Feature flags (Modular)
                'features' => [
                    'coupon' => Setting::getBool('feature_coupon', config('shop.features.coupon', true)),
                    'variation' => Setting::getBool('feature_variation', config('shop.features.variation', true)),
                    'review' => Setting::getBool('feature_review', config('shop.features.review', false)),
                    'blog' => Setting::getBool('feature_blog', config('shop.features.blog', false)),
                    'wishlist' => Setting::getBool('feature_wishlist', config('shop.features.wishlist', false)),
                ],

                'fb_pixel' => Setting::get('fb_pixel', config('shop.fb_pixel')),
            ],
            'siteUrl' => config('app.url'),
            'auth' => ['user' => fn () => $request->user()?->only('id', 'name', 'email')],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
        ]);
    }
}
