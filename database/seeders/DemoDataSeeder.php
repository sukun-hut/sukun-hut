<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Order;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductVariation;
use App\Support\Slug;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DemoDataSeeder extends Seeder
{
    public function run(): void
    {
        $cats = [];
        $categoriesData = [
            ['name' => 'খাবার', 'position' => 1],
            ['name' => 'গ্যাজেট', 'position' => 2],
            ['name' => 'টেক', 'position' => 3],
        ];

        foreach ($categoriesData as $catData) {
            $cats[$catData['name']] = Category::firstOrCreate(
                ['name' => $catData['name']],
                ['slug' => Slug::make($catData['name'], 'categories'), 'position' => $catData['position']]
            );
        }

        // Demo products with variations
        $rows = [
            [
                'cat' => 'খাবার',
                'name' => 'সুন্দরবনের খাঁটি মধু',
                'price' => 650,
                'old' => 750,
                'desc' => 'সুন্দরবনের প্রাকৃতিক চাক ভাঙা খাঁটি মধু। কোনো প্রকার চিনি বা কৃত্রিম উপাদান মুক্ত। স্বাস্থ্য সুরক্ষায় অনন্য।',
                'stock' => true,
                'emoji' => '🍯',
                'variations' => [
                    ['name' => '৫০০ গ্রাম', 'price' => 650, 'old_price' => 750, 'in_stock' => true, 'position' => 1],
                    ['name' => '১ কেজি', 'price' => 1250, 'old_price' => 1400, 'in_stock' => true, 'position' => 2],
                ]
            ],
            [
                'cat' => 'খাবার',
                'name' => 'ঘানি ভাঙা সরিষার তেল (১ লি.)',
                'price' => 320,
                'old' => 380,
                'desc' => 'ঐতিহ্যবাহী কাঠের ঘানিতে ভাঙানো প্রথম চাপের ঝাঁঝালো সরিষার তেল। খাঁটি স্বাদ ও সুঘ্রাণ।',
                'stock' => true,
                'emoji' => '🫙',
                'variations' => []
            ],
            [
                'cat' => 'খাবার',
                'name' => 'প্রিমিয়াম নাট ও খেজুর বক্স',
                'price' => 890,
                'old' => 990,
                'desc' => 'কাজু বাদাম, পেস্তা, কাঠবাদাম, কিশমিশ এবং প্রিমিয়াম আজওয়া খেজুরের স্বাস্থ্যকর কম্বো।',
                'stock' => true,
                'emoji' => '🌰',
                'variations' => []
            ],
            [
                'cat' => 'গ্যাজেট',
                'name' => 'ব্লুটুথ ওয়্যারলেস ইয়ারবাড',
                'price' => 1190,
                'old' => 1490,
                'desc' => 'ক্রিস্টাল ক্লিয়ার সাউন্ড, ডিপ ব্যাস, এবং টাইপ-সি ফাস্ট চার্জিং। দীর্ঘ ব্যাটারি ব্যাকআপ।',
                'stock' => true,
                'emoji' => '🎧',
                'variations' => [
                    ['name' => 'কালো (Black)', 'price' => 1190, 'old_price' => 1490, 'in_stock' => true, 'position' => 1],
                    ['name' => 'সাদা (White)', 'price' => 1190, 'old_price' => 1490, 'in_stock' => true, 'position' => 2],
                ]
            ],
            [
                'cat' => 'গ্যাজেট',
                'name' => 'স্মার্ট ফিটনেস ওয়াচ',
                'price' => 1990,
                'old' => 2490,
                'desc' => 'ব্লুটুথ কলিং, হার্ট রেট মনিটর, স্লিপ ট্র্যাকিং এবং দীর্ঘস্থায়ী ব্যাটারি ব্যাকআপ।',
                'stock' => true,
                'emoji' => '⌚',
                'variations' => []
            ],
            [
                'cat' => 'গ্যাজেট',
                'name' => 'অ্যালুমিনিয়াম ডেস্ক ফোন স্ট্যান্ড',
                'price' => 290,
                'old' => null,
                'desc' => 'মজবুত মেটাল বডি, ৩৬০ ডিগ্রি রোটেটেবল এবং সব সাইজের ফোন ও ট্যাবলেটের উপযোগী।',
                'stock' => true,
                'emoji' => '📱',
                'variations' => []
            ],
            [
                'cat' => 'টেক',
                'name' => 'পাওয়ার ব্যাংক ১০০০০ mAh ফাস্ট চার্জ',
                'price' => 1250,
                'old' => 1450,
                'desc' => '22.5W ফাস্ট চার্জিং সমর্থন। টাইপ-সি এবং ইউএসবি ডুয়াল আউটপুট সহ স্লিম ডিজাইন।',
                'stock' => true,
                'emoji' => '🔋',
                'variations' => []
            ],
            [
                'cat' => 'টেক',
                'name' => 'ফাস্ট চার্জার ও ব্রেইডেড ক্যাবল সেট',
                'price' => 690,
                'old' => null,
                'desc' => 'দ্রুত চার্জিং এডাপ্টার এবং ১০০ সেমি শক্তিশালী ব্রেইডেড টাইপ-সি ক্যাবল।',
                'stock' => true,
                'emoji' => '🔌',
                'variations' => []
            ],
            [
                'cat' => 'টেক',
                'name' => 'রিচার্জেবল সাইলেন্ট ওয়্যারলেস মাউস',
                'price' => 590,
                'old' => 690,
                'desc' => 'ক্লিক সাউন্ড নেই, ইউএসবি রিচার্জেবল এবং ল্যাপটপ/পিসির সাথে সহজে কানেক্টেবল।',
                'stock' => true,
                'emoji' => '🖱️',
                'variations' => []
            ],
        ];

        foreach ($rows as $item) {
            $cat = $cats[$item['cat']] ?? null;
            if (! $cat) continue;

            $product = Product::firstOrCreate(
                ['name' => $item['name']],
                [
                    'category_id' => $cat->id,
                    'slug' => Slug::make($item['name'], 'products'),
                    'price' => $item['price'],
                    'old_price' => $item['old'],
                    'description' => $item['desc'],
                    'emoji' => $item['emoji'],
                    'in_stock' => $item['stock'],
                    'is_active' => true,
                ]
            );

            if (!empty($item['variations']) && $product->variations()->count() === 0) {
                foreach ($item['variations'] as $v) {
                    $product->variations()->create($v);
                }
            }
        }

        $this->seedDemoOrders();
    }

    /**
     * Demo orders with mixed statuses (pending, confirmed, cancelled)
     */
    protected function seedDemoOrders(): void
    {
        if (Order::count() > 0) {
            return;
        }

        $products = Product::with('variations')->get()->keyBy('name');

        $demoOrders = [
            [
                'name' => 'রহিম উদ্দিন',
                'phone' => '01712345678',
                'address' => 'বাড়ি ১২, রোড ৫, ধানমন্ডি, ঢাকা',
                'zone' => 'in',
                'payment_method' => 'cod',
                'status' => 'pending',
                'items' => [
                    ['product' => 'সুন্দরবনের খাঁটি মধু', 'variation' => '১ কেজি', 'qty' => 1],
                    ['product' => 'ঘানি ভাঙা সরিষার তেল (১ লি.)', 'qty' => 2],
                ],
            ],
            [
                'name' => 'ফাতেমা বেগম',
                'phone' => '01898765432',
                'address' => 'হাউস ৮, সেক্টর ১১, উত্তরা, ঢাকা',
                'zone' => 'in',
                'payment_method' => 'bkash',
                'trx_id' => 'BK8X2P9LM',
                'status' => 'confirmed',
                'items' => [
                    ['product' => 'ব্লুটুথ ওয়্যারলেস ইয়ারবাড', 'variation' => 'কালো (Black)', 'qty' => 1],
                ],
            ],
            [
                'name' => 'আব্দুল করিম',
                'phone' => '01955512345',
                'address' => 'মিরপুর ১০, ঢাকা',
                'zone' => 'in',
                'payment_method' => 'cod',
                'status' => 'cancelled',
                'items' => [
                    ['product' => 'স্মার্ট ফিটনেস ওয়াচ', 'qty' => 1],
                ],
            ],
            [
                'name' => 'সালমা আক্তার',
                'phone' => '01633344556',
                'address' => 'জিন্দাবাজার শাহী মসজিদ রোড, সিলেট',
                'zone' => 'out',
                'payment_method' => 'cod',
                'status' => 'pending',
                'items' => [
                    ['product' => 'প্রিমিয়াম নাট ও খেজুর বক্স', 'qty' => 1],
                    ['product' => 'রিচার্জেবল সাইলেন্ট ওয়্যারলেস মাউস', 'qty' => 1],
                ],
            ],
            [
                'name' => 'তানভীর হাসান',
                'phone' => '01566677889',
                'address' => 'আগ্রাবাদ কমার্শিয়াল এরিয়া, চট্টগ্রাম',
                'zone' => 'out',
                'payment_method' => 'nagad',
                'trx_id' => 'NG44TQ7WV',
                'status' => 'confirmed',
                'items' => [
                    ['product' => 'পাওয়ার ব্যাংক ১০০০০ mAh ফাস্ট চার্জ', 'qty' => 2],
                ],
            ],
        ];

        $seq = (int) (Order::max('id') ?? 0);

        foreach ($demoOrders as $demo) {
            $seq++;
            $number = sprintf('ORD-%s-%04d', now()->format('ymd'), $seq);

            // Pre-calculate subtotal and item list
            $subtotal = 0;
            $itemsToCreate = [];

            foreach ($demo['items'] as $row) {
                $product = $products->get($row['product']);
                if (! $product) continue;

                $variation = null;
                if (! empty($row['variation'])) {
                    $variation = $product->variations->firstWhere('name', $row['variation']);
                }

                $price = $variation ? (int) $variation->price : (int) $product->price;
                $qty = max(1, (int) $row['qty']);
                $subtotal += $price * $qty;

                $itemsToCreate[] = [
                    'product_id' => $product->id,
                    'variation_id' => $variation?->id,
                    'product_name' => $variation ? "{$product->name} — {$variation->name}" : $product->name,
                    'price' => $price,
                    'quantity' => $qty,
                ];
            }

            $delivery = $demo['zone'] === 'in'
                ? (int) \App\Models\Setting::getInt('delivery_in', 70)
                : (int) \App\Models\Setting::getInt('delivery_out', 120);
            if ($subtotal >= (int) \App\Models\Setting::getInt('free_over', 2000)) {
                $delivery = 0;
            }

            $total = $subtotal + $delivery;

            $order = Order::create([
                'number' => $number,
                'token' => bin2hex(random_bytes(16)),
                'name' => $demo['name'],
                'phone' => $demo['phone'],
                'address' => $demo['address'],
                'zone' => $demo['zone'],
                'payment_method' => $demo['payment_method'],
                'trx_id' => $demo['trx_id'] ?? null,
                'subtotal' => $subtotal,
                'delivery_fee' => $delivery,
                'discount' => 0,
                'total' => $total,
                'status' => $demo['status'],
            ]);

            foreach ($itemsToCreate as $itemData) {
                $order->items()->create($itemData);
            }
        }
    }
}
