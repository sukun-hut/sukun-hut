<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Order;
use App\Models\Product;
use App\Models\Setting;
use Database\Seeders\DemoDataSeeder;
use Database\Seeders\SettingsSeeder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Inertia\Inertia;

class SettingController extends Controller
{
    public function index()
    {
        $siteLogo = Setting::get('site_logo');
        $siteFavicon = Setting::get('site_favicon');

        // Flat settings payload — keys align 1:1 with the Admin Settings form (Inertia form data)
        $settings = [
            // Branding
            'site_name' => Setting::get('site_name', config('shop.name', 'My Shop')),
            'tagline' => Setting::get('site_tagline', config('shop.tagline', '')),
            'subtagline' => Setting::get('site_subtagline', config('shop.subtagline', '')),
            'email' => Setting::get('site_email', config('shop.email', '')),
            'phone' => Setting::get('site_phone', config('shop.phone', '')),
            'phone_display' => Setting::get('site_phone_display', config('shop.phone_display', config('shop.phone', ''))),
            'address' => Setting::get('site_address', config('shop.address', '')),
            'facebook' => Setting::get('facebook_url', config('shop.facebook', '')),
            'messenger' => Setting::get('messenger_url', config('shop.messenger', '')),
            'whatsapp' => Setting::get('whatsapp_number', config('shop.whatsapp', '')),
            'logo_path' => $siteLogo,
            'favicon_path' => $siteFavicon,

            // Theme
            'primary_color' => Setting::get('primary_color', '#17463a'),
            'secondary_color' => Setting::get('secondary_color', '#e9a820'),
            'currency_symbol' => Setting::get('currency_symbol', config('shop.currency_symbol', '৳')),

            // Store & delivery rules
            'delivery_in' => Setting::getInt('delivery_in', (int) config('shop.delivery_in', 70)),
            'delivery_out' => Setting::getInt('delivery_out', (int) config('shop.delivery_out', 120)),
            'free_over' => Setting::getInt('free_over', (int) config('shop.free_over', 2000)),
            'tax_percent' => Setting::getInt('tax_rate', 0),
            'order_prefix' => Setting::get('order_prefix', config('shop.order_prefix', '')),

            // Payment gateways
            'payment_cod_enabled' => Setting::getBool('payment_cod_enabled', true),
            'payment_bkash_enabled' => Setting::getBool('payment_bkash_enabled', true),
            'payment_nagad_enabled' => Setting::getBool('payment_nagad_enabled', false),
            'payment_sslcommerz_enabled' => Setting::getBool('payment_sslcommerz_enabled', false),
            'bkash_number' => Setting::get('bkash_number', config('shop.bkash', '')),
            'nagad_number' => Setting::get('nagad_number', config('shop.nagad', '')),

            // Feature modules (plug-and-play toggles)
            'feature_coupons' => Setting::getBool('feature_coupon', config('shop.features.coupon', true)),
            'coupon_code' => Setting::get('coupon_code', config('shop.coupon_code', 'SUKUN10')),
            'coupon_percent' => Setting::getInt('coupon_percent', (int) config('shop.coupon_percent', 10)),
            'feature_variations' => Setting::getBool('feature_variation', config('shop.features.variation', true)),
            'feature_reviews' => Setting::getBool('feature_review', config('shop.features.review', false)),
            'feature_wishlist' => Setting::getBool('feature_wishlist', config('shop.features.wishlist', false)),

            // Misc
            'fb_pixel' => Setting::get('fb_pixel', config('shop.fb_pixel')),
        ];

        $stats = [
            'total_products' => Product::count(),
            'total_categories' => Category::count(),
            'total_orders' => Order::count(),
        ];

        return Inertia::render('Admin/Settings/Index', [
            'settings' => $settings,
            'stats' => $stats,
        ]);
    }

    public function update(Request $request)
    {
        /*
         * White-label settings updater.
         * Frontend sends a flat key => value payload; each key is mapped to its
         * DB setting key, storage type and group. Add a new row here to expose
         * a new setting — the UI picks it up automatically.
         */
        $request->validate([
            'site_name' => 'nullable|string|max:100',
            'tagline' => 'nullable|string|max:500',
            'subtagline' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:100',
            'phone' => 'nullable|string|max:30',
            'phone_display' => 'nullable|string|max:30',
            'address' => 'nullable|string|max:255',
            'facebook' => 'nullable|string|max:255',
            'messenger' => 'nullable|string|max:255',
            'whatsapp' => 'nullable|string|max:30',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp|max:3072',
            'favicon' => 'nullable|mimetypes:image/png,image/jpeg,image/x-icon,image/vnd.microsoft.icon,image/svg+xml|nullable|max:1024',
            'fb_pixel' => 'nullable|string|max:50',

            'primary_color' => ['nullable', 'regex:/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/'],
            'secondary_color' => ['nullable', 'regex:/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/'],
            'currency_symbol' => 'nullable|string|max:10',

            'delivery_in' => 'nullable|integer|min:0|max:100000',
            'delivery_out' => 'nullable|integer|min:0|max:100000',
            'free_over' => 'nullable|integer|min:0|max:1000000',
            'tax_percent' => 'nullable|numeric|min:0|max:100',
            'order_prefix' => 'nullable|string|max:10',

            'payment_cod_enabled' => 'nullable|boolean',
            'payment_bkash_enabled' => 'nullable|boolean',
            'payment_nagad_enabled' => 'nullable|boolean',
            'payment_sslcommerz_enabled' => 'nullable|boolean',
            'bkash_number' => 'nullable|string|max:30',
            'nagad_number' => 'nullable|string|max:30',

            'feature_coupons' => 'nullable|boolean',
            'coupon_code' => 'nullable|string|max:30',
            'coupon_percent' => 'nullable|integer|min:0|max:100',
            'feature_variations' => 'nullable|boolean',
            'feature_reviews' => 'nullable|boolean',
            'feature_wishlist' => 'nullable|boolean',
        ]);

        $map = [
            // key            => [db_key,             type,      group]
            'site_name' => ['site_name', 'text', 'branding'],
            'tagline' => ['site_tagline', 'text', 'branding'],
            'subtagline' => ['site_subtagline', 'text', 'branding'],
            'email' => ['site_email', 'text', 'branding'],
            'phone' => ['site_phone', 'text', 'branding'],
            'phone_display' => ['site_phone_display', 'text', 'branding'],
            'address' => ['site_address', 'text', 'branding'],
            'facebook' => ['facebook_url', 'text', 'branding'],
            'messenger' => ['messenger_url', 'text', 'branding'],
            'whatsapp' => ['whatsapp_number', 'text', 'branding'],
            'fb_pixel' => ['fb_pixel', 'text', 'branding'],

            'primary_color' => ['primary_color', 'color', 'theme'],
            'secondary_color' => ['secondary_color', 'color', 'theme'],
            'currency_symbol' => ['currency_symbol', 'text', 'theme'],

            'delivery_in' => ['delivery_in', 'number', 'store'],
            'delivery_out' => ['delivery_out', 'number', 'store'],
            'free_over' => ['free_over', 'number', 'store'],
            'tax_percent' => ['tax_rate', 'number', 'store'],
            'order_prefix' => ['order_prefix', 'text', 'store'],

            'payment_cod_enabled' => ['payment_cod_enabled', 'boolean', 'payment'],
            'payment_bkash_enabled' => ['payment_bkash_enabled', 'boolean', 'payment'],
            'payment_nagad_enabled' => ['payment_nagad_enabled', 'boolean', 'payment'],
            'payment_sslcommerz_enabled' => ['payment_sslcommerz_enabled', 'boolean', 'payment'],
            'bkash_number' => ['bkash_number', 'text', 'payment'],
            'nagad_number' => ['nagad_number', 'text', 'payment'],

            'feature_coupons' => ['feature_coupon', 'boolean', 'features'],
            'coupon_code' => ['coupon_code', 'text', 'features'],
            'coupon_percent' => ['coupon_percent', 'number', 'features'],
            'feature_variations' => ['feature_variation', 'boolean', 'features'],
            'feature_reviews' => ['feature_review', 'boolean', 'features'],
            'feature_wishlist' => ['feature_wishlist', 'boolean', 'features'],
        ];

        foreach ($map as $inputKey => [$dbKey, $type, $group]) {
            if ($request->has($inputKey) || ($type === 'boolean' && $request->exists($inputKey))) {
                $value = match ($type) {
                    'number' => (int) $request->input($inputKey, 0),
                    'boolean' => $request->boolean($inputKey) ? '1' : '0',
                    default => (string) $request->input($inputKey),
                };
                Setting::set($dbKey, $value, $type, $group);
            }
        }

        // Boolean checkboxes: unchecked checkboxes aren't sent, so explicit
        // "0" values are also accepted from the form (form helper sends 0/1).
        foreach (['payment_cod_enabled', 'payment_bkash_enabled', 'payment_nagad_enabled', 'payment_sslcommerz_enabled', 'feature_coupons', 'feature_variations', 'feature_reviews', 'feature_wishlist'] as $bKey) {
            if ($request->exists($bKey) && ! $request->boolean($bKey)) {
                [$dbKey, , $group] = $map[$bKey];
                Setting::set($dbKey, '0', 'boolean', $group);
            }
        }

        // File uploads (logo / favicon)
        if ($request->hasFile('logo')) {
            $path = $request->file('logo')->store('branding', 'public');
            Setting::set('site_logo', 'storage/' . $path, 'image', 'branding');
        }
        if ($request->hasFile('favicon')) {
            $path = $request->file('favicon')->store('branding', 'public');
            Setting::set('site_favicon', 'storage/' . $path, 'image', 'branding');
        }

        return back()->with('success', 'সেটিংস সফলভাবে সংরক্ষিত হয়েছে।');
    }

    /**
     * Reset Demo Data / Seed Default Catalog
     */
    public function resetDemo(Request $request)
    {
        Artisan::call('db:seed', ['--class' => SettingsSeeder::class, '--force' => true]);
        Artisan::call('db:seed', ['--class' => DemoDataSeeder::class, '--force' => true]);

        return back()->with('success', 'ডিফল্ট ডেমো ডাটা এবং সেটিংস সফলভাবে রিস্টোর করা হয়েছে।');
    }

    /**
     * Clear orders or demo products for client handover
     */
    public function clearData(Request $request)
    {
        $type = $request->input('type');

        if ($type === 'orders') {
            Order::truncate();
            return back()->with('success', 'সকল টেস্ট অর্ডার মুছে ফেলা হয়েছে।');
        }

        if ($type === 'catalog') {
            Product::query()->delete();
            Category::query()->delete();
            return back()->with('success', 'সকল পণ্য ও ক্যাটাগরি মুছে ফেলা হয়েছে। ক্লায়েন্টের নিজস্ব পণ্য যোগ করতে পারেন।');
        }

        if ($type === 'all') {
            Order::truncate();
            Product::query()->delete();
            Category::query()->delete();
            return back()->with('success', 'স্টোর সম্পূর্ণ ফাঁকা করা হয়েছে (ক্লিন হ্যান্ডওভার মোড)।');
        }

        return back()->with('error', 'অবৈধ অ্যাকশন অনুরোধ।');
    }
}


