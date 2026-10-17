<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Support\Slug;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CategoryController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Categories/Index', [
            'categories' => Category::withCount('products')->orderBy('position')->orderBy('id')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $d = $request->validate(['name' => 'required|string|max:80'], ['name.required' => 'ক্যাটাগরির নাম লিখুন']);
        Category::create(['name' => $d['name'], 'slug' => Slug::make($d['name'], 'categories'), 'position' => (int) Category::max('position') + 1]);

        return back()->with('success', 'ক্যাটাগরি যোগ হয়েছে');
    }

    public function update(Request $request, Category $category)
    {
        $d = $request->validate(['name' => 'required|string|max:80'], ['name.required' => 'ক্যাটাগরির নাম লিখুন']);
        $category->update(['name' => $d['name']]);

        return back()->with('success', 'ক্যাটাগরি আপডেট হয়েছে');
    }

    public function destroy(Category $category)
    {
        if ($category->products()->exists()) {
            return back()->with('error', 'এই ক্যাটাগরিতে পণ্য আছে। আগে পণ্যগুলো অন্য ক্যাটাগরিতে নিন।');
        }
        $category->delete();

        return back()->with('success', 'ক্যাটাগরি মুছে ফেলা হয়েছে');
    }
}
