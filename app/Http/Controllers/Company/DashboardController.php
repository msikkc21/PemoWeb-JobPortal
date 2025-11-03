<?php

namespace App\Http\Controllers\Company;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Job;
use Illuminate\Support\Arr;

class DashboardController extends Controller
{
    /**
     * Show company dashboard with statistics derived from jobs feature.
     */
    public function index(Request $request)
    {
        $user = auth()->user();

        // determine company id from user relation or direct column
        $companyId = $user->company_id ?? ($user->company->id ?? null);
        // Get job statistics
        $totalJobs = Job::where('company_id', $companyId)->count();
        $activeJobs = Job::where('company_id', $companyId)
            ->where('status', 'approved')
            ->count();
        $closedJobs = Job::where('company_id', $companyId)
            ->where('status', 'closed')
            ->count();

        if (! $companyId) {
            // if user has no company, render dashboard with empty/zero data
            $statistics = [
                'totalJobs' => 0,
                'activeJobs' => 0,
                'pendingApplications' => 0,
                'acceptedApplications' => 0,
                'closedJobs' => 0,
                'totalApplications' => 0,
            ];

            return Inertia::render('Company/DashboardCompany', [
                // send auth in the same shape the frontend expects
                'auth' => ['user' => $user],
                'statistics' => $statistics,
                'recentApplications' => [],
                'activeJobs' => [],
            ]);
        }

        // basic job statistics for this company
        $jobsQuery = Job::where('company_id', $companyId);

        $totalJobs = (int) $jobsQuery->count();
        $activeJobsCount = (int) $jobsQuery->whereIn('status', [Job::STATUS_APPROVED, Job::STATUS_OPEN])->count();
        $closedJobsCount = (int) $jobsQuery->where('status', Job::STATUS_CLOSED)->count();

        // recent active jobs (limit 5)
        $activeJobs = Job::where('company_id', $companyId)
            ->whereIn('status', [Job::STATUS_APPROVED, Job::STATUS_OPEN])
            ->orderByDesc('created_at')
            ->limit(5)
            ->get(['id', 'title', 'location', 'status', 'created_at']);

        // Applications statistics (if model exists)
        $totalApplications = 0;
        $pendingApplications = 0;
        $acceptedApplications = 0;
        $recentApplications = [];

        if (class_exists(\App\Models\Application::class)) {
            $appModel = \App\Models\Application::class;

            // total applications for company's jobs
            $totalApplications = (int) $appModel::whereHas('job', function ($q) use ($companyId) {
                $q->where('company_id', $companyId);
            })->count();

            // pending / accepted counts
            $pendingApplications = (int) $appModel::whereHas('job', function ($q) use ($companyId) {
                $q->where('company_id', $companyId);
            })->where('status', 'pending')->count();

            $acceptedApplications = (int) $appModel::whereHas('job', function ($q) use ($companyId) {
                $q->where('company_id', $companyId);
            })->where('status', 'accepted')->count();

            // recent applications
            $recentApplications = $appModel::whereHas('job', function ($q) use ($companyId) {
                    $q->where('company_id', $companyId);
                })
                ->with(['job', 'jobSeeker.user'])
                ->orderByDesc('created_at')
                ->limit(6)
                ->get();
        }

        $statistics = [
            'totalJobs' => $totalJobs,
            'activeJobs' => $activeJobsCount,
            'pendingApplications' => $pendingApplications,
            'acceptedApplications' => $acceptedApplications,
            'closedJobs' => $closedJobsCount,
            'totalApplications' => $totalApplications,
        ];
        // Get active jobs list
        $activeJobsList = Job::where('company_id', $companyId)
            ->where('status', 'approved')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        return Inertia::render('Company/DashboardCompany', [
            // send auth in the same shape the frontend expects
            'auth' => ['user' => $user],
            'statistics' => $statistics,
            'recentApplications' => $recentApplications,
            'activeJobs' => $activeJobs,
        ]);
    }
}
