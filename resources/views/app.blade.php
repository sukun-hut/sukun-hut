<!DOCTYPE html>
<html lang="bn">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
    @php
        $m = $meta ?? [];
        $siteName = \App\Models\Setting::get('site_name', config('shop.name', 'Sukun Hut'));
        $siteTagline = \App\Models\Setting::get('site_tagline', config('shop.tagline', ''));
        $siteSubtagline = \App\Models\Setting::get('site_subtagline', config('shop.subtagline', ''));
        $siteLogo = \App\Models\Setting::get('site_logo');
        $logoUrl = $siteLogo ? (str_starts_with($siteLogo, 'http') ? $siteLogo : asset($siteLogo)) : url('/images/logo.jpg');
        $siteFavicon = \App\Models\Setting::get('site_favicon');
        $faviconUrl = $siteFavicon ? (str_starts_with($siteFavicon, 'http') ? $siteFavicon : asset($siteFavicon)) : '/favicon.ico';
        $priColor = \App\Models\Setting::get('primary_color', '#17463a');
        $accColor = \App\Models\Setting::get('secondary_color', '#e9a820');
        $currencySymbol = \App\Models\Setting::get('currency_symbol', config('shop.currency_symbol', '৳'));
        $fbPixel = \App\Models\Setting::get('fb_pixel', config('shop.fb_pixel'));
    @endphp
    <title inertia>{{ $m['title'] ?? $siteName }}</title>
    <link rel="icon" href="{{ $faviconUrl }}" sizes="any">
    @if($siteFavicon)
        <link rel="icon" type="image/png" href="{{ $faviconUrl }}">
        <link rel="apple-touch-icon" href="{{ $faviconUrl }}">
    @else
        <link rel="icon" type="image/png" href="/favicon.png">
        <link rel="apple-touch-icon" href="/apple-touch-icon.png">
    @endif
    @if (request()->getHost() === config('shop.admin_domain') || ! empty($m['noindex']))
        <meta name="robots" content="noindex,nofollow">
    @endif
    @if (! empty($m['description']))
        <meta name="description" content="{{ $m['description'] }}">
    @endif
    <meta property="og:site_name" content="{{ $siteName }}">
    <meta property="og:type" content="{{ $m['type'] ?? 'website' }}">
    <meta property="og:title" content="{{ $m['title'] ?? $siteName }}">
    <meta property="og:description" content="{{ $m['description'] ?? $siteSubtagline }}">
    <meta property="og:url" content="{{ $m['url'] ?? url()->current() }}">
    <meta property="og:image" content="{{ $m['image'] ?? $logoUrl }}">
    @if (isset($m['price']))
        <meta property="product:price:amount" content="{{ $m['price'] }}">
        <meta property="product:price:currency" content="BDT">
        <meta property="product:availability" content="{{ $m['availability'] ?? 'in stock' }}">
    @endif
    <meta name="twitter:card" content="summary_large_image">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Baloo+Da+2:wght@500;700;800&family=Hind+Siliguri:wght@400;500;600&display=swap" rel="stylesheet">

    <script>
        window.__CURRENCY_SYMBOL__ = @json($currencySymbol);
    </script>

    @viteReactRefresh
    @vite('resources/js/app.jsx')
    @inertiaHead

    <style id="dynamic-theme-vars">
        :root {
            --pri: {{ $priColor }} !important;
            --acc: {{ $accColor }} !important;
            --soft: {{ $priColor }}18 !important;
        }
        @keyframes toast-pop {
            0% { opacity: 0; transform: translateY(16px) scale(0.96); }
            100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes card-focus-pulse {
            0% { transform: scale(1.025); outline-color: var(--acc); box-shadow: 0 0 0 4px var(--acc); }
            50% { transform: scale(1.01); outline-color: var(--pri); box-shadow: 0 0 0 6px var(--pri); }
            100% { transform: scale(1); outline-color: transparent; box-shadow: none; }
        }
        .pc-highlighted {
            animation: card-focus-pulse 2.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            border-color: var(--acc) !important;
        }
    </style>
    @if ($fbPixel && request()->getHost() !== config('shop.admin_domain'))
        <script>
            !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '{{ $fbPixel }}'); fbq('track', 'PageView');
        </script>
    @endif
</head>
<body>
    <div id="net-error-flash" style="display:none;position:fixed;top:16px;left:50%;transform:translateX(-50%);background:#c0392b;color:#fff;padding:12px 22px;border-radius:12px;z-index:9999;font-weight:600;box-shadow:0 8px 24px rgba(0,0,0,.25);max-width:90vw;text-align:center">
        সংযোগে সমস্যা হয়েছে। পেজ রিফ্রেশ করে আবার চেষ্টা করুন।
    </div>
    @inertia
</body>
</html>
