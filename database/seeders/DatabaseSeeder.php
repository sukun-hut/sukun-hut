<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use App\Support\Slug;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $a = config('shop.admin');
        User::updateOrCreate(['email' => $a['email']], ['name' => $a['name'], 'password' => Hash::make($a['password'])]);

        if (Product::exists()) {
            return;
        }

        $cats = [];
        foreach (['খাবার', 'গ্যাজেট', 'টেক'] as $i => $name) {
            $cats[$name] = Category::create(['name' => $name, 'slug' => Slug::make($name, 'categories'), 'position' => $i + 1]);
        }

        // Sample products (no images). Delete or edit them from the admin panel.
        $rows = [
            ['খাবার', 'সুন্দরবনের মধু (৫০০ গ্রাম)', 650, 750, 'প্রাকৃতিক মধু, কোনো ভেজাল নেই।', true, '🍯'],
            ['খাবার', 'খাঁটি সরিষার তেল (১ লি.)', 320, 380, 'ঘানিতে ভাঙানো, ঝাঁঝালো ও খাঁটি।', true, '🫙'],
            ['খাবার', 'মিক্সড নাট ও খেজুর বক্স', 890, null, 'কাজু, বাদাম, কিশমিশ ও আজওয়া খেজুর।', true, '🌰'],
            ['গ্যাজেট', 'ব্লুটুথ ইয়ারবাড', 1190, 1490, 'পরিষ্কার সাউন্ড, লং ব্যাটারি ব্যাকআপ।', true, '🎧'],
            ['গ্যাজেট', 'স্মার্ট ওয়াচ', 1990, 2490, 'কল, নোটিফিকেশন ও হেলথ ট্র্যাকিং।', false, '⌚'],
            ['গ্যাজেট', 'ফোন স্ট্যান্ড ও হোল্ডার', 290, null, 'ডেস্ক ও বিছানায় ব্যবহারের উপযোগী।', true, '📱'],
            ['টেক', 'পাওয়ার ব্যাংক ১০০০০ mAh', 1250, 1450, 'ফাস্ট চার্জিং সাপোর্ট, হালকা ও মজবুত।', true, '🔋'],
            ['টেক', 'ফাস্ট চার্জার ও ক্যাবল সেট', 690, null, 'টাইপ-সি ক্যাবলসহ ফাস্ট চার্জার।', true, '🔌'],
            ['টেক', 'ওয়্যারলেস মাউস', 590, null, 'নীরব ক্লিক, ল্যাপটপ ও পিসির জন্য।', true, '🖱️'],
        ];
        foreach ($rows as [$cat, $name, $price, $old, $desc, $stock, $emoji]) {
            Product::create([
                'category_id' => $cats[$cat]->id, 'name' => $name, 'slug' => Slug::make($name, 'products'),
                'price' => $price, 'old_price' => $old, 'description' => $desc, 'emoji' => $emoji, 'in_stock' => $stock, 'is_active' => true,
            ]);
        }
    }
}
