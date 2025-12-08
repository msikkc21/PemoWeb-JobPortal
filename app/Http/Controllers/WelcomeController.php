<?php

namespace App\Http\Controllers;

use App\Models\Job;
use App\Models\Company;
use App\Models\User;
use App\Models\Skill;
use Carbon\Carbon;
use Inertia\Inertia;

class WelcomeController extends Controller
{
    public function index()
    {
        // Dynamic statistics
        $activeJobs = Job::where('status', Job::STATUS_APPROVED)
            ->where(function ($q) {
                $q->whereNull('expiry_date')
                  ->orWhere('expiry_date', '>=', Carbon::today());
            })
            ->count();

        $totalCompanies = Company::count();
        $totalJobSeekers = User::whereHas('role', fn($q) => $q->where('name', 'jobseeker'))->count();

        // Featured/recent jobs for display
        $featuredJobs = Job::where('status', Job::STATUS_APPROVED)
            ->where(function ($q) {
                $q->whereNull('expiry_date')
                  ->orWhere('expiry_date', '>=', Carbon::today());
            })
            ->with(['company:id,company_name,photo_path,location'])
            ->orderBy('posted_date', 'desc')
            ->take(6)
            ->get(['id', 'title', 'location', 'job_type', 'salary_min', 'salary_max', 'company_id', 'posted_date']);

        // Popular skills/categories with job counts
        $popularSkills = Skill::withCount(['jobs' => function ($q) {
                $q->where('status', Job::STATUS_APPROVED)
                  ->where(function ($sq) {
                      $sq->whereNull('expiry_date')
                        ->orWhere('expiry_date', '>=', Carbon::today());
                  });
            }])
            ->having('jobs_count', '>', 0)
            ->orderBy('jobs_count', 'desc')
            ->take(6)
            ->get(['id', 'name']);

        return Inertia::render('Welcome', [
            'statistics' => [
                'activeJobs' => $activeJobs,
                'totalCompanies' => $totalCompanies,
                'totalJobSeekers' => $totalJobSeekers,
            ],
            'featuredJobs' => $featuredJobs,
            'popularSkills' => $popularSkills,
        ]);
    }
}
