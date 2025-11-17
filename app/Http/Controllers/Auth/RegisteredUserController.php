<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Role;
use App\Models\Company;
use App\Models\JobSeeker;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:' . User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'account_type' => 'required|in:company,jobseeker',
        ]);

        // Ambil role_id berdasarkan account_type
        $role = Role::where('name', $request->account_type)->first();

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role_id' => $role->id,
        ]);

        event(new Registered($user));

        Auth::login($user);

        // Buat entri profil sesuai tipe akun
        if ($request->account_type === 'company') {
            Company::create([
                'user_id' => $user->id,
                'company_name' => $request->name,
            ]);
        } else {
            JobSeeker::create([
                'user_id' => $user->id,
                'name' => $request->name,
            ]);
        }

        // Redirect ke dashboard sesuai role dan status profil
        return $this->redirectToRoleDashboard($user);
    }

    /**
     * Helper: Redirect user ke dashboard sesuai role dan status profil
     */
    protected function redirectToRoleDashboard(User $user): RedirectResponse
    {
        // Admin langsung ke admin dashboard
        if ($user->isAdmin()) {
            return redirect()->route('admin.dashboard');
        }

        // Company
        if ($user->isCompany()) {
            $company = $user->company;
            if (!$company || !$company->isProfileComplete()) {
                return redirect()->route('company.onboarding');
            }
            return redirect()->route('company.dashboard');
        }

        // JobSeeker
        if ($user->isJobSeeker()) {
            $jobSeeker = $user->jobSeeker;
            if (!$jobSeeker || !$jobSeeker->isProfileComplete()) {
                return redirect()->route('jobseeker.onboarding');
            }
            return redirect()->route('jobseeker.dashboard');
        }

        // Fallback
        return redirect()->route('dashboard');
    }
}
