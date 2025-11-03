<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\{
    DashboardController,
    SkillController,
    JobController
};

Route::prefix('admin')
    ->middleware(['auth', 'check.permission:admin'])
    ->group(function () {

        // ====== DASHBOARD ======
        // GET /admin/dashboard
        Route::get('/dashboard', [DashboardController::class, 'index'])
            ->name('admin.dashboard');

        // ====== SKILLS CRUD ======
        // GET /admin/skills -> daftar & pencarian
        Route::get('/skills', [SkillController::class, 'index'])->name('admin.skills.index');
        // POST /admin/skills -> tambah skill
        Route::post('/skills', [SkillController::class, 'store'])->name('admin.skills.store');
        // GET /admin/skills/{id}/edit -> form edit skill
        Route::get('/skills/{id}/edit', [SkillController::class, 'edit'])->name('admin.skills.edit');
        // PUT /admin/skills/{id} -> update skill
        Route::put('/skills/{id}', [SkillController::class, 'update'])->name('admin.skills.update');
        // DELETE /admin/skills/{id} -> hapus skill
        Route::delete('/skills/{id}', [SkillController::class, 'destroy'])->name('admin.skills.destroy');

        // ====== JOB REVIEW ======
        // GET /admin/jobs/review -> list job pending_review
        Route::get('/jobs/review', [JobController::class, 'review'])->name('admin.jobs.review');
        // GET /admin/jobs/{id} -> detail job
        Route::get('/jobs/{id}', [JobController::class, 'show'])->name('admin.jobs.show');
        // POST /admin/jobs/{id}/approve -> ubah status jadi approved
        Route::post('/jobs/{id}/approve', [JobController::class, 'approve'])->name('admin.jobs.approve');
        // POST /admin/jobs/{id}/reject -> ubah status jadi rejected (wajib alasan)
        Route::post('/jobs/{id}/reject', [JobController::class, 'reject'])->name('admin.jobs.reject');
        // GET /admin/jobs/history -> daftar job yang sudah di-review
        Route::get('/jobs/history', [JobController::class, 'history'])->name('admin.jobs.history');
    });
