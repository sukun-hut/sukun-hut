<?php

namespace App\Support;

class Shop
{
    public static function delivery(int $subtotal, string $zone): int
    {
        $settings = \App\Models\Setting::deliverySettings();
        $free = $settings['free_over'];
        if ($subtotal <= 0 || ($free > 0 && $subtotal >= $free)) {
            return 0;
        }

        return $zone === 'out' ? $settings['delivery_out'] : $settings['delivery_in'];
    }

    public static function couponPercent(?string $code): int
    {
        $real = (string) config('shop.coupon_code');
        if ($real === '' || ! $code) {
            return 0;
        }

        return hash_equals(mb_strtoupper($real), mb_strtoupper(trim($code))) ? (int) config('shop.coupon_percent') : 0;
    }

    public static function discount(int $subtotal, ?string $code): int
    {
        return (int) round($subtotal * self::couponPercent($code) / 100);
    }
}
