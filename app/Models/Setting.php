<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    protected $guarded = [];

    public static function get(string $key, mixed $default = null): mixed
    {
        $setting = static::where('key', $key)->first();
        if (! $setting || $setting->value === null) {
            return $default;
        }

        return $setting->value;
    }

    public static function getInt(string $key, int $default = 0): int
    {
        $val = static::get($key, null);
        if ($val === null || $val === '') {
            return $default;
        }

        return (int) $val;
    }

    public static function set(string $key, mixed $value): void
    {
        static::updateOrCreate(['key' => $key], ['value' => (string) $value]);
    }

    public static function deliverySettings(): array
    {
        return [
            'delivery_in' => static::getInt('delivery_in', (int) config('shop.delivery_in', 70)),
            'delivery_out' => static::getInt('delivery_out', (int) config('shop.delivery_out', 120)),
            'free_over' => static::getInt('free_over', (int) config('shop.free_over', 2000)),
        ];
    }
}

