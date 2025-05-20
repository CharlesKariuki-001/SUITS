<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AdminMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        // If not authenticated, redirect to login
        if (!Auth::check()) {
            return redirect()->route('admin.login')->with('error', 'Please log in to access the admin section.');
        }

        // If authenticated but not an admin, log out and redirect
        if (!Auth::user()->is_admin) {
            Auth::logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();
            return redirect()->route('admin.login')->with('error', 'You are not authorized to access the admin section.');
        }

        return $next($request);
    }
}
