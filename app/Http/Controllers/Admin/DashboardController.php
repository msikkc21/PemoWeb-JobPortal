<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Company;
use App\Models\JobSeeker;
use App\Models\Job;
use App\Models\Application;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display the admin dashboard with statistics.
     */
    public function index()
    {
        // Get user statistics
        $totalUsers = User::count();
        $totalCompanies = Company::count();
        $totalJobSeekers = JobSeeker::count();

        // Get job statistics
        $totalJobs = Job::count();
        $activeJobs = Job::where('status', 'active')->count();
        $closedJobs = Job::where('status', 'closed')->count();

        // Get application statistics
        $totalApplications = Application::count();
        $pendingApplications = Application::where('status', 'pending')->count();
        $acceptedApplications = Application::where('status', 'accepted')->count();
        $rejectedApplications = Application::where('status', 'rejected')->count();

        // Get recent users
        $recentUsers = User::with('role')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        // Get recent jobs
        $recentJobs = Job::with('company')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        return Inertia::render('Admin/DashboardAdmin', [
            'statistics' => [
                'totalUsers' => $totalUsers,
                'totalCompanies' => $totalCompanies,
                'totalJobSeekers' => $totalJobSeekers,
                'totalJobs' => $totalJobs,
                'activeJobs' => $activeJobs,
                'closedJobs' => $closedJobs,
                'totalApplications' => $totalApplications,
                'pendingApplications' => $pendingApplications,
                'acceptedApplications' => $acceptedApplications,
                'rejectedApplications' => $rejectedApplications,
            ],
            'recentUsers' => $recentUsers,
            'recentJobs' => $recentJobs,
        ]);
    }
}
