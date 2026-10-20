<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class Setting extends Model
{
    protected $guarded = [];

    protected static function boot()
    {
        parent::boot();

        // Clear cache when settings change
        static::saved(function () {
            Cache::forget('settings.all');
        });

        static::deleted(function () {
            Cache::forget('settings.all');
        });
    }

    /**
     * Get a setting value by key
     */
    public static function get(string $key, mixed $default = null): mixed
    {
        $setting = static::where('key', $key)->first();
        if (! $setting || $setting->value === null) {
            return $default;
    }

        return $setting->value;
    }

    /**
     * Get a setting value as integer
     */
    public static function getInt(string $key, int $default = 0): int
    {
        $val = static::get($key, null);
        if ($val === null || $val === '') {
            return $default;
        }

        return (int) $val;
    }

    /**
     * Get a setting value as boolean
     */
    public static function getBool(string $key, bool $default = false): bool
    {
        $val = static::get($key, null);
        if ($val === null || $val === '') {
            return $default;
        }

        return filter_var($val, FILTER_VALIDATE_BOOLEAN);
    }

    /**
     * Get a setting value as JSON decoded array
     */
    public static function getJson(string $key, array $default = []): array
    {
        $val = static::get($key, null);
        if ($val === null || $val === '') {
            return $default;
        }

        $decoded = json_decode($val, true);
        return is_array($decoded) ? $decoded : $default;
    }

    /**
     * Set a setting value
     */
    public static function set(string $key, mixed $value, string $type = 'text', string $group = 'general'): void
    {
        static::updateOrCreate(
            ['key' => $key],
            ['value' => is_array($value) ? json_encode($value) : (string) $value, 'type' => $type, 'group' => $group]
        );
    }

    /**
     * Set multiple settings at once
     */
    public static function setMany(array $settings, string $group = 'general'): void
    {
        foreach ($settings as $key => $value) {
            $type = is_bool($value) ? 'boolean' : (is_numeric($value) ? 'number' : (is_array($value) ? 'json' : 'text'));
            static::set($key, $value, $type, $group);
        }
    }

    /**
     * Get all settings grouped by category
     */
    public static function getAll(): array
    {
        return Cache::remember('settings.all', 3600, function () {
            return static::all()->groupBy('group')->map(function ($items) {
                return $items->pluck('value', 'key');
            })->toArray();
        });
    }

    /**
     * Get settings by group
     */
    public static function getGroup(string $group): array
    {
        return static::where('group', $group)->pluck('value', 'key')->toArray();
    }

    /**
     * Get delivery settings (backward compatibility)
     */
    public static function deliverySettings(): array
    {
        return [
            'delivery_in' => static::getInt('delivery_in', (int) config('shop.delivery_in', 70)),
            'delivery_out' => static::getInt('delivery_out', (int) config('shop.delivery_out', 120)),
            'free_over' => static::getInt('free_over', (int) config('shop.free_over', 2000)),
        ];
    }

    /**
     * Get branding settings
     */
    public static function brandingSettings(): array
    {
        return [
            'site_name' => static::get('site_name', config('shop.name', 'My Shop')),
            'site_tagline' => static::get('site_tagline', config('shop.tagline', '')),
            'site_logo' => static::get('site_logo', null),
            'site_favicon' => static::get('site_favicon', null),
            'site_email' => static::get('site_email', config('shop.email', 'info@example.com')),
            'site_phone' => static::get('site_phone', config('shop.phone', '')),
            'site_address' => static::get('site_address', config('shop.address', '')),
            'facebook_url' => static::get('facebook_url', config('shop.facebook', '')),
            'whatsapp_number' => static::get('whatsapp_number', config('shop.whatsapp', '')),
        ];
    }

    /**
     * Get theme settings
     */
    public static function themeSettings(): array
    {
        return [
            'primary_color' => static::get('primary_color', '#10b981'),
            'secondary_color' => static::get('secondary_color', '#3b82f6'),
            'accent_color' => static::get('accent_color', '#f59e0b'),
        ];
    }

    /**
     * Get payment gateway settings
     */
    public static function paymentSettings(): array
    {
        return [
            'payment_cod_enabled' => static::getBool('payment_cod_enabled', true),
            'payment_bkash_enabled' => static::getBool('payment_bkash_enabled', true),
            'payment_nagad_enabled' => static::getBool('payment_nagad_enabled', false),
            'payment_sslcommerz_enabled' => static::getBool('payment_sslcommerz_enabled', false),
            'bkash_number' => static::get('bkash_number', config('shop.bkash', '')),
            'nagad_number' => static::get('nagad_number', config('shop.nagad', '')),
        ];
    }

    /**
     * Get store settings
     */
    public static function storeSettings(): array
    {
        return array_merge(
            static::deliverySettings(),
            [
              'currency_symbol' => static::get('currency_symbol', '৳'),
                'tax_rate' => static::getInt('tax_rate', 0),
                'vat_rate' => static::getInt('vat_rate', 0),
            ]
        );
    }
}

