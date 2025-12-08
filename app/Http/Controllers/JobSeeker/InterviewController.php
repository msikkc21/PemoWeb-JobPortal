<?php

namespace App\Http\Controllers\JobSeeker;

use App\Http\Controllers\Controller;
use App\Models\Interview;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class InterviewController extends Controller
{
    /**
     * Display a listing of interviews for the current job seeker.
     */
    public function index()
    {
        $user = Auth::user();
        $jobSeeker = $user->jobSeeker;

        if (!$jobSeeker) {
            return redirect('/jobseeker/onboarding')
                ->with('error', 'Silakan lengkapi profil terlebih dahulu.');
        }

        // Fetch interviews where application belongs to this job seeker
        $interviews = Interview::with(['application.job.company'])
            ->whereHas('application', function ($query) use ($jobSeeker) {
                $query->where('job_seeker_id', $jobSeeker->id);
            })
            ->orderByRaw("CASE WHEN status = 'scheduled' THEN 0 WHEN status = 'rescheduled' THEN 1 ELSE 2 END")
            ->orderBy('schedule', 'asc')
            ->get()
            ->map(function ($interview) {
                return [
                    'id' => $interview->id,
                    'schedule' => $interview->schedule ? $interview->schedule->toIsoString() : null,
                    'location' => $interview->location,
                    'status' => $interview->status,
                    'job' => $interview->application?->job ? [
                        'id' => $interview->application->job->id,
                        'title' => $interview->application->job->title,
                    ] : null,
                    'company' => $interview->application?->job?->company ? [
                        'id' => $interview->application->job->company->id,
                        'name' => $interview->application->job->company->company_name,
                    ] : null,
                ];
            });

        return Inertia::render('JobSeeker/Interviews/Index', [
            'interviews' => $interviews,
        ]);
    }
}
