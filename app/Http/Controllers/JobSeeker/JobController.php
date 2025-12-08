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
     * Display a listing of approved jobs with skill matching.
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        $jobSeeker = $user ? $user->jobSeeker : null;
        $jobSeekerSkillIds = [];
        
        if ($jobSeeker) {
            $jobSeeker->load('skills');
            $jobSeekerSkillIds = $jobSeeker->skills->pluck('id')->toArray();
        }

        $query = Job::with(['company', 'skills'])->active();

        // Search by keyword (title, description, location, company name)
        $search = $request->input('search');
        if (!empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', '%' . $search . '%')
                  ->orWhere('description', 'like', '%' . $search . '%')
                  ->orWhere('location', 'like', '%' . $search . '%')
                  ->orWhereHas('company', function ($cq) use ($search) {
                      $cq->where('company_name', 'like', '%' . $search . '%');
                  });
            });
        }

        // filter berdasarkan skill_id (jika diberikan)
        if ($request->has('skill_id') && $request->skill_id) {
            $skillId = $request->skill_id;
            $query->whereHas('skills', function ($q) use ($skillId) {
                $q->where('skills.id', $skillId);
            });
        }

        // Get all jobs first (without pagination for sorting)
        $allJobs = $query->latest()->get();
        
        // Calculate match percentage for each job
        $jobsWithMatch = $allJobs->map(function ($job) use ($jobSeekerSkillIds) {
            $jobSkillIds = $job->skills->pluck('id')->toArray();
            $matchCount = count(array_intersect($jobSeekerSkillIds, $jobSkillIds));
            $totalJobSkills = count($jobSkillIds);
            
            $matchPercentage = $totalJobSkills > 0 
                ? round(($matchCount / $totalJobSkills) * 100) 
                : 0;
            
            $job->matchPercentage = $matchPercentage;
            $job->matchingSkills = $matchCount;
            $job->totalSkills = $totalJobSkills;
            
            return $job;
        });

        // Sort by match percentage (highest first), then by created_at (newest)
        $sortedJobs = $jobsWithMatch->sortByDesc(function ($job) {
            return [$job->matchPercentage, $job->created_at];
        })->values();

        // Manual pagination
        $page = $request->input('page', 1);
        $perPage = 10;
        $total = $sortedJobs->count();
        $paginatedJobs = $sortedJobs->slice(($page - 1) * $perPage, $perPage)->values();

        $skills = Skill::orderBy('name')->get();

        return inertia('JobSeeker/Jobs/List', [
            'jobs' => [
                'data' => $paginatedJobs,
                'current_page' => (int) $page,
                'last_page' => ceil($total / $perPage),
                'per_page' => $perPage,
                'total' => $total,
            ],
            'skills' => $skills,
            'selectedSkill' => $request->skill_id ?? null,
            'search' => $search ?? '',
            'jobSeekerSkills' => $jobSeekerSkillIds,
        ]);
    }

    /**
     * Display the specified job detail.
     */
    public function show($id)
    {
        $job = Job::with(['company', 'skills'])->findOrFail($id);

        $user = Auth::user();
        $jobSeeker = $user ? $user->jobSeeker : null;
        
        // cek apakah user sudah pernah melamar
        $hasApplied = false;
        $matchPercentage = 0;
        $matchingSkills = [];
        
        if ($jobSeeker) {
            $hasApplied = \App\Models\Application::where('job_id', $job->id)
                ->where('job_seeker_id', $jobSeeker->id)
                ->exists();
            
            // Calculate match
            $jobSeeker->load('skills');
            $jobSeekerSkillIds = $jobSeeker->skills->pluck('id')->toArray();
            $jobSkillIds = $job->skills->pluck('id')->toArray();
            $matchCount = count(array_intersect($jobSeekerSkillIds, $jobSkillIds));
            $totalJobSkills = count($jobSkillIds);
            
            $matchPercentage = $totalJobSkills > 0 
                ? round(($matchCount / $totalJobSkills) * 100) 
                : 0;
            
            // Get matching skill names
            $matchingSkills = $job->skills->filter(function ($skill) use ($jobSeekerSkillIds) {
                return in_array($skill->id, $jobSeekerSkillIds);
            })->values();
        }

        return inertia('JobSeeker/Jobs/Detail', [
            'job' => $job,
            'hasApplied' => $hasApplied,
            'matchPercentage' => $matchPercentage,
            'matchingSkills' => $matchingSkills,
        ]);
    }
}
