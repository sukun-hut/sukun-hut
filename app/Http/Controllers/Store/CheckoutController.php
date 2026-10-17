<?php

namespace App\Http\Controllers\Store;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Support\Shop;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class CheckoutController extends Controller
{
    private const MESSAGES = [
        'name.required' => 'আপনার নাম লিখুন',
        'name.min' => 'নাম অন্তত ৩ অক্ষরের হতে হবে',
        'phone.required' => 'মোবাইল নম্বর দিন',
        'phone.regex' => 'সঠিক ১১ সংখ্যার মোবাইল নম্বর দিন (01XXXXXXXXX)',
        'address.required' => 'পূর্ণ ঠিকানা লিখুন',
        'address.min' => 'থানা ও জেলাসহ পূর্ণ ঠিকানা লিখুন',
        'trx_id.required_unless' => 'পেমেন্টের TrxID দিন',
        'trx_id.min' => 'TrxID সঠিক নয়',
        'items.required' => 'কার্ট খালি',
        'items.min' => 'কার্ট খালি',
    ];

    public function create(Request $request)
    {
        $buy = null;
        if ($slug = $request->query('buy')) {
            $p = Product::active()->with(['category', 'images'])->where('slug', $slug)->first();
            $buy = $p?->forStore();
        }

        return Inertia::render('Store/Checkout', ['buy' => $buy])
            ->withViewData(['meta' => ['title' => 'চেকআউট – '.config('shop.name'), 'noindex' => true]]);
    }

    public function store(Request $request)
    {
        $d = $request->validate([
            'name' => 'required|string|min:3|max:100',
            'phone' => ['required', 'regex:/^01[3-9]\d{8}$/'],
            'address' => 'required|string|min:10|max:500',
            'zone' => 'required|in:in,out',
            'payment_method' => 'required|in:cod,bkash,nagad',
            'trx_id' => 'required_unless:payment_method,cod|nullable|string|min:6|max:40',
            'coupon' => 'nullable|string|max:30',
            'items' => 'required|array|min:1|max:30',
            'items.*.id' => 'required|integer',
            'items.*.qty' => 'required|integer|min:1|max:20',
        ], self::MESSAGES);

        $qty = [];
        foreach ($d['items'] as $i) {
            $qty[$i['id']] = min(20, ($qty[$i['id']] ?? 0) + $i['qty']);
        }
        $products = Product::active()->whereIn('id', array_keys($qty))->get()->keyBy('id');

        $subtotal = 0;
        foreach ($qty as $id => $q) {
            $p = $products->get($id);
            if (! $p || ! $p->in_stock) {
                throw ValidationException::withMessages(['items' => 'কিছু পণ্য এখন স্টকে নেই। কার্ট থেকে সরিয়ে আবার চেষ্টা করুন।']);
            }
            $subtotal += $p->price * $q;
        }

        $fee = Shop::delivery($subtotal, $d['zone']);
        $discount = Shop::discount($subtotal, $d['coupon'] ?? null);

        $order = DB::transaction(function () use ($d, $qty, $products, $subtotal, $fee, $discount) {
            $order = Order::create([
                'number' => $this->number(),
                'token' => Str::random(24),
                'name' => $d['name'],
                'phone' => $d['phone'],
                'address' => $d['address'],
                'zone' => $d['zone'],
                'payment_method' => $d['payment_method'],
                'trx_id' => $d['payment_method'] === 'cod' ? null : ($d['trx_id'] ?? null),
                'subtotal' => $subtotal,
                'delivery_fee' => $fee,
                'discount' => $discount,
                'total' => $subtotal + $fee - $discount,
                'status' => 'pending',
            ]);
            foreach ($qty as $id => $q) {
                $order->items()->create([
                    'product_id' => $id,
                    'product_name' => $products[$id]->name,
                    'price' => $products[$id]->price,
                    'quantity' => $q,
                ]);
            }

            return $order;
        });

        return redirect()->route('order.thanks', $order->token);
    }

    public function coupon(Request $request)
    {
        $percent = Shop::couponPercent($request->input('code'));

        return response()->json(['valid' => $percent > 0, 'percent' => $percent]);
    }

    public function thanks(Order $order)
    {
        $order->load('items');

        return Inertia::render('Store/Thanks', ['order' => [
            'number' => $order->number,
            'name' => $order->name,
            'phone' => $order->phone,
            'address' => $order->address,
            'payment_method' => $order->payment_method,
            'trx_id' => $order->trx_id,
            'subtotal' => $order->subtotal,
            'delivery_fee' => $order->delivery_fee,
            'discount' => $order->discount,
            'total' => $order->total,
            'items' => $order->items->map->only('product_name', 'price', 'quantity')->values(),
        ]])->withViewData(['meta' => ['title' => 'অর্ডার সম্পন্ন – '.config('shop.name'), 'noindex' => true]]);
    }

    private function number(): string
    {
        do {
            $n = 'SH'.now()->format('ymd').random_int(1000, 9999);
        } while (Order::where('number', $n)->exists());

        return $n;
    }
}
