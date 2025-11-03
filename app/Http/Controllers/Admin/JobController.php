<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\JobPost; // Pakai model JobPost
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\ValidationException;

class JobController extends Controller
{
    // GET /admin/jobs/review (List Pending)
    public function reviewIndex(Request $request)
    {
        $search = $request->get('search');
        $query = JobPost::with('company')->where('status', 'pending_review');

        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('title', 'like', '%' . $search . '%')
                  ->orWhereHas('company', function($q_comp) use ($search) {
                      $q_comp->where('name', 'like', '%' . $search . '%');
                  });
            });
        }

        $jobs = $query->orderBy('created_at', 'desc')
                      ->paginate(10)
                      ->withQueryString();

        return Inertia::render('Admin/Jobs/Review', [
            'jobs' => $jobs,
            'filters' => $request->only('search'),
        ]);
    }

    // GET /admin/jobs/{jobPost} (Detail)
    public function show(JobPost $jobPost)
    {
        // Pastikan eager loading company dan skills untuk detail
        $jobPost->load(['company', 'skills']);

        return Inertia::render('Admin/Jobs/Review', [
            'jobDetail' => $jobPost,
        ]);
    }

    // POST /admin/jobs/{jobPost}/approve
    public function approve(JobPost $jobPost)
    {
        // Cek status saat ini
        if ($jobPost->status !== 'pending_review') {
             throw ValidationException::withMessages(['status' => 'Lowongan sudah tidak dalam status pending review.']);
        }

        $jobPost->status = 'approved';
        $jobPost->posted_date = now(); // Isi tanggal posting hari ini
        $jobPost->rejection_reason = null; // Bersihkan alasan tolak jika ada
        $jobPost->save();

        return response()->json([
            'id' => $jobPost->id,
            'status' => $jobPost->status,
            'posted_date' => $jobPost->posted_date->toDateString(),
        ]);
    }

    // POST /admin/jobs/{jobPost}/reject
    public function reject(Request $request, JobPost $jobPost)
    {
        // Validasi wajib isi rejection_reason
        $request->validate([
            'rejection_reason' => 'required|string|min:10',
        ]);

        // Cek status saat ini
        if ($jobPost->status !== 'pending_review') {
             throw ValidationException::withMessages(['status' => 'Lowongan sudah tidak dalam status pending review.']);
        }

        $jobPost->status = 'rejected';
        $jobPost->rejection_reason = $request->rejection_reason;
        $jobPost->save();

        return response()->json([
            'id' => $jobPost->id,
            'status' => $jobPost->status,
        ]);
    }

    // GET /admin/jobs/history (Riwayat Approved/Rejected)
    public function historyIndex(Request $request)
    {
        $status = $request->get('status', ['approved', 'rejected']); // Filter status by default
        $startDate = $request->get('start_date');
        $endDate = $request->get('end_date');

        $query = JobPost::with('company')
                        ->whereIn('status', (array) $status);

        // Filter Tanggal (contoh filter berdasarkan created_at atau posted_date)
        if ($startDate) {
            $query->whereDate('posted_date', '>=', $startDate);
        }
        if ($endDate) {
            $query->whereDate('posted_date', '<=', $endDate);
        }

        $history = $query->orderBy('posted_date', 'desc')
                         ->paginate(10)
                         ->withQueryString();

        return Inertia::render('Admin/Jobs/ApprovalHistory', [
            'history' => $history,
            'filters' => $request->only('status', 'start_date', 'end_date'),
        ]);
    }
}