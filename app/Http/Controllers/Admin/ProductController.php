<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use App\Support\Slug;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProductController extends Controller
{
    private const MESSAGES = [
        'name.required' => 'পণ্যের নাম লিখুন',
        'category_id.required' => 'ক্যাটাগরি বাছাই করুন',
        'category_id.exists' => 'ক্যাটাগরিটি সঠিক নয়',
        'price.required' => 'দাম লিখুন',
        'price.integer' => 'দাম সংখ্যায় লিখুন',
        'price.min' => 'দাম অন্তত ১ টাকা হতে হবে',
        'old_price.integer' => 'আগের দাম সংখ্যায় লিখুন',
        'images.*.image' => 'ফাইলটি ছবি হতে হবে',
        'images.*.mimes' => 'jpg, png বা webp ছবি দিন',
        'images.*.max' => 'প্রতিটি ছবি ৫ MB এর মধ্যে হতে হবে',
    ];

    public function index()
    {
        return Inertia::render('Admin/Products/Index', [
            'products' => Product::with(['category', 'images'])->latest('id')->get()
                ->map(fn ($p) => [...$p->forStore(), 'is_active' => $p->is_active]),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Products/Form', ['product' => null, 'categories' => $this->categories()]);
    }

    public function edit(Product $product)
    {
        $product->load('images');

        return Inertia::render('Admin/Products/Form', [
            'product' => [
                'id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'category_id' => $product->category_id,
                'price' => $product->price,
                'old_price' => $product->old_price,
                'description' => $product->description,
                'emoji' => $product->emoji,
                'in_stock' => $product->in_stock,
                'is_active' => $product->is_active,
                'images' => $product->images->map(fn ($i) => ['id' => $i->id, 'url' => $i->url])->values(),
            ],
            'categories' => $this->categories(),
        ]);
    }

    public function store(Request $request)
    {
        $d = $this->validated($request);
        $product = Product::create([...$d, 'slug' => Slug::make($d['slug'] ?: $d['name'], 'products')]);
        $this->saveImages($request, $product);

        return redirect()->route('admin.products.index')->with('success', 'পণ্য যোগ হয়েছে');
    }

    public function update(Request $request, Product $product)
    {
        $d = $this->validated($request);
        $product->update([...$d, 'slug' => $d['slug'] ? Slug::make($d['slug'], 'products', $product->id) : $product->slug]);
        $this->saveImages($request, $product);

        return redirect()->route('admin.products.index')->with('success', 'পণ্য আপডেট হয়েছে');
    }

    public function destroy(Product $product)
    {
        foreach ($product->images as $img) {
            Storage::disk('public')->delete($img->path);
        }
        $product->delete();

        return back()->with('success', 'পণ্য মুছে ফেলা হয়েছে');
    }

    public function stock(Product $product)
    {
        $product->update(['in_stock' => ! $product->in_stock]);

        return back();
    }

    public function destroyImage(Product $product, ProductImage $image)
    {
        abort_unless($image->product_id === $product->id, 404);
        Storage::disk('public')->delete($image->path);
        $image->delete();

        return back();
    }

    public function mainImage(Product $product, ProductImage $image)
    {
        abort_unless($image->product_id === $product->id, 404);
        $image->update(['position' => ((int) $product->images()->min('position')) - 1]);

        return back();
    }

    private function validated(Request $request): array
    {
        $v = $request->validate([
            'name' => 'required|string|max:150',
            'slug' => 'nullable|string|max:150',
            'category_id' => 'required|exists:categories,id',
            'price' => 'required|integer|min:1|max:10000000',
            'old_price' => 'nullable|integer|min:1|max:10000000',
            'description' => 'nullable|string|max:5000',
            'emoji' => 'nullable|string|max:8',
            'images' => 'nullable|array|max:10',
            'images.*' => 'image|mimes:jpg,jpeg,png,webp|max:5120',
        ], self::MESSAGES);
        unset($v['images']);

        return [
            ...$v,
            'slug' => $v['slug'] ?? null,
            'in_stock' => $request->boolean('in_stock'),
            'is_active' => $request->boolean('is_active'),
        ];
    }

    private function saveImages(Request $request, Product $product): void
    {
        $pos = (int) $product->images()->max('position');
        foreach ($request->file('images', []) as $file) {
            $product->images()->create(['path' => $file->store('products', 'public'), 'position' => ++$pos]);
        }
    }

    private function categories()
    {
        return Category::orderBy('position')->orderBy('id')->get(['id', 'name']);
    }
}
