<?php

return [
    /*
    |---------------------------------------------------------------------
    | White-Label Branding Configuration
    |--------------------------------------------------------------------------
    |
    | These are the default branding values. They can be overridden from the
    | admin panel. Use Setting model to get dynamic values.
    |
    */

    'site_name' => env('SITE_NAME', env('APP_NAME', 'My Shop')),
    'site_tagline' => env('SITE_TAGLINE', 'Your trusted online store'),
    'site_description' => env('SITE_DESCRIPTION', 'Quality products at affordable prices'),
    'site_logo' => env('SITE_LOGO', null),
    'site_favicon' => env('SITE_FAVICON', null),
    
    // Contact Information
    'email' => env('SITE_EMAIL', env('SHOP_EMAIL', 'info@example.com')),
    'phone' => env('SITE_PHONE', env('SHOP_PHONE', '')),
    'phone_display' => env('SITE_PHONE_DISPLAY', env('SHOP_PHONE', '')),
    'address' => env('SITE_ADDRESS', ''),
    
    // Social Media
    'facebook' => env('FACEBOOK_URL', ''),
    'instagram' => env('INSTAGRAM_URL', ''),
    'twitter' => env('TWITTER_URL', ''),
    'youtube' => env('YOUTUBE_URL', ''),
    'whatsapp' => env('WHATSAPP_NUMBER', ''),
    'messenger' => env('MESSENGER_URL', ''),
    
    // Theme Colors
    'primary_color' => env('PRIMARY_COLOR', '#10b981'),
    'secondary_color' => env('SECONDARY_COLOR', '#3b82f6'),
    'accent_color' => env('ACCENT_COLOR', '#f59e0b'),
    
    // SEO & Analytics
    'meta_keywords' => env('META_KEYWORDS', ''),
    'google_analytics_id' => env('GOOGLE_ANALYTICS_ID', ''),
    'facebook_pixel_id' => env('FB_PIXEL_ID', ''),
];
