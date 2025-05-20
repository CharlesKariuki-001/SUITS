<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique(); // Ensure product names are unique
            $table->enum('category', ['mens', 'womens'])->default('mens'); // Restrict category to valid values
            $table->decimal('price', 10, 2)->unsigned()->default(0.00); // Allow larger prices, non-negative
            $table->json('image_urls')->nullable()->comment('Array of image URLs, e.g., ["url1.jpg", "url2.jpg"]'); // Optional, with structure hint
            $table->json('sizes')->nullable()->comment('Array of available sizes, e.g., ["S", "M", "L"]'); // Optional, with structure hint
            $table->json('colors')->nullable()->comment('Array of available colors, e.g., ["Navy", "Black"]'); // Optional, with structure hint
            $table->text('description')->nullable(); // Optional description
            $table->unsignedInteger('stock')->default(0)->comment('Available stock quantity, non-negative'); // Unsigned for non-negative values
            $table->timestamps();

            // Add indexes for better query performance
            $table->index('category'); // Index for filtering by category
            $table->index('stock'); // Index for stock availability checks
        });

        // Add a check constraint for stock (non-negative)
        DB::statement('ALTER TABLE products ADD CONSTRAINT check_stock_non_negative CHECK (stock >= 0)');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
