<?php

namespace App\Http\Controllers\JobSeeker;

use App\Http\Controllers\Controller;
use App\Models\Skill;
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
        $skills = Skill::orderBy('name')->get();
        $jobSeeker = Auth::user()->jobSeeker;
        $existingSkills = $jobSeeker ? $jobSeeker->skills->map(function ($skill) {
            return [
                'id' => $skill->id,
                'name' => $skill->name,
                'level' => $skill->pivot->level,
            ];
        }) : [];

        return Inertia::render('JobSeeker/OnboardingJobSeeker', [
            'skills' => $skills,
            'existingSkills' => $existingSkills,
        ]);
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
            
            // Skills
            'skills' => 'nullable|array',
            'skills.*.skill_id' => 'required_with:skills|exists:skills,id',
            'skills.*.level' => 'required_with:skills|in:beginner,intermediate,expert',
            
            // CV File
            'cv_file' => 'nullable|file|mimes:pdf,doc,docx|max:5120',
        ]);

        $jobSeeker = Auth::user()->jobSeeker;

        // Handle photo upload
        if ($request->hasFile('photo_path')) {
            // Delete old photo if exists
            if ($jobSeeker->photo_path) {
                Storage::disk('public')->delete($jobSeeker->photo_path);
            }

            $file = $request->file('photo_path');
            $filename = time() . '_' . $file->getClientOriginalName();
            $path = $file->storeAs('jobseeker/photos', $filename, 'public');
            $validated['photo_path'] = $path;
        }

        // Remove skills and cv_file from validated data before update
        $skillsData = $validated['skills'] ?? [];
        unset($validated['skills']);
        unset($validated['cv_file']);

        $jobSeeker->update($validated);

        // Sync skills with pivot data
        if (!empty($skillsData)) {
            $syncData = [];
            foreach ($skillsData as $skill) {
                $syncData[$skill['skill_id']] = [
                    'level' => $skill['level'],
                    'experience_years' => 0,
                ];
            }
            $jobSeeker->skills()->sync($syncData);
        } else {
            $jobSeeker->skills()->detach();
        }

        // Handle CV upload
        if ($request->hasFile('cv_file')) {
            $cvFile = $request->file('cv_file');
            $cvFilename = time() . '_' . $cvFile->getClientOriginalName();
            $cvPath = $cvFile->storeAs('jobseeker/resumes', $cvFilename, 'public');

            // Create resume record
            \App\Models\Resume::create([
                'job_seeker_id' => $jobSeeker->id,
                'cv_file' => $cvPath,
                'upload_date' => now(),
            ]);
        }

        return redirect('/jobseeker/dashboard')->with('success', 'Profil berhasil dilengkapi!');
    }

    /**
     * Display the job seeker profile.
     */
    public function show()
    {
        $jobSeeker = Auth::user()->jobSeeker;
        $jobSeeker->load('user', 'skills');
        
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
        $jobSeeker->load('skills');
        
        $skills = Skill::orderBy('name')->get();
        $existingSkills = $jobSeeker->skills->map(function ($skill) {
            return [
                'id' => $skill->id,
                'name' => $skill->name,
                'level' => $skill->pivot->level,
            ];
        });
        
        return Inertia::render('JobSeeker/Profile/EditJobSeeker', [
            'jobSeeker' => $jobSeeker,
            'skills' => $skills,
            'existingSkills' => $existingSkills,
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
            
            // Skills
            'skills' => 'nullable|array',
            'skills.*.skill_id' => 'required_with:skills|exists:skills,id',
            'skills.*.level' => 'required_with:skills|in:beginner,intermediate,expert',
        ]);

        $jobSeeker = Auth::user()->jobSeeker;

        // Handle photo upload
        if ($request->hasFile('photo_path')) {
            // Delete old photo if exists
            if ($jobSeeker->photo_path && Storage::disk('public')->exists($jobSeeker->photo_path)) {
                Storage::disk('public')->delete($jobSeeker->photo_path);
            }

            $file = $request->file('photo_path');
            $filename = time() . '_' . $file->getClientOriginalName();
            $path = $file->storeAs('jobseeker/photos', $filename, 'public');
            $validated['photo_path'] = $path;
        }

        // Remove skills from validated data before update
        $skillsData = $validated['skills'] ?? [];
        unset($validated['skills']);

        $jobSeeker->update($validated);

        // Sync skills with pivot data
        if (!empty($skillsData)) {
            $syncData = [];
            foreach ($skillsData as $skill) {
                $syncData[$skill['skill_id']] = [
                    'level' => $skill['level'],
                    'experience_years' => 0,
                ];
            }
            $jobSeeker->skills()->sync($syncData);
        } else {
            $jobSeeker->skills()->detach();
        }

        return redirect('/jobseeker/profile')->with('success', 'Profil berhasil diperbarui!');
    }
}
