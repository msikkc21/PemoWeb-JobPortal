<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $user = $request->user();
        
        DB::transaction(function () use ($user, $request) {
            $user->fill($request->validated());

            if ($user->isDirty('email')) {
                $user->email_verified_at = null;
            }

            // Check if name changed
            $nameChanged = $user->isDirty('name');

            $user->save();

            // Sync name to company.company_name if user is company and name changed
            if ($nameChanged) {
                $this->syncCompanyNameFromUser($user);
            }
        });

        return Redirect::route('profile.edit');
    }

    /**
     * Helper: Sync company.company_name from user.name
     * Ensures companies.company_name always matches users.name
     */
    private function syncCompanyNameFromUser($user): void
    {
        // Only sync if user is company role and has company profile
        if ($user && $user->role->name === 'company' && $user->company) {
            $user->company->update([
                'company_name' => $user->name
            ]);
        }
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
