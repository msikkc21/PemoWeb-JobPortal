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
        $roleName = $user->role?->name;

        // Check if user is a company
        if (in_array($roleName, ['Perusahaan', 'Company'])) {
            $profile = \App\Models\CompanyProfile::where('user_id', $user->id)->first();
            
            // Check if profile is complete
            $isComplete = $profile && 
                         !empty($profile->company_name) && 
                         !empty($profile->industry) && 
                         !empty($profile->location);

            if (!$isComplete) {
                return redirect()->route('company_profiles.create')
                    ->with('info', 'Silakan lengkapi profil perusahaan Anda.');
            }

            return redirect()->route('company.dashboard');
        }

        // Double-check using isCompany() method for any edge cases
        if ($user && method_exists($user, 'isCompany') && $user->isCompany()) {
            return redirect()->route('company.dashboard');
        }

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
