<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class EnsureActiveSubscription
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Only apply to company role
        if (Auth::check() && Auth::user()->role->name === 'company') {
            $company = Auth::user()->company;

            // Check if company has active subscription
            if (!$company || !$company->subscriptions()->where('status', 'active')->exists()) {
                return redirect()
                    ->route('company.subscription.index')
                    ->with('warning', 'Langganan Anda tidak aktif. Silakan aktifkan paket untuk mengakses fitur ini.');
            }
        }

        return $next($request);
    }
}
