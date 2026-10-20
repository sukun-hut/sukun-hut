<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Store Configuration
    |----------------------------------------------------------------------
    |
    | Store-specific settings including delivery, payment, and currency options.
    | These can be dynamically managed from the admin panel.
    |
    */

    // Currency
    'currency_symbol' => env('CURRENCY_SYMBOL', '৳'),
    'currency_code' => env('CURRENCY_CODE', 'BDT'),
    'currency_position' => env('CURRENCY_POSITION', 'after'), // before or after
    
    // Delivery Charges
    'delivery_in' => (int) env('DELIVERY_IN', 70),
    'delivery_out' => (int) env('DELIVERY_OUT', 120),
    'free_over' => (int) env('FREE_DELIVERY_OVER', 2000),
    
    // Tax & VAT
    'tax_rate' => (float) env('TAX_RATE', 0),
    'vat_rate' => (float) env('VAT_RATE', 0),
    'tax_label' => env('TAX_LABEL', 'Tax'),
    'vat_label' => env('VAT_LABEL', 'VAT'),
    
    // Payment Methods
    'payment_cod_enabled' => (bool) env('PAYMENT_COD_ENABLED', true),
    'payment_bkash_enabled' => (bool) env('PAYMENT_BKASH_ENABLED', true),
    'payment_nagad_enabled' => (bool) env('PAYMENT_NAGAD_ENABLED', false),
    'payment_sslcommerz_enabled' => (bool) env('PAYMENT_SSLCOMMERZ_ENABLED', false),
    
    // Payment Gateway Details
    'bkash_number' => env('SHOP_BKASH', env('SHOP_PHONE', '')),
    'nagad_number' => env('SHOP_NAGAD', env('SHOP_PHONE', '')),
    'sslcommerz_store_id' => env('SSLCOMMERZ_STORE_ID', ''),
    'sslcommerz_store_password' => env('SSLCOMMERZ_STORE_PASSWORD', ''),
    'sslcommerz_mode' => env('SSLCOMMERZ_MODE', 'sandbox'), // sandbox or live
    
    // Coupon System
    'coupon_enabled' => !empty(env('COUPON_CODE')),
    'coupon_code' => env('COUPON_CODE', ''),
    'coupon_percent' => (int) env('COUPON_PERCENT', 10),
    'coupon_min_order' => (int) env('COUPON_MIN_ORDER', 0),
    
    // Order Settings
    'order_prefix' => env('ORDER_PREFIX', 'ORD'),
    'min_order_amount' => (int) env('MIN_ORDER_AMOUNT', 0),
    'max_order_items' => (int) env('MAX_ORDER_ITEMS', 50),
    
    // Stock Management
    'track_inventory' => (bool) env('TRACK_INVENTORY', true),
    'allow_backorders' => (bool) env('ALLOW_BACKORDERS', false),
    'low_stock_threshold' => (int) env('LOW_STOCK_THRESHOLD', 5),
];
