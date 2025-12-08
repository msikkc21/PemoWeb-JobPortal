<?php

namespace App\Http\Controllers\JobSeeker;

use App\Http\Controllers\Controller;
use App\Models\Resume;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Carbon\Carbon;

class ResumeController extends Controller
{
    /**
     * Display a listing of resumes for the current job seeker.
     */
    public function index()
    {
        $user = Auth::user();
        $jobSeeker = $user->jobSeeker;

        if (!$jobSeeker) {
            return redirect()->route('jobseeker.onboarding')
                ->with('error', 'Silakan lengkapi profil terlebih dahulu.');
        }

        $resumes = $jobSeeker->resumes()
            ->orderBy('upload_date', 'desc')
            ->get();

        return Inertia::render('JobSeeker/Resumes/Index', [
            'resumes' => $resumes,
            'hasResume' => $resumes->count() > 0,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return redirect()->route('jobseeker.resumes.index');
    }

    /**
     * Store a newly uploaded resume.
     * Validation: PDF only, max 2MB.
     */
    public function store(Request $request)
    {
        $request->validate([
            'cv_file' => 'required|file|mimes:pdf|max:2048',
        ], [
            'cv_file.required' => 'File CV wajib diunggah.',
            'cv_file.file' => 'File CV tidak valid.',
            'cv_file.mimes' => 'File CV harus dalam format PDF.',
            'cv_file.max' => 'Ukuran file CV maksimal 2MB.',
        ]);

        $user = Auth::user();
        $jobSeeker = $user->jobSeeker;

        if (!$jobSeeker) {
            return redirect()->route('jobseeker.onboarding')
                ->with('error', 'Silakan lengkapi profil terlebih dahulu.');
        }

        // Store file with hashed filename
        $file = $request->file('cv_file');
        $hashedName = $file->hashName();
        $path = $file->storeAs('resumes', $hashedName, 'public');

        // Create resume record
        Resume::create([
            'job_seeker_id' => $jobSeeker->id,
            'cv_file' => $path,
            'parsed_data' => json_encode(['status' => 'unparsed']),
            'upload_date' => Carbon::now()->toDateString(),
        ]);

        return redirect()->route('jobseeker.resumes.index')
            ->with('success', 'CV berhasil diunggah!');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $user = Auth::user();
        $jobSeeker = $user->jobSeeker;

        $resume = Resume::where('id', $id)
            ->where('job_seeker_id', $jobSeeker->id)
            ->firstOrFail();

        // Return file for download/view
        return Storage::disk('public')->download($resume->cv_file);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        return redirect()->route('jobseeker.resumes.index');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        return redirect()->route('jobseeker.resumes.index');
    }

    /**
     * Remove the specified resume.
     */
    public function destroy(string $id)
    {
        $user = Auth::user();
        $jobSeeker = $user->jobSeeker;

        $resume = Resume::where('id', $id)
            ->where('job_seeker_id', $jobSeeker->id)
            ->firstOrFail();

        // Delete file from storage
        if (Storage::disk('public')->exists($resume->cv_file)) {
            Storage::disk('public')->delete($resume->cv_file);
        }

        // Delete record
        $resume->delete();

        return redirect()->route('jobseeker.resumes.index')
            ->with('success', 'CV berhasil dihapus.');
    }
}
