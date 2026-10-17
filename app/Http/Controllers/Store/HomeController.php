<?php

namespace App\Http\Controllers\Store;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index(Request $request)
    {
        $q = trim((string) $request->query('q'));
        $cat = $request->query('category');
        $sort = $request->query('sort');
        $like = '%'.str_replace(['%', '_'], ['\%', '\_'], $q).'%';

        $products = Product::active()->with(['category', 'images'])
            ->when($cat, fn ($b) => $b->whereHas('category', fn ($c) => $c->where('slug', $cat)))
            ->when($q !== '', fn ($b) => $b->where(fn ($w) => $w
                ->where('name', 'like', $like)
                ->orWhere('description', 'like', $like)
                ->orWhereHas('category', fn ($c) => $c->where('name', 'like', $like))))
            ->when($sort === 'lo', fn ($b) => $b->orderBy('price'))
            ->when($sort === 'hi', fn ($b) => $b->orderByDesc('price'))
            ->when(! in_array($sort, ['lo', 'hi']), fn ($b) => $b->latest('id'))
            ->limit(200)->get()->map->forStore();

        return Inertia::render('Store/Home', [
            'products' => $products,
            'categories' => Category::orderBy('position')->orderBy('id')->get(['id', 'name', 'slug']),
            'filters' => ['q' => $q ?: null, 'category' => $cat ?: null, 'sort' => $sort ?: null],
        ])->withViewData(['meta' => [
            'title' => config('shop.name').' – অনলাইন শপ',
            'description' => config('shop.subtagline'),
        ]]);
    }
}
