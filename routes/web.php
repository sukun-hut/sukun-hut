<?php

use App\Http\Controllers\Admin;
use App\Http\Controllers\Store;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Admin panel: ONLY reachable on ADMIN_DOMAIN (e.g. admin.yourdomain.com)
|--------------------------------------------------------------------------
*/
Route::domain(config('shop.admin_domain'))->name('admin.')->group(function () {
    Route::get('/login', [Admin\AuthController::class, 'create'])->name('login');
    Route::post('/login', [Admin\AuthController::class, 'store'])->middleware('throttle:6,1')->name('login.store');

    Route::middleware('admin')->group(function () {
        Route::post('/logout', [Admin\AuthController::class, 'destroy'])->name('logout');
        Route::get('/', Admin\DashboardController::class)->name('dashboard');

        Route::resource('products', Admin\ProductController::class)->except('show');
        Route::patch('products/{product}/stock', [Admin\ProductController::class, 'stock'])->name('products.stock');
        Route::delete('products/{product}/images/{image}', [Admin\ProductController::class, 'destroyImage'])->name('products.images.destroy');
        Route::patch('products/{product}/images/{image}/main', [Admin\ProductController::class, 'mainImage'])->name('products.images.main');

        Route::resource('categories', Admin\CategoryController::class)->only(['index', 'store', 'update', 'destroy']);

        Route::get('orders', [Admin\OrderController::class, 'index'])->name('orders.index');
        Route::patch('orders/{order}/status', [Admin\OrderController::class, 'status'])->name('orders.status');
    });
});

/*
|--------------------------------------------------------------------------
| Public store: APP_DOMAIN (e.g. yourdomain.com)
|--------------------------------------------------------------------------
*/
Route::domain(config('shop.domain'))->group(function () {
    Route::get('/', [Store\HomeController::class, 'index'])->name('home');
    Route::get('/product/{product:slug}', [Store\ProductController::class, 'show'])->name('product');
    Route::get('/checkout', [Store\CheckoutController::class, 'create'])->name('checkout');
    Route::post('/checkout', [Store\CheckoutController::class, 'store'])->middleware('throttle:10,1')->name('checkout.store');
    Route::post('/coupon', [Store\CheckoutController::class, 'coupon'])->middleware('throttle:20,1')->name('coupon');
    Route::get('/order/{order:token}', [Store\CheckoutController::class, 'thanks'])->name('order.thanks');
});

/*
|--------------------------------------------------------------------------
| Admin panel on the SAME domain as the store (no subdomain setup needed).
| Enabled only when ADMIN_SAME_DOMAIN=true, so the subdomain routes above
| stay authoritative when a dedicated admin subdomain is configured.
|--------------------------------------------------------------------------
*/
if (config('shop.admin_same_domain')) {
    Route::domain(config('shop.domain'))->prefix('admin')->name('admin.')->group(function () {
        Route::get('/login', [Admin\AuthController::class, 'create'])->name('login');
        Route::post('/login', [Admin\AuthController::class, 'store'])->middleware('throttle:6,1')->name('login.store');

        Route::middleware('admin')->group(function () {
            Route::post('/logout', [Admin\AuthController::class, 'destroy'])->name('logout');
            Route::get('/', Admin\DashboardController::class)->name('dashboard');

            Route::resource('products', Admin\ProductController::class)->except('show');
            Route::patch('products/{product}/stock', [Admin\ProductController::class, 'stock'])->name('products.stock');
            Route::delete('products/{product}/images/{image}', [Admin\ProductController::class, 'destroyImage'])->name('products.images.destroy');
            Route::patch('products/{product}/images/{image}/main', [Admin\ProductController::class, 'mainImage'])->name('products.images.main');

            Route::resource('categories', Admin\CategoryController::class)->only(['index', 'store', 'update', 'destroy']);

            Route::get('orders', [Admin\OrderController::class, 'index'])->name('orders.index');
            Route::patch('orders/{order}/status', [Admin\OrderController::class, 'status'])->name('orders.status');
        });
    });
}
