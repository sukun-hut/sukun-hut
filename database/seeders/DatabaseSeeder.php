<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database with settings, admin account, and demo data.
     */
    public function run(): void
    {
        // 1. Seed dynamic settings and theme configuration
        $this->call(SettingsSeeder::class);

        // 2. Ensure initial Administrator account exists
        $a = config('shop.admin');
        User::updateOrCreate(
            ['email' => $a['email']],
            ['name' => $a['name'], 'password' => Hash::make($a['password'])]
        );

        // 3. Seed demo categories, products, and variations
        $this->call(DemoDataSeeder::class);
    }
}

