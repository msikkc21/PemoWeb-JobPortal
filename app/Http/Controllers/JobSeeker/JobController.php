<?php

namespace App\Http\Controllers\JobSeeker;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Job;
use App\Models\Skill;
use Illuminate\Support\Facades\Auth;

class JobController extends Controller
{
    /**
     * Display a listing of approved jobs, optionally filtered by skill.
     */
    public function index(Request $request)
    {
        $query = Job::with(['company', 'skills'])->active();

        // filter berdasarkan skill_id (jika diberikan)
        if ($request->has('skill_id') && $request->skill_id) {
            $skillId = $request->skill_id;
            $query->whereHas('skills', function ($q) use ($skillId) {
                $q->where('skills.id', $skillId);
            });
        }

        // hasil paginated
        $jobs = $query->latest()->paginate(10);
        $skills = Skill::all();

        return inertia('JobSeeker/Jobs/List', [
            'jobs' => $jobs,
            'skills' => $skills,
            'selectedSkill' => $request->skill_id ?? null,
        ]);
    }

    /**
     * Display the specified job detail.
     */
    public function show($id)
    {
        $job = Job::with(['company', 'skills'])->findOrFail($id);

        // cek apakah user sudah pernah melamar
        $hasApplied = false;
        if (Auth::check()) {
            $user = Auth::user();
            if (method_exists($user, 'applications')) {
                $hasApplied = $user->applications()->where('job_id', $job->id)->exists();
            }
        }

        return inertia('JobSeeker/Jobs/Detail', [
            'job' => $job,
            'hasApplied' => $hasApplied,
        ]);
    }
}
