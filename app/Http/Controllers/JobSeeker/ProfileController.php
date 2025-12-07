<?php

namespace App\Http\Controllers\JobSeeker;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProfileController extends Controller
{
    /**
     * Show the onboarding form for job seeker.
     */
    public function onboardingShow()
    {
        return Inertia::render('JobSeeker/OnboardingJobSeeker');
    }

    /**
     * Store the onboarding data for job seeker.
     */
    public function onboardingStore(Request $request)
    {
        $validated = $request->validate([
            // Required fields (7)
            'name' => 'required|string|max:255',
            'gender' => 'required|in:male,female',
            'birth_place' => 'required|string|max:255',
            'birth_date' => 'required|date|before:today',
            'phone' => 'required|string|max:20',
            'education' => 'required|string|max:255',
            'address' => 'required|string',
            
            // Optional fields (6)
            'experience' => 'nullable|string',
            'description' => 'nullable|string',
            'linkedin_url' => 'nullable|url|max:255',
            'github_url' => 'nullable|url|max:255',
            'portfolio_url' => 'nullable|url|max:255',
            'photo_path' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',

            /* === BARU: SKILL === */
            'skills' => 'nullable|array',
            'skills.*' => 'string|max:50',
        ]);

        $jobSeeker = Auth::user()->jobSeeker;

        // Handle photo upload
        if ($request->hasFile('photo_path')) {
            if ($jobSeeker->photo_path) {
                Storage::disk('public')->delete($jobSeeker->photo_path);
            }

            $file = $request->file('photo_path');
            $filename = time() . '_' . $file->getClientOriginalName();
            $path = $file->storeAs('jobseeker/photos', $filename, 'public');
            $validated['photo_path'] = $path;
        }

        /* === SIMPAN SKILL === */
        $jobSeeker->skills = $validated['skills'] ?? [];

        $jobSeeker->update($validated);

        return redirect()->route('jobseeker.dashboard')->with('success', 'Profil berhasil dilengkapi!');
    }

    /**
     * Display the job seeker profile.
     */
    public function show()
    {
        $jobSeeker = Auth::user()->jobSeeker;
        $jobSeeker->load('user');
        
        return Inertia::render('JobSeeker/Profile/ViewJobSeeker', [
            'jobSeeker' => $jobSeeker
        ]);
    }

    /**
     * Show the form for editing job seeker profile.
     */
    public function edit()
    {
        $jobSeeker = Auth::user()->jobSeeker;
        
        return Inertia::render('JobSeeker/Profile/EditJobSeeker', [
            'jobSeeker' => $jobSeeker
        ]);
    }

    /**
     * Update the job seeker profile.
     */
    public function update(Request $request)
    {
        $validated = $request->validate([
            // Required fields (7)
            'name' => 'required|string|max:255',
            'gender' => 'required|in:male,female',
            'birth_place' => 'required|string|max:255',
            'birth_date' => 'required|date|before:today',
            'phone' => 'required|string|max:20',
            'education' => 'required|string|max:255',
            'address' => 'required|string',
            
            // Optional fields (6)
            'experience' => 'nullable|string',
            'description' => 'nullable|string',
            'linkedin_url' => 'nullable|url|max:255',
            'github_url' => 'nullable|url|max:255',
            'portfolio_url' => 'nullable|url|max:255',
            'photo_path' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',

            /* === BARU: SKILL === */
            'skills' => 'nullable|array',
            'skills.*' => 'string|max:50',
        ]);

        $jobSeeker = Auth::user()->jobSeeker;

        // Handle photo upload
        if ($request->hasFile('photo_path')) {
            if ($jobSeeker->photo_path && Storage::disk('public')->exists($jobSeeker->photo_path)) {
                Storage::disk('public')->delete($jobSeeker->photo_path);
            }

            $file = $request->file('photo_path');
            $filename = time() . '_' . $file->getClientOriginalName();
            $path = $file->storeAs('jobseeker/photos', $filename, 'public');
            $validated['photo_path'] = $path;
        }

        /* === SIMPAN SKILL === */
        $jobSeeker->skills = $validated['skills'] ?? [];

        $jobSeeker->update($validated);

        return redirect()->route('jobseeker.profile.show')->with('success', 'Profil berhasil diperbarui!');
    }
}
