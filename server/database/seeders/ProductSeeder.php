<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        Product::create([
            'name' => 'Classic Navy Suit',
            'description' => 'A timeless navy suit for any occasion.',
            'price' => 15000,
            'image' => 'https://images.unsplash.com/photo-1593032465175-2c32f8c70763?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
            'category' => 'mens',
        ]);

        Product::create([
            'name' => 'Elegant Black Women’s Suit',
            'description' => 'A sleek black suit for women, perfect for formal events.',
            'price' => 18000,
            'image' => 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
            'category' => 'womens',
        ]);
    }
}
