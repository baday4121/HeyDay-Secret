<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckAdminKey
{
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->has('key')) {
            if ($request->query('key') === 'qwerty') {
                session(['admin_key_verified' => true]);
            }
        }

        if (session('admin_key_verified') === true || $request->query('key') === 'qwerty') {
            return $next($request);
        }

        abort(404);
    }
}