<?php

namespace App\Http\Controllers\Company;

use Inertia\Inertia;
use App\Models\Application;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Models\Job;

class ApplicantController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $company = Auth::user()->company;
        $search = $request->input('search');
        $status = $request->input('status');

        $query = Application::with(['job', 'jobSeeker'])
            ->whereHas('job', function ($q) use ($company) {
                $q->where('company_id', $company->id);
            });
        
        // Filter by applicant name (jobSeeker -> user -> name)
        if (!empty($search)) {
            $query->whereHas('jobSeeker', function ($q) use ($search) {
                $q->where('name', 'like', '%' . $search . '%');
            });
        }

        // filter by status
        if (!empty($status)) {
            $query->where('status', $status);
        }

        // ambil hasil (tanpa pagination) dan urutkan berdasarkan application_date desc
        $applications = $query->orderBy('application_date', 'desc')->get();

        $totalAplications = $applications->count();

        return Inertia::render('Company/Applicants/Index', [
            'applications' => $applications,
            'totalApplications' => $totalAplications,
            'filters' => [
                'search' => $search,
                'status' => $status,
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $company = Auth::user()->company;

        $application = Application::with([
            'job',                     // job_post
            'resume',                  // resume
            'jobSeeker',               // job seeker and associated user
            'jobSeeker.skills'         // job seeker skills pivot (level, experience_years)
        ])->findOrFail($id);

        // Owner check: only company that owns the job can view
        if ($company && isset($application->job->company_id) && $application->job->company_id !== $company->id) {
            abort(403, 'Anda tidak berwenang melihat lamaran ini.');
        }

        // Map for Inertia (avoid sending heavy relations)
        $data = [
            'id' => $application->id,
            'status' => $application->status,
            'application_date' => $application->application_date,
            'notes' => $application->notes,
            'created_at' => $application->created_at,
            'job' => $application->job ? [
                'id' => $application->job->id,
                'title' => $application->job->title ?? $application->job->name ?? null,
                'company_id' => $application->job->company_id ?? null,
                'location' => $application->job->location ?? null,
                'job_type' => $application->job->job_type ?? null,
            ] : null,
            'resume' => $application->resume ? [
                'id' => $application->resume->id,
                'cv_file' => $application->resume->cv_file,
                'upload_date' => $application->resume->upload_date,
                'parsed_data' => $application->resume->parsed_data,
            ] : null,
            'job_seeker' => $application->jobSeeker ? [
                'id' => $application->jobSeeker->id,
                'name' => $application->jobSeeker->name ?? optional($application->jobSeeker->user)->name,
                'email' => optional($application->jobSeeker->user)->email,
                'phone' => $application->jobSeeker->phone ?? null,
                'birth_date' => $application->jobSeeker->birth_date ?? null,
                'education' => $application->jobSeeker->education ?? null,
                'experience' => $application->jobSeeker->experience ?? null,
                'address' => $application->jobSeeker->address ?? null,
                'linkedin' => $application->jobSeeker->linkedin ?? null,
                'github' => $application->jobSeeker->github ?? null,
                'portfolio' => $application->jobSeeker->portfolio ?? null,
                'skills' => $application->jobSeeker->skills ? $application->jobSeeker->skills->map(function($s){
                    return [
                        'id' => $s->id,
                        'name' => $s->name ?? $s->nama_keahlian ?? null,
                        'pivot' => [
                            'level' => $s->pivot->level ?? null,
                            'experience_years' => $s->pivot->experience_years ?? null,
                        ]
                    ];
                })->values() : []
            ] : null,
        ];

        return Inertia::render('Company/Applicants/Show', [
            'application' => $data,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    /**
     * Update application status (quick action by company).
     */
    public function updateStatus(Request $request, string $id)
    {
        $company = Auth::user()->company;

        $application = Application::with('job')->findOrFail($id);

        if ($company && isset($application->job->company_id) && $application->job->company_id !== $company->id) {
            abort(403, 'Anda tidak berwenang melakukan tindakan ini.');
        }

        $validated = $request->validate([
            'status' => ['required', 'string', 'in:reviewed,shortlisted,interviewed,accepted,rejected,in_process']
        ]);

        $application->status = $validated['status'];
        $application->save();

        return redirect()->back()->with('success', 'Status lamaran diperbarui.');
    }

    /**
     * List all applicants for a specific job owned by the authenticated company.
     */
    public function jobApplicants(Job $job)
    {
        $company = Auth::user()->company;

        // Authorization: ensure the job belongs to this company
        if (!$company || $job->company_id !== $company->id) {
            abort(403, 'Anda tidak berwenang melihat pelamar untuk lowongan ini.');
        }

        // Pull applications for this job with job seeker basic info
        $applications = Application::with(['jobSeeker'])
            ->where('job_id', $job->id)
            ->orderBy('application_date', 'desc')
            ->get()
            ->map(function ($app) {
                return [
                    'id' => $app->id,
                    'status' => $app->status,
                    'application_date' => $app->application_date,
                    'job_seeker' => $app->jobSeeker ? [
                        'id' => $app->jobSeeker->id,
                        'name' => $app->jobSeeker->name ?? optional($app->jobSeeker->user)->name,
                        'email' => optional($app->jobSeeker->user)->email,
                    ] : null,
                ];
            });

        return Inertia::render('Company/Applicants/ByJob', [
            'job' => [
                'id' => $job->id,
                'title' => $job->title,
                'status' => $job->status,
            ],
            'applications' => $applications,
            'totalApplications' => $applications->count(),
        ]);
    }
}
