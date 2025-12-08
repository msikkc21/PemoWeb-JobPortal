<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Job;
use Illuminate\Http\Request;
use Inertia\Inertia;

class JobController extends Controller
{
    /**
     * Display a listing of pending jobs for review.
     */
    public function index()
    {
        $jobs = Job::where('status', Job::STATUS_PENDING_REVIEW)
            ->with(['company:id,company_name,photo_path'])
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('Admin/Jobs/Index', [
            'jobs' => $jobs,
        ]);
    }

    /**
     * Display the specified job for review.
     */
    public function show(Job $job)
    {
        $job->load(['company:id,company_name,photo_path,description', 'skills']);

        return Inertia::render('Admin/Jobs/Review', [
            'job' => $job,
        ]);
    }

    /**
     * Approve the specified job.
     */
    public function approve(Job $job)
    {
        $job->update([
            'status' => Job::STATUS_APPROVED,
            'rejection_reason' => null,
        ]);

        return redirect()->route('admin.jobs.pending')
            ->with('success', 'Lowongan berhasil disetujui dan telah dipublikasikan.');
    }

    /**
     * Reject the specified job with a reason.
     */
    public function reject(Request $request, Job $job)
    {
        $request->validate([
            'rejection_reason' => 'required|string|min:10|max:1000',
        ], [
            'rejection_reason.required' => 'Alasan penolakan wajib diisi.',
            'rejection_reason.min' => 'Alasan penolakan minimal 10 karakter.',
            'rejection_reason.max' => 'Alasan penolakan maksimal 1000 karakter.',
        ]);

        $job->update([
            'status' => 'rejected',
            'rejection_reason' => $request->rejection_reason,
        ]);

        return redirect()->route('admin.jobs.pending')
            ->with('success', 'Lowongan berhasil ditolak.');
    }
}
