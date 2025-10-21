<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;

class DualAuth
{
    public function handle($request, Closure $next)
    {
        if (Auth::guard('web')->check()) {
            return $next($request);
        }

        if (Auth::guard('api')->check()) {
            return $next($request);
        }

        return response()->json(['message' => 'Unauthorized'], 401);
    }
}