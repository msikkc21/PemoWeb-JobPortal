<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $request->session()->regenerate();

        $user = Auth::user();

        // Handle company users with specific redirect logic
        if ($user->isCompany()) {
            $profile = \App\Models\CompanyProfile::where('user_id', $user->id)->first();

            // No profile yet → redirect to create
            if (!$profile) {
                return redirect('/company/create');
            }

            // Profile exists, check payment status via user_id (NOT company_profile_id)
            $payment = \App\Models\CompanyPayment::where('user_id', $user->id)
                ->orderBy('created_at', 'desc')
                ->first();

            // If no payment or not paid → redirect to payment
            if (!$payment || $payment->status !== 'paid') {
                return redirect('/company/payment');
            }

            // Profile exists AND payment is paid → redirect to company dashboard
            return redirect('/company/dashboard');
        }

        // Default redirect for non-company users
        return redirect()->intended(route('dashboard'));
    }


    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}
