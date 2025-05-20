<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdminController;

// Admin login routes (no middleware)
Route::get('/admin/login', [AdminController::class, 'showLoginForm'])->name('admin.login');
Route::post('/admin/login', [AdminController::class, 'login'])->name('admin.login');

// Admin dashboard route (protected by middleware)
Route::middleware(['admin'])->group(function () {
    Route::get('/admin/dashboard', [AdminController::class, 'dashboard'])->name('admin.dashboard');
    Route::post('/admin/logout', [AdminController::class, 'logout'])->name('logout');
});
