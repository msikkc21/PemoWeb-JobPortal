<?php

namespace App\Http\Controllers\JobSeeker;

use App\Http\Controllers\Controller;
use App\Models\Application;
use App\Models\Job;
use App\Models\JobSeekerSkill;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    /**
     * Display the job seeker dashboard with statistics.
     */
    public function index()
    {
        $jobSeeker = Auth::user()->jobSeeker;

        // Get application statistics
        $totalApplications = Application::where('job_seeker_id', $jobSeeker->id)->count();
        
        $pendingApplications = Application::where('job_seeker_id', $jobSeeker->id)
            ->where('status', 'pending')
            ->count();
        
        $acceptedApplications = Application::where('job_seeker_id', $jobSeeker->id)
            ->where('status', 'accepted')
            ->count();
        
        $rejectedApplications = Application::where('job_seeker_id', $jobSeeker->id)
            ->where('status', 'rejected')
            ->count();

        // Get skills count
        $totalSkills = JobSeekerSkill::where('job_seeker_id', $jobSeeker->id)->count();

        // Get recent applications
        $recentApplications = Application::with(['job.company'])
            ->where('job_seeker_id', $jobSeeker->id)
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        // Get recommended jobs (active jobs)
        $recommendedJobs = Job::with('company')
            ->where('status', 'active')
            ->orderBy('created_at', 'desc')
            ->take(6)
            ->get();

        return Inertia::render('JobSeeker/DashboardJobSeeker', [
            'statistics' => [
                'totalApplications' => $totalApplications,
                'pendingApplications' => $pendingApplications,
                'acceptedApplications' => $acceptedApplications,
                'rejectedApplications' => $rejectedApplications,
                'totalSkills' => $totalSkills,
            ],
            'recentApplications' => $recentApplications,
            'recommendedJobs' => $recommendedJobs,
        ]);
    }
}
