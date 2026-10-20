<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingsSeeder extends Seeder
{
    public function run(): void
    {
        $defaults = [
            // Branding & Identity
            ['key' => 'site_name', 'value' => config('shop.name', 'সুকুন হাট'), 'type' => 'text', 'group' => 'branding'],
            ['key' => 'site_tagline', 'value' => config('shop.tagline', "পবিত্রতার আস্থায় প্রশান্তির বাজার\nস্মার্ট জীবন শুরু হোক এখান থেকেই!"), 'type' => 'text', 'group' => 'branding'],
            ['key' => 'site_subtagline', 'value' => config('shop.subtagline', 'খাবার | গ্যাজেট | টেক — সব এক জায়গায়'), 'type' => 'text', 'group' => 'branding'],
            ['key' => 'site_email', 'value' => config('shop.email', 'brandsukun@gmail.com'), 'type' => 'text', 'group' => 'branding'],
            ['key' => 'site_phone', 'value' => config('shop.phone', '01568772054'), 'type' => 'text', 'group' => 'branding'],
            ['key' => 'site_phone_display', 'value' => config('shop.phone_display', '01568-772054'), 'type' => 'text', 'group' => 'branding'],
            ['key' => 'site_address', 'value' => config('shop.address', 'সানাড়পাড়, ডেমরা, ঢাকা, Bangladesh'), 'type' => 'text', 'group' => 'branding'],
            ['key' => 'facebook_url', 'value' => config('shop.facebook', 'https://www.facebook.com/sukunhut1'), 'type' => 'text', 'group' => 'branding'],
            ['key' => 'messenger_url', 'value' => config('shop.messenger', 'https://m.me/sukunhut1'), 'type' => 'text', 'group' => 'branding'],
            ['key' => 'whatsapp_number', 'value' => config('shop.whatsapp', '8801568772054'), 'type' => 'text', 'group' => 'branding'],
            ['key' => 'site_logo', 'value' => config('shop.logo', '/images/logo.jpg'), 'type' => 'image', 'group' => 'branding'],
            ['key' => 'site_favicon', 'value' => config('shop.favicon', '/favicon.png'), 'type' => 'image', 'group' => 'branding'],

            // Theme & CSS Variables
            ['key' => 'primary_color', 'value' => '#17463a', 'type' => 'color', 'group' => 'theme'],
            ['key' => 'secondary_color', 'value' => '#e9a820', 'type' => 'color', 'group' => 'theme'],
            ['key' => 'accent_color', 'value' => '#e2ece7', 'type' => 'color', 'group' => 'theme'],

            // Store & Shipping Rules
            ['key' => 'delivery_in', 'value' => (string) config('shop.delivery_in', 70), 'type' => 'number', 'group' => 'store'],
            ['key' => 'delivery_out', 'value' => (string) config('shop.delivery_out', 120), 'type' => 'number', 'group' => 'store'],
            ['key' => 'free_over', 'value' => (string) config('shop.free_over', 2000), 'type' => 'number', 'group' => 'store'],
            ['key' => 'currency_symbol', 'value' => config('shop.currency_symbol', '৳'), 'type' => 'text', 'group' => 'store'],
            ['key' => 'tax_rate', 'value' => '0', 'type' => 'number', 'group' => 'store'],
            ['key' => 'vat_rate', 'value' => '0', 'type' => 'number', 'group' => 'store'],
            ['key' => 'order_prefix', 'value' => config('shop.order_prefix', ''), 'type' => 'text', 'group' => 'store'],

            // Payment Gateways
            ['key' => 'payment_cod_enabled', 'value' => '1', 'type' => 'boolean', 'group' => 'payment'],
            ['key' => 'payment_bkash_enabled', 'value' => '1', 'type' => 'boolean', 'group' => 'payment'],
            ['key' => 'payment_nagad_enabled', 'value' => '0', 'type' => 'boolean', 'group' => 'payment'],
            ['key' => 'payment_sslcommerz_enabled', 'value' => '0', 'type' => 'boolean', 'group' => 'payment'],
            ['key' => 'bkash_number', 'value' => config('shop.bkash', '01568772054'), 'type' => 'text', 'group' => 'payment'],
            ['key' => 'nagad_number', 'value' => config('shop.nagad', '01568772054'), 'type' => 'text', 'group' => 'payment'],

            // Modular Features & Plugs
            ['key' => 'feature_coupon', 'value' => '1', 'type' => 'boolean', 'group' => 'features'],
            ['key' => 'coupon_code', 'value' => config('shop.coupon_code', 'SUKUN10'), 'type' => 'text', 'group' => 'features'],
            ['key' => 'coupon_percent', 'value' => (string) config('shop.coupon_percent', 10), 'type' => 'number', 'group' => 'features'],
            ['key' => 'feature_variation', 'value' => '1', 'type' => 'boolean', 'group' => 'features'],
            ['key' => 'feature_review', 'value' => '0', 'type' => 'boolean', 'group' => 'features'],
            ['key' => 'feature_wishlist', 'value' => '0', 'type' => 'boolean', 'group' => 'features'],

            // SEO & Tracking
            ['key' => 'fb_pixel', 'value' => config('shop.fb_pixel', ''), 'type' => 'text', 'group' => 'seo'],
        ];

        foreach ($defaults as $item) {
            Setting::updateOrCreate(
                ['key' => $item['key']],
                ['value' => $item['value'], 'type' => $item['type'], 'group' => $item['group']]
            );
        }
    }
}
