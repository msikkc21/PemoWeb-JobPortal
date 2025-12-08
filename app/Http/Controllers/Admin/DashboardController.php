<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Company;
use App\Models\JobSeeker;
use App\Models\Job;
use App\Models\Application;
use App\Models\Interview;
use Inertia\Inertia;
use Carbon\Carbon;

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
        $pendingJobs = Job::where('status', 'pending')->count();
        $closedJobs = Job::where('status', 'closed')->count();

        // Get application statistics (using correct ENUM values)
        $totalApplications = Application::count();
        $submittedApplications = Application::where('status', 'submitted')->count();
        $inProcessApplications = Application::where('status', 'in_process')->count();
        $shortlistedApplications = Application::where('status', 'shortlisted')->count();
        $interviewedApplications = Application::where('status', 'interviewed')->count();
        $offeredApplications = Application::where('status', 'offered')->count();
        $acceptedApplications = Application::where('status', 'accepted')->count();
        $rejectedApplications = Application::where('status', 'rejected')->count();

        // Get interview statistics
        $totalInterviews = Interview::count();
        $scheduledInterviews = Interview::where('status', 'scheduled')->count();
        $completedInterviews = Interview::where('status', 'completed')->count();

        // This week stats
        $startOfWeek = Carbon::now()->startOfWeek();
        $newUsersThisWeek = User::where('created_at', '>=', $startOfWeek)->count();
        $newJobsThisWeek = Job::where('created_at', '>=', $startOfWeek)->count();
        $newApplicationsThisWeek = Application::where('created_at', '>=', $startOfWeek)->count();

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

        // Get recent applications
        $recentApplications = Application::with(['jobSeeker', 'job.company'])
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
                'pendingJobs' => $pendingJobs,
                'closedJobs' => $closedJobs,
                'totalApplications' => $totalApplications,
                'submittedApplications' => $submittedApplications,
                'inProcessApplications' => $inProcessApplications,
                'shortlistedApplications' => $shortlistedApplications,
                'interviewedApplications' => $interviewedApplications,
                'offeredApplications' => $offeredApplications,
                'acceptedApplications' => $acceptedApplications,
                'rejectedApplications' => $rejectedApplications,
                'totalInterviews' => $totalInterviews,
                'scheduledInterviews' => $scheduledInterviews,
                'completedInterviews' => $completedInterviews,
                'newUsersThisWeek' => $newUsersThisWeek,
                'newJobsThisWeek' => $newJobsThisWeek,
                'newApplicationsThisWeek' => $newApplicationsThisWeek,
            ],
            'recentUsers' => $recentUsers,
            'recentJobs' => $recentJobs,
            'recentApplications' => $recentApplications,
        ]);
    }
}

