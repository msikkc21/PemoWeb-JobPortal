<?php

namespace App\Http\Controllers\Company;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProfileController extends Controller
{
    /**
     * Show the onboarding form for company.
     */
    public function onboardingShow()
    {
        return Inertia::render('Company/OnboardingCompany');
    }

    /**
     * Store the onboarding data for company.
     */
    public function onboardingStore(Request $request)
    {
        $validated = $request->validate([
            // Required fields (7)
            'company_name' => 'required|string|max:255',
            'industry' => 'required|string|max:255',
            'location' => 'required|string|max:255',
            'company_email' => 'required|email|max:255',
            'phone' => 'required|string|max:20',
            'description' => 'required|string',
            'address' => 'required|string',
            
            // Optional fields (4)
            'website' => 'nullable|url|max:255',
            'photo_path' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'employee_count' => 'nullable|integer|min:1',
            'founded_year' => 'nullable|integer|min:1800|max:' . date('Y'),
        ]);

        $company = Auth::user()->company;

        // Handle photo upload
        if ($request->hasFile('photo_path')) {
            // Delete old photo if exists
            if ($company->photo_path) {
                Storage::disk('public')->delete($company->photo_path);
            }

            $file = $request->file('photo_path');
            $filename = time() . '_' . $file->getClientOriginalName();
            $path = $file->storeAs('company/photos', $filename, 'public');
            $validated['photo_path'] = $path;
        }

        $company->update($validated);

        return redirect()->route('company.dashboard')->with('success', 'Profil berhasil dilengkapi!');
    }

    /**
     * Display the company profile.
     */
    public function show()
    {
        $company = Auth::user()->company;
        
        return Inertia::render('Company/Profile/ViewCompany', [
            'company' => $company
        ]);
    }

    /**
     * Show the form for editing company profile.
     */
    public function edit()
    {
        $company = Auth::user()->company;
        
        return Inertia::render('Company/Profile/EditCompany', [
            'company' => $company
        ]);
    }

    /**
     * Update the company profile.
     */
    public function update(Request $request)
    {
        $validated = $request->validate([
            // Required fields (7)
            'company_name' => 'required|string|max:255',
            'industry' => 'required|string|max:255',
            'location' => 'required|string|max:255',
            'company_email' => 'required|email|max:255',
            'phone' => 'required|string|max:20',
            'description' => 'required|string',
            'address' => 'required|string',
            
            // Optional fields (4)
            'website' => 'nullable|url|max:255',
            'photo_path' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'employee_count' => 'nullable|integer|min:1',
            'founded_year' => 'nullable|integer|min:1800|max:' . date('Y'),
        ]);

        $company = Auth::user()->company;

        // Handle photo upload
        if ($request->hasFile('photo_path')) {
            // Delete old photo if exists
            if ($company->photo_path && Storage::disk('public')->exists($company->photo_path)) {
                Storage::disk('public')->delete($company->photo_path);
            }

            $file = $request->file('photo_path');
            $filename = time() . '_' . $file->getClientOriginalName();
            $path = $file->storeAs('company/photos', $filename, 'public');
            $validated['photo_path'] = $path;
        }

        $company->update($validated);

        return redirect()->route('company.profile.show')->with('success', 'Profil berhasil diperbarui!');
    }
}
