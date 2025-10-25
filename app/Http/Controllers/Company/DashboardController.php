<?php

namespace App\Http\Controllers\Company;

use App\Http\Controllers\Controller;
use App\Models\Job;
use App\Models\Application;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    /**
     * Display the company dashboard with statistics.
     */
    public function index()
    {
        $company = Auth::user()->company;

        // Get job statistics
        $totalJobs = Job::where('company_id', $company->id)->count();
        $activeJobs = Job::where('company_id', $company->id)
            ->where('status', 'active')
            ->count();
        $closedJobs = Job::where('company_id', $company->id)
            ->where('status', 'closed')
            ->count();

        // Get applications statistics
        $totalApplications = Application::whereHas('job', function ($query) use ($company) {
            $query->where('company_id', $company->id);
        })->count();

        $pendingApplications = Application::whereHas('job', function ($query) use ($company) {
            $query->where('company_id', $company->id);
        })->where('status', 'pending')->count();

        $acceptedApplications = Application::whereHas('job', function ($query) use ($company) {
            $query->where('company_id', $company->id);
        })->where('status', 'accepted')->count();

        // Get recent applications
        $recentApplications = Application::with(['jobSeeker.user', 'job'])
            ->whereHas('job', function ($query) use ($company) {
                $query->where('company_id', $company->id);
            })
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        // Get active jobs list
        $activeJobsList = Job::where('company_id', $company->id)
            ->where('status', 'active')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        return Inertia::render('Company/DashboardCompany', [
            'statistics' => [
                'totalJobs' => $totalJobs,
                'activeJobs' => $activeJobs,
                'closedJobs' => $closedJobs,
                'totalApplications' => $totalApplications,
                'pendingApplications' => $pendingApplications,
                'acceptedApplications' => $acceptedApplications,
            ],
            'recentApplications' => $recentApplications,
            'activeJobs' => $activeJobsList,
        ]);
    }
}
