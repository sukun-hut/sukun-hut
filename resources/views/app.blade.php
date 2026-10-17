<!DOCTYPE html>
<html lang="bn">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
    @php($m = $meta ?? [])
    <title inertia>{{ $m['title'] ?? config('shop.name') }}</title>
    <link rel="icon" href="/favicon.ico" sizes="any">
    <link rel="icon" type="image/png" href="/favicon.png">
    <link rel="apple-touch-icon" href="/apple-touch-icon.png">
    @if (request()->getHost() === config('shop.admin_domain') || ! empty($m['noindex']))
        <meta name="robots" content="noindex,nofollow">
    @endif
    @if (! empty($m['description']))
        <meta name="description" content="{{ $m['description'] }}">
    @endif
    <meta property="og:site_name" content="{{ config('shop.name') }}">
    <meta property="og:type" content="{{ $m['type'] ?? 'website' }}">
    <meta property="og:title" content="{{ $m['title'] ?? config('shop.name') }}">
    <meta property="og:description" content="{{ $m['description'] ?? config('shop.subtagline') }}">
    <meta property="og:url" content="{{ $m['url'] ?? url()->current() }}">
    <meta property="og:image" content="{{ $m['image'] ?? url('/images/logo.jpg') }}">
    @if (isset($m['price']))
        <meta property="product:price:amount" content="{{ $m['price'] }}">
        <meta property="product:price:currency" content="BDT">
        <meta property="product:availability" content="{{ $m['availability'] ?? 'in stock' }}">
    @endif
    <meta name="twitter:card" content="summary_large_image">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Baloo+Da+2:wght@500;700;800&family=Hind+Siliguri:wght@400;500;600&display=swap" rel="stylesheet">
    @viteReactRefresh
    @vite('resources/js/app.jsx')
    @inertiaHead
    @if (config('shop.fb_pixel') && request()->getHost() !== config('shop.admin_domain'))
        <script>
            !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '{{ config('shop.fb_pixel') }}'); fbq('track', 'PageView');
        </script>
    @endif
</head>
<body>
    @inertia
</body>
</html>
