<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $status = $request->query('status');
        $q = trim((string) $request->query('q'));
        $like = '%'.str_replace(['%', '_'], ['\%', '\_'], $q).'%';

        $orders = Order::with('items')
            ->when(in_array($status, Order::STATUSES), fn ($b) => $b->where('status', $status))
            ->when($q !== '', fn ($b) => $b->where(fn ($w) => $w
                ->where('number', 'like', $like)->orWhere('phone', 'like', $like)->orWhere('name', 'like', $like)))
            ->latest('id')->paginate(20)->withQueryString();

        return Inertia::render('Admin/Orders/Index', [
            'orders' => $orders,
            'counts' => Order::selectRaw('status, count(*) as c')->groupBy('status')->pluck('c', 'status'),
            'filters' => ['status' => $status ?: null, 'q' => $q ?: null],
        ]);
    }

    public function status(Request $request, Order $order)
    {
        $d = $request->validate(['status' => 'required|in:'.implode(',', Order::STATUSES)]);
        $order->update($d);

        return back()->with('success', 'অর্ডারের স্ট্যাটাস বদলেছে');
    }
}
