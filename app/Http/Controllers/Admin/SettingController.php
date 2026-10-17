<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SettingController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Settings/Index', [
            'settings' => Setting::deliverySettings(),
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'delivery_in' => 'required|integer|min:0|max:100000',
            'delivery_out' => 'required|integer|min:0|max:100000',
            'free_over' => 'required|integer|min:0|max:1000000',
        ], [
            'delivery_in.required' => 'ঢাকার ভেতরের ডেলিভারি চার্জ লিখুন',
            'delivery_in.integer' => 'ডেলিভারি চার্জ সংখ্যায় লিখুন',
            'delivery_out.required' => 'ঢাকার বাইরের ডেলিভারি চার্জ লিখুন',
            'delivery_out.integer' => 'ডেলিভারি চার্জ সংখ্যায় লিখুন',
            'free_over.required' => 'ফ্রি ডেলিভারির লিমিট লিখুন',
            'free_over.integer' => 'ফ্রি ডেলিভারির লিমিট সংখ্যায় লিখুন',
        ]);

        Setting::set('delivery_in', $validated['delivery_in']);
        Setting::set('delivery_out', $validated['delivery_out']);
        Setting::set('free_over', $validated['free_over']);

        return back()->with('success', 'ডেলিভারি সেটিংস সফলভাবে আপডেট হয়েছে');
    }
}

