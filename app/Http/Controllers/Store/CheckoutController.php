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
        'items.required' => 'কার্ট খালি',
        'items.min' => 'কার্ট খালি',
    ];

    public function create(Request $request)
    {
        $buy = null;
        if ($slug = $request->query('buy')) {
            $p = Product::active()->with(['category', 'images', 'variations'])->where('slug', $slug)->first();
            if ($p) {
                $buy = $p->forStore();
                if ($vId = $request->query('v')) {
                    $selectedVar = $p->variations->firstWhere('id', (int) $vId);
                    if ($selectedVar) {
                        $buy['selected_variation'] = [
                            'id' => $selectedVar->id,
                            'name' => $selectedVar->name,
                            'price' => $selectedVar->price,
                            'old_price' => $selectedVar->old_price,
                            'in_stock' => $selectedVar->in_stock,
                        ];
                    }
                }
            }
        }

        return Inertia::render('Store/Checkout', ['buy' => $buy])
            ->withViewData(['meta' => ['title' => 'চেকআউট – '.config('shop.name'), 'noindex' => true]]);
    }

    public function store(Request $request)
    {
        $allowed = [];
        if (\App\Models\Setting::getBool('payment_cod_enabled', true)) $allowed[] = 'cod';
        if (\App\Models\Setting::getBool('payment_bkash_enabled', true)) $allowed[] = 'bkash';
        if (\App\Models\Setting::getBool('payment_nagad_enabled', false)) $allowed[] = 'nagad';
        if (\App\Models\Setting::getBool('payment_sslcommerz_enabled', false)) $allowed[] = 'sslcommerz';
        if (empty($allowed)) $allowed = ['cod'];

        $rules = [
            'name' => 'required|string|min:3|max:100',
            'phone' => ['required', 'regex:/^01[3-9]\d{8}$/'],
            'address' => 'required|string|min:10|max:500',
            'zone' => 'required|in:in,out',
            'payment_method' => ['required', 'in:'.implode(',', $allowed)],
            'trx_id' => 'nullable|string|max:40',
            'coupon' => 'nullable|string|max:30',
            'items' => 'required|array|min:1|max:30',
            'items.*.id' => 'required|integer',
            'items.*.variation_id' => 'nullable|integer',
            'items.*.qty' => 'required|integer|min:1|max:20',
        ];

        if (in_array($request->input('payment_method'), ['bkash', 'nagad'])) {
            $rules['trx_id'] = 'required|string|min:4|max:40';
        }

        $d = $request->validate($rules, array_merge(self::MESSAGES, [
            'trx_id.required' => 'পেমেন্টের ট্রানজেকশন আইডি (TrxID) দিন',
        ]));

        $productIds = collect($d['items'])->pluck('id')->unique()->all();
        $products = Product::active()->with('variations')->whereIn('id', $productIds)->get()->keyBy('id');

        $preparedItems = [];
        $subtotal = 0;

        foreach ($d['items'] as $item) {
            $p = $products->get($item['id']);
            if (! $p || ! $p->in_stock) {
                throw ValidationException::withMessages(['items' => 'কিছু পণ্য এখন স্টকে নেই। কার্ট থেকে সরিয়ে আবার চেষ্টা করুন।']);
            }

            $variationId = ! empty($item['variation_id']) ? (int) $item['variation_id'] : null;
            $variationName = null;
            $price = $p->price;

            if ($variationId) {
                $var = $p->variations->firstWhere('id', $variationId);
                if (! $var || ! $var->in_stock) {
                    throw ValidationException::withMessages(['items' => 'নির্বাচিত ভেরিয়েশনটি বর্তমানে স্টকে নেই।']);
                }
                $variationName = $var->name;
                $price = $var->price;
            }

            $qty = min(20, max(1, (int) $item['qty']));
            $subtotal += $price * $qty;

            $preparedItems[] = [
                'product_id' => $p->id,
                'variation_id' => $variationId,
                'product_name' => $p->name,
                'variation_name' => $variationName,
                'price' => $price,
                'quantity' => $qty,
            ];
        }

        $fee = Shop::delivery($subtotal, $d['zone']);
        $discount = Shop::discount($subtotal, $d['coupon'] ?? null);

        $order = DB::transaction(function () use ($d, $preparedItems, $subtotal, $fee, $discount) {
            $order = Order::create([
                'number' => $this->number(),
                'token' => Str::random(24),
                'name' => $d['name'],
                'phone' => $d['phone'],
                'address' => $d['address'],
                'zone' => $d['zone'],
                'payment_method' => $d['payment_method'],
                'trx_id' => $d['trx_id'] ?? null,
                'subtotal' => $subtotal,
                'delivery_fee' => $fee,
                'discount' => $discount,
                'total' => $subtotal + $fee - $discount,
                'status' => 'pending',
            ]);

            foreach ($preparedItems as $pi) {
                $order->items()->create($pi);
            }

            return $order;
        });

        session()->flash('confirmed_order', [
            'number' => $order->number,
            'name' => $order->name,
            'phone' => $order->phone,
            'total' => $order->total,
            'token' => $order->token,
        ]);

        return redirect()->to("/order/{$order->token}");
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
            'items' => $order->items->map(fn ($i) => [
                'product_name' => $i->product_name,
                'variation_name' => $i->variation_name,
                'price' => $i->price,
                'quantity' => $i->quantity,
            ])->values(),
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
