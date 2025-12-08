<?php

namespace App\Http\Controllers;

use App\Models\Job;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class PublicJobController extends Controller
{
    /**
     * Display a listing of public (approved) jobs.
     */
    public function index(Request $request)
    {
        $query = Job::where('status', Job::STATUS_APPROVED)
            ->where(function ($q) {
                // expiry_date is null OR expiry_date >= today
                $q->whereNull('expiry_date')
                  ->orWhere('expiry_date', '>=', Carbon::today());
            })
            ->with(['company:id,company_name,photo_path,location', 'skills:id,name']);

        // Search by title
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Filter by location
        if ($request->filled('location')) {
            $query->where('location', 'like', "%{$request->location}%");
        }

        // Filter by job_type
        if ($request->filled('job_type')) {
            $query->where('job_type', $request->job_type);
        }

        // Filter by job_level
        if ($request->filled('job_level')) {
            $query->where('job_level', $request->job_level);
        }

        $jobs = $query->orderBy('posted_date', 'desc')
            ->orderBy('created_at', 'desc')
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('Jobs/Index', [
            'jobs' => $jobs,
            'filters' => $request->only(['search', 'location', 'job_type', 'job_level']),
        ]);
    }

    /**
     * Display the specified job.
     * Security: Returns 404 if job is not approved or has expired.
     */
    public function show(Job $job)
    {
        // Security check: Only show approved jobs that haven't expired
        $isApproved = $job->status === Job::STATUS_APPROVED;
        $isNotExpired = is_null($job->expiry_date) || Carbon::parse($job->expiry_date)->gte(Carbon::today());

        if (!$isApproved || !$isNotExpired) {
            abort(404);
        }

        $job->load(['company:id,company_name,photo_path,location,industry,description,website', 'skills:id,name']);

        return Inertia::render('Jobs/Show', [
            'job' => $job,
        ]);
    }
}
