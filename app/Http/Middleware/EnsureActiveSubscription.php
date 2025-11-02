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
     * Ensure that the company has an active subscription before
     * allowing them to perform CRUD operations on jobs.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = Auth::user();

        // Only apply this middleware to company users
        if (!$user || $user->role->name !== 'company') {
            return $next($request);
        }

        // Get company
        $company = $user->company;

        if (!$company) {
            return redirect()->route('company.dashboard')
                ->with('error', 'Profil perusahaan tidak ditemukan.');
        }

        // Get latest subscription
        $subscription = $company->subscriptions()
            ->latest()
            ->first();

        // Check if company has no subscription at all
        if (!$subscription) {
            return redirect()->route('company.subscription.choose')
                ->with('warning', 'Anda belum memiliki paket langganan. Silakan pilih paket untuk mulai posting lowongan.');
        }

        // Check if subscription is not active
        if ($subscription->status !== 'active') {
            $message = match($subscription->status) {
                'pending_payment' => 'Langganan Anda menunggu pembayaran. Silakan selesaikan pembayaran untuk mengaktifkan fitur posting lowongan.',
                'expired' => 'Langganan Anda sudah kadaluarsa. Silakan perpanjang paket untuk melanjutkan posting lowongan.',
                'cancelled' => 'Langganan Anda dibatalkan. Silakan pilih paket baru untuk mulai posting lowongan.',
                default => 'Status langganan Anda tidak aktif. Silakan perbarui paket langganan Anda.',
            };

            return redirect()->route('company.subscription.index')
                ->with('warning', $message);
        }

        // Subscription is active, allow request to proceed
        return $next($request);
    }
}
