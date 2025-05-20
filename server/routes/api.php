<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\SubscriberController;
use App\Http\Controllers\CustomTailoringController;
use App\Http\Controllers\OrdersController;
use App\Http\Controllers\AdminController;

// Public routes (no authentication required)
Route::get('/products', [ProductController::class, 'index']);
Route::post('/contact', [ContactController::class, 'store']);
Route::post('/subscribe', [SubscriberController::class, 'store']);
Route::post('/custom-tailoring', [CustomTailoringController::class, 'store'])->name('custom-tailoring.store');
Route::post('/orders', [OrdersController::class, 'store']);
Route::get('/orders/track', [OrdersController::class, 'track']);
Route::get('/admin/orders', [AdminController::class, 'getOrders']);
Route::put('/admin/orders/{id}', [AdminController::class, 'updateOrderStatus']);
Route::get('/admin/subscribers', [AdminController::class, 'getSubscribers']);

// Authenticated user route
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
