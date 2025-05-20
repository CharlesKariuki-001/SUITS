<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class RemoveTrailingSlash
{
    public function handle(Request $request, Closure $next)
    {
        $path = $request->getPathInfo();
        if (substr($path, -1) === '/' && $path !== '/') {
            return redirect(rtrim($path, '/'), 301);
        }
        return $next($request);
    }
}
