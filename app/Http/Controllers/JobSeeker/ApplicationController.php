<?php

namespace App\Http\Controllers\JobSeeker;

use App\Http\Controllers\Controller;
use App\Models\Application;
use App\Models\Job;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ApplicationController extends Controller
{
    /**
     * Tampilkan semua lamaran milik job seeker yang login
     */
    public function index()
    {
        $user = Auth::user();
        $jobSeeker = $user->jobSeeker;

        if (!$jobSeeker) {
            return redirect('/jobseeker/onboarding')
                ->with('error', 'Silakan lengkapi profil terlebih dahulu.');
        }

        $applications = Application::with(['job.company', 'resume', 'interview'])
            ->where('job_seeker_id', $jobSeeker->id)
            ->orderBy('application_date', 'desc')
            ->get();

        return Inertia::render('JobSeeker/Applications/Index', [
            'applications' => $applications,
        ]);
    }

    /**
     * Buat lamaran baru (Apply for Job)
     */
    public function store(Request $request)
    {
        $request->validate([
            'job_id' => 'required|integer',
            'notes' => 'nullable|string|max:500',
        ]);

        $user = Auth::user();
        $jobSeeker = $user->jobSeeker;

        if (!$jobSeeker) {
            return redirect('/jobseeker/onboarding')
                ->with('error', 'Silakan lengkapi profil terlebih dahulu.');
        }

        // Validation 1: Check job status
        $job = Job::findOrFail($request->job_id);
        if ($job->status !== 'approved') {
            return redirect()->back()
                ->with('error', 'Lowongan ini tidak tersedia untuk dilamar.');
        }

        // Validation 2: Check resume
        $resume = $jobSeeker->resumes()->latest('upload_date')->first();
        if (!$resume) {
            return redirect('/jobseeker/resumes')
                ->with('error', 'Silakan upload CV terlebih dahulu sebelum melamar.');
        }

        // Validation 3: Check duplicate
        $existing = Application::where('job_id', $request->job_id)
            ->where('job_seeker_id', $jobSeeker->id)
            ->first();

        if ($existing) {
            return redirect()->back()
                ->with('error', 'Anda sudah pernah melamar pekerjaan ini.');
        }

        // Create application
        Application::create([
            'job_id' => $request->job_id,
            'job_seeker_id' => $jobSeeker->id,
            'resume_id' => $resume->id,
            'status' => 'submitted',
            'application_date' => now(),
            'notes' => $request->notes,
        ]);

        return redirect('/jobseeker/applications')
            ->with('success', 'Lamaran berhasil dikirim!');
    }

    /**
     * Display single application detail
     */
    public function show($id)
    {
        $user = Auth::user();
        $jobSeeker = $user->jobSeeker;

        $application = Application::with(['job.company', 'resume', 'interview'])
            ->where('id', $id)
            ->where('job_seeker_id', $jobSeeker->id)
            ->firstOrFail();

        return Inertia::render('JobSeeker/Applications/Show', [
            'application' => $application,
        ]);
    }

    /**
     * Cancel/withdraw application
     */
    public function destroy($id)
    {
        $user = Auth::user();
        $jobSeeker = $user->jobSeeker;

        $application = Application::where('id', $id)
            ->where('job_seeker_id', $jobSeeker->id)
            ->where('status', 'submitted') // Only submitted can be cancelled
            ->firstOrFail();

        $application->delete();

        return redirect('/jobseeker/applications')
            ->with('success', 'Lamaran berhasil dibatalkan.');
    }
}
