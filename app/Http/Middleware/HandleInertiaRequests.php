<?php

namespace App\Http\Middleware;

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
        return array_merge(parent::share($request), [
            'shop' => fn () => collect(config('shop'))->only([
                'name', 'tagline', 'subtagline', 'address', 'phone', 'phone_display', 'whatsapp', 'email',
                'facebook', 'messenger', 'bkash', 'nagad', 'delivery_in', 'delivery_out', 'free_over', 'fb_pixel',
            ])->all(),
            'siteUrl' => config('app.url'),
            'auth' => ['user' => fn () => $request->user()?->only('id', 'name', 'email')],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
        ]);
    }
}
