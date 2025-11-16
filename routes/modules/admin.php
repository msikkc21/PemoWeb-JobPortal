<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\{
    DashboardController,
    SkillController,
    JobController
};

/**
 * ADMIN ROUTES
 * 
 * Prefix: /admin
 * Middleware: auth (user harus login), check.permission:admin (user harus punya role admin)
 * 
 * KENAPA MIDDLEWARE INI PENTING:
 * - 'auth': Pastikan hanya user login yang bisa akses
 * - 'check.permission:admin': Pastikan hanya admin yang bisa akses admin panel
 */
Route::prefix('admin')
    ->middleware(['auth', 'check.permission:admin'])
    ->group(function () {
        
        // ===== DASHBOARD ADMIN =====
        /**
         * GET /admin/dashboard
         * FUNGSI: Tampilkan statistik admin (total perusahaan, lowongan, lamaran, pending review)
         */
        Route::get('/dashboard', [DashboardController::class, 'index'])
            ->name('admin.dashboard');


        // ===== SKILLS CRUD =====
        /**
         * GET /admin/skills
         * FUNGSI: Tampilkan list semua skills dengan pagination & search
         */
        Route::get('/skills', [SkillController::class, 'index'])
            ->name('admin.skills.index');
        
        /**
         * POST /admin/skills
         * FUNGSI: Buat skill baru
         * BODY: nama_keahlian (required, unique), kategori, deskripsi
         */
        Route::post('/skills', [SkillController::class, 'store'])
            ->name('admin.skills.store');
        
        /**
         * GET /admin/skills/{id}/edit
         * FUNGSI: Tampilkan form edit skill dengan data lama
         * PARAM: id = skill id
         */
        Route::get('/skills/{id}/edit', [SkillController::class, 'edit'])
            ->name('admin.skills.edit');
        
        /**
         * PUT /admin/skills/{id}
         * FUNGSI: Update skill yang sudah ada
         * PARAM: id = skill id
         * BODY: nama_keahlian, kategori, deskripsi
         */
        Route::put('/skills/{id}', [SkillController::class, 'update'])
            ->name('admin.skills.update');
        
        /**
         * DELETE /admin/skills/{id}
         * FUNGSI: Hapus skill (dengan validasi agar tidak menghapus skill yang masih dipakai)
         * PARAM: id = skill id
         */
        Route::delete('/skills/{id}', [SkillController::class, 'destroy'])
            ->name('admin.skills.destroy');


        // ===== JOB REVIEW & HISTORY =====
        /**
         * GET /admin/jobs/review
         * FUNGSI: Tampilkan daftar lowongan dengan status 'pending_review'
         * Query params: search (search by judul / nama perusahaan)
         */
        Route::get('/jobs/review', [JobController::class, 'review'])
            ->name('admin.jobs.review');
        
        /**
         * GET /admin/jobs/{id}
         * FUNGSI: Tampilkan detail satu lowongan lengkap
         * PARAM: id = id_lowongan (PRIMARY KEY dari table lowongans)
         */
        Route::get('/jobs/{id}', [JobController::class, 'show'])
            ->name('admin.jobs.show');
        
        /**
         * POST /admin/jobs/{id}/approve
         * FUNGSI: Approve lowongan (ubah status jadi 'approved' & set tanggal_posting)
         * PARAM: id = id_lowongan
         */
        Route::post('/jobs/{id}/approve', [JobController::class, 'approve'])
            ->name('admin.jobs.approve');
        
        /**
         * POST /admin/jobs/{id}/reject
         * FUNGSI: Reject lowongan (ubah status jadi 'rejected' & simpan alasan)
         * PARAM: id = id_lowongan
         * BODY: rejection_reason (required, min 10 char)
         */
        Route::post('/jobs/{id}/reject', [JobController::class, 'reject'])
            ->name('admin.jobs.reject');
        
        /**
         * GET /admin/jobs/history
         * FUNGSI: Tampilkan riwayat lowongan yang sudah di-review (approved/rejected)
         * Query params: 
         * - search: cari by judul / nama perusahaan
         * - status: filter by status (approved atau rejected)
         * - date_from: filter dari tanggal
         * - date_to: filter sampai tanggal
         */
        Route::get('/jobs/history', [JobController::class, 'history'])
            ->name('admin.jobs.history');
    });
