<?php

namespace App\Http\Controllers\Company;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Interview;
use App\Models\Application;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;

class InterviewController extends Controller
{
    /**
     * Show form to create/schedule an interview for a specific application.
     */
    public function create($applicationId)
    {
        $company = Auth::user()->company;

        $application = Application::with(['job', 'jobSeeker'])->findOrFail($applicationId);

        // Owner check: only company that owns the job can schedule
        if ($company && isset($application->job->company_id) && $application->job->company_id !== $company->id) {
            abort(403, 'Anda tidak berwenang menjadwalkan interview untuk lamaran ini.');
        }

        // Prepare minimal payload for Inertia
        $data = [
            'id' => $application->id,
            'job' => $application->job ? [
                'id' => $application->job->id,
                'title' => $application->job->title,
            ] : null,
            'job_seeker' => $application->jobSeeker ? [
                'id' => $application->jobSeeker->id,
                'name' => $application->jobSeeker->name ?? optional($application->jobSeeker->user)->name,
                'email' => optional($application->jobSeeker->user)->email,
            ] : null,
        ];

        return Inertia::render('Company/Applicants/ScheduleInterview', [
            'application' => $data,
        ]);
    }

    /**
     * Store a newly scheduled interview.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'application_id' => ['required', 'exists:applications,id'],
            'schedule' => ['required', 'date'],
            'location' => ['required', 'string', 'max:255'],
        ]);

        $company = Auth::user()->company;

        $application = Application::with('job')->findOrFail($validated['application_id']);

        if ($company && isset($application->job->company_id) && $application->job->company_id !== $company->id) {
            abort(403, 'Anda tidak berwenang melakukan tindakan ini.');
        }

        // Only allow creating interviews for applications that are reviewed, shortlisted, or submitted
        $allowedStatuses = ['reviewed', 'shortlisted', 'submitted'];
        if (!in_array($application->status, $allowedStatuses)) {
            return Redirect::back()->withErrors(['schedule' => 'Interview hanya dapat dijadwalkan untuk pelamar yang berstatus submitted, reviewed, atau shortlisted.']);
        }

        $interview = Interview::create([
            'application_id' => $validated['application_id'],
            'schedule' => $validated['schedule'],
            'location' => $validated['location'],
            'status' => 'scheduled',
        ]);

        // Update application status to 'shortlisted' (shortlisted = diundang interview)
        // Note: using 'shortlisted' because 'interview' is not in enum. 'interviewed' is for after interview completed.
        $application->status = 'shortlisted';
        $application->save();

        return redirect('/company/applicants')->with('success', 'Interview berhasil dijadwalkan. Pelamar akan menerima undangan interview.');
    }

    /**
     * Display a listing of interviews for the logged-in company.
     */
    public function index(Request $request)
    {
        $company = Auth::user()->company;

        $query = Interview::with(['application.job', 'application.jobSeeker']);

        if ($company) {
            $query->whereHas('application.job', function ($q) use ($company) {
                $q->where('company_id', $company->id);
            });
        }

        $interviews = $query->orderBy('schedule', 'desc')->get()->map(function ($i) {
            return [
                'id' => $i->id,
                'application_id' => $i->application_id,
                'schedule' => $i->schedule ? $i->schedule->toIsoString() : null,
                'location' => $i->location,
                'status' => $i->status,
                'job' => $i->application && $i->application->job ? [
                    'id' => $i->application->job->id,
                    'title' => $i->application->job->title,
                ] : null,
                'job_seeker' => $i->application && $i->application->jobSeeker ? [
                    'id' => $i->application->jobSeeker->id,
                    'name' => $i->application->jobSeeker->name ?? optional($i->application->jobSeeker->user)->name,
                ] : null,
            ];
        })->values();

        return Inertia::render('Company/Interviews/Index', [
            'interviews' => $interviews,
        ]);
    }

    /**
     * Show start interview page where company can view details and submit result.
     */
    public function start($id)
    {
        $company = Auth::user()->company;

        $interview = Interview::with(['application.job', 'application.jobSeeker'])->findOrFail($id);

        if ($company && isset($interview->application->job->company_id) && $interview->application->job->company_id !== $company->id) {
            abort(403, 'Anda tidak berwenang mengakses interview ini.');
        }

        $data = [
            'id' => $interview->id,
            'application_id' => $interview->application_id,
            'schedule' => $interview->schedule ? $interview->schedule->toIsoString() : null,
            'location' => $interview->location,
            'status' => $interview->status,
            'job' => $interview->application->job ? [
                'id' => $interview->application->job->id,
                'title' => $interview->application->job->title,
            ] : null,
            'job_seeker' => $interview->application->jobSeeker ? [
                'id' => $interview->application->jobSeeker->id,
                'name' => $interview->application->jobSeeker->name ?? optional($interview->application->jobSeeker->user)->name,
                'email' => optional($interview->application->jobSeeker->user)->email,
            ] : null,
            'application_notes' => $interview->application->notes ?? null,
        ];

        return Inertia::render('Company/Interviews/Start', [
            'interview' => $data,
        ]);
    }

    /**
     * Complete interview: save application note, set application status and mark interview completed.
     */
    public function complete(Request $request, $id)
    {
        $validated = $request->validate([
            'action' => ['required', 'in:diterima,offered,ditolak'],
            'notes' => ['nullable', 'string', 'max:2000'],
        ]);

        $company = Auth::user()->company;

        $interview = Interview::with('application.job')->findOrFail($id);

        if ($company && isset($interview->application->job->company_id) && $interview->application->job->company_id !== $company->id) {
            abort(403, 'Anda tidak berwenang melakukan tindakan ini.');
        }

        $application = $interview->application;

        // append note to application.notes
        $existing = $application->notes ?? '';
        $append = trim($validated['notes'] ?? '');
        if ($append !== '') {
            $application->notes = trim($existing . "\n" . $append);
        }

        // map action to application status
        $map = [
            'diterima' => 'accepted', // hired/accepted
            'offered' => 'offered',
            'ditolak' => 'rejected',
        ];

        $application->status = $map[$validated['action']];
        $application->save();

        // mark interview completed
        $interview->status = 'completed';
        $interview->save();

        return Redirect::route('company.interviews.index')->with('success', 'Interview selesai dan status diperbarui.');
    }
}
