<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\User;
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

        // Redirect ke dashboard sesuai role dan status profil
        return $this->redirectToRoleDashboard(Auth::user());
    }

    /**
     * Helper: Redirect user ke dashboard sesuai role dan status profil
     */
    protected function redirectToRoleDashboard(User $user): RedirectResponse
    {
        // Admin langsung ke admin dashboard
        if ($user->isAdmin()) {
            return redirect()->intended(route('admin.dashboard'));
        }

        // Company
        if ($user->isCompany()) {
            $company = $user->company;
            if (!$company || !$company->isProfileComplete()) {
                return redirect()->intended(route('company.onboarding'));
            }
            return redirect()->intended(route('company.dashboard'));
        }

        // JobSeeker
        if ($user->isJobSeeker()) {
            $jobSeeker = $user->jobSeeker;
            if (!$jobSeeker || !$jobSeeker->isProfileComplete()) {
                return redirect()->intended(route('jobseeker.onboarding'));
            }
            return redirect()->intended(route('jobseeker.dashboard'));
        }

        // Fallback
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
