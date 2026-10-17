<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __invoke()
    {
        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'today' => Order::whereDate('created_at', today())->count(),
                'pending' => Order::where('status', 'pending')->count(),
                'sales' => (int) Order::whereIn('status', ['confirmed', 'completed'])->sum('total'),
                'products' => Product::count(),
                'out' => Product::where('in_stock', false)->count(),
            ],
            'recent' => Order::with('items')->latest('id')->limit(8)->get(),
        ]);
    }
}
