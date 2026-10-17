<?php

namespace App\Http\Controllers\Store;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function show(Product $product)
    {
        abort_unless($product->is_active, 404);
        $product->load(['category', 'images']);
        $data = $product->forStore();

        $related = Product::active()->with(['category', 'images'])
            ->where('id', '!=', $product->id)
            ->when($product->category_id, fn ($b) => $b->where('category_id', $product->category_id))
            ->latest('id')->limit(4)->get()->map->forStore();

        $image = $data['images'][0] ?? '/images/logo.jpg';

        // These tags are rendered into the initial HTML so Facebook / WhatsApp link previews and ads work.
        return Inertia::render('Store/Product', ['product' => $data, 'related' => $related])
            ->withViewData(['meta' => [
                'title' => $product->name.' – '.config('shop.name'),
                'description' => Str::limit(trim(strip_tags((string) $product->description)) ?: config('shop.subtagline'), 160),
                'image' => url($image),
                'url' => url()->current(),
                'type' => 'product',
                'price' => $product->price,
                'availability' => $product->in_stock ? 'in stock' : 'out of stock',
            ]]);
    }
}
