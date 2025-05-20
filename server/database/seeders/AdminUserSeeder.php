<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User; // Ensure this matches your Laravel version's namespace
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run()
    {
        // Check if the admin user already exists to avoid duplicates
        $adminEmail = 'admin@donscustoms.com';
        if (!User::where('email', $adminEmail)->exists()) {
            User::create([
                'name' => 'Admin',
                'email' => $adminEmail,
                'password' => Hash::make('password123'), // Change this to a secure password
                'is_admin' => true, // We'll use this to identify the admin
            ]);
        }
    }
}
