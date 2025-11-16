<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Lowongan;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\ValidationException;

class JobController extends Controller
{
    /**
     * GET /admin/jobs/review - List semua lowongan dengan status 'pending_review'
     * KENAPA DIPERLUKAN:
     * - Admin perlu melihat lowongan yang menunggu persetujuan
     * - Dari sini admin bisa approve atau reject
     */
    public function review(Request $request)
    {
        $search = $request->get('search');
        
        // Query lowongan yang status pending_review dengan eager loading company & skills
        $query = Lowongan::with(['company', 'skills'])
                         ->where('status', 'pending_review');

        // Filter by title atau nama perusahaan jika ada search
        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('judul', 'like', '%' . $search . '%')
                  ->orWhereHas('company', function($q_comp) use ($search) {
                      $q_comp->where('nama_perusahaan', 'like', '%' . $search . '%');
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

    /**
     * GET /admin/jobs/{id} - Tampilkan detail satu lowongan
     * KENAPA DIPERLUKAN:
     * - Admin perlu melihat detail lengkap lowongan sebelum decide approve/reject
     * PARAM: $id = id_lowongan (bukan id biasa)
     */
    public function show($id)
    {
        // Cari lowongan by id_lowongan primary key dengan eager loading
        $job = Lowongan::with(['company', 'skills'])
                       ->findOrFail($id);

        return Inertia::render('Admin/Jobs/Review', [
            'jobDetail' => $job,
        ]);
    }

    /**
     * POST /admin/jobs/{id}/approve - Approve lowongan
     * KENAPA DIPERLUKAN:
     * - Setelah admin review & setuju, lowongan bisa dipublikasi
     * - Set status = 'approved' dan posted_date = hari ini (sekarang)
     * PARAM: $id = id_lowongan
     */
    public function approve($id)
    {
        $job = Lowongan::findOrFail($id);

        // Cek apakah lowongan masih dalam status pending_review
        if ($job->status !== 'pending_review') {
            throw ValidationException::withMessages([
                'status' => 'Lowongan sudah tidak dalam status pending review.'
            ]);
        }

        // Update status & set posted_date (hari ini)
        $job->status = 'approved';
        $job->posted_date = now();
        $job->rejection_reason = null; // Hapus alasan tolak jika ada
        $job->save();

        return response()->json([
            'id_lowongan' => $job->id_lowongan,
            'status' => $job->status,
            'posted_date' => $job->posted_date->toDateString(),
            'message' => 'Lowongan berhasil disetujui dan sekarang tampil di job listing!'
        ]);
    }

    /**
     * POST /admin/jobs/{id}/reject - Reject lowongan
     * KENAPA DIPERLUKAN:
     * - Admin bisa tolak lowongan dengan alasan tertentu
     * - Alasan tolak WAJIB diisi dan minimal 10 karakter
     * - Status berubah ke 'rejected'
     * PARAM: $id = id_lowongan
     * BODY: rejection_reason (wajib, min 10 char)
     */
    public function reject(Request $request, $id)
    {
        // Validasi rejection_reason harus ada dan min 10 karakter
        $request->validate([
            'rejection_reason' => 'required|string|min:10|max:1000',
        ]);

        $job = Lowongan::findOrFail($id);

        // Cek apakah lowongan masih dalam status pending_review
        if ($job->status !== 'pending_review') {
            throw ValidationException::withMessages([
                'status' => 'Lowongan sudah tidak dalam status pending review.'
            ]);
        }

        // Update status & alasan tolak
        $job->status = 'rejected';
        $job->rejection_reason = $request->rejection_reason;
        $job->posted_date = null; // Reset posted_date jika ada
        $job->save();

        return response()->json([
            'id_lowongan' => $job->id_lowongan,
            'status' => $job->status,
            'rejection_reason' => $job->rejection_reason,
            'message' => 'Lowongan berhasil ditolak dengan alasan tersimpan.'
        ]);
    }

    /**
     * GET /admin/jobs/history - Lihat riwayat lowongan yang sudah di-review (approved/rejected)
     * KENAPA DIPERLUKAN:
     * - Admin perlu melihat track record persetujuan lowongan
     * - Bisa filter berdasarkan status, tanggal, atau search nama lowongan
     * QUERY PARAMS:
     * - search: cari berdasarkan judul atau nama perusahaan
     * - status: filter status (approved / rejected)
     * - date_from: filter lowongan dari tanggal tertentu
     * - date_to: filter lowongan sampai tanggal tertentu
     */
    public function history(Request $request)
    {
        $search = $request->get('search');
        $status = $request->get('status'); // single status atau kosong
        $dateFrom = $request->get('date_from');
        $dateTo = $request->get('date_to');

        // Query lowongan yang bukan pending_review (sudah di-decide)
        $query = Lowongan::with('company')
                         ->whereIn('status', ['approved', 'rejected']);

        // Filter by search (judul atau nama perusahaan)
        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('judul', 'like', '%' . $search . '%')
                  ->orWhereHas('company', function($q_comp) use ($search) {
                      $q_comp->where('nama_perusahaan', 'like', '%' . $search . '%');
                  });
            });
        }

        // Filter by specific status jika di-pilih
        if ($status && in_array($status, ['approved', 'rejected'])) {
            $query->where('status', $status);
        }

        // Filter by date range (tanggal_posting)
        if ($dateFrom) {
            $query->whereDate('tanggal_posting', '>=', $dateFrom);
        }
        if ($dateTo) {
            $query->whereDate('tanggal_posting', '<=', $dateTo);
        }

        $history = $query->orderBy('tanggal_posting', 'desc')
                         ->paginate(10)
                         ->withQueryString();

        return Inertia::render('Admin/Jobs/ApprovalHistory', [
            'jobs' => $history,
            'filters' => $request->only('search', 'status', 'date_from', 'date_to'),
        ]);
    }
}