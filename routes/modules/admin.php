<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Admin\JobController as AdminJobController;
use App\Http\Controllers\Admin\SkillController as AdminSkillController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\Admin\DashboardController;

/*
================
ADMIN ROUTES
================
Routes untuk role Admin
*/

Route::middleware(['auth', 'check.permission:admin'])->group(function () {
    // Dashboard
    Route::get('/admin/dashboard', [DashboardController::class, 'index'])
        ->name('admin.dashboard');

    // Job Review Routes
    Route::get('/admin/jobs/pending', [AdminJobController::class, 'index'])
        ->name('admin.jobs.pending');
    
    Route::get('/admin/jobs/{job}', [AdminJobController::class, 'show'])
        ->name('admin.jobs.show');
    
    Route::post('/admin/jobs/{job}/approve', [AdminJobController::class, 'approve'])
        ->name('admin.jobs.approve');
    
    Route::post('/admin/jobs/{job}/reject', [AdminJobController::class, 'reject'])
        ->name('admin.jobs.reject');

    // Skills CRUD Routes
    Route::get('/admin/skills', [AdminSkillController::class, 'index'])
        ->name('admin.skills.index');
    Route::get('/admin/skills/create', [AdminSkillController::class, 'create'])
        ->name('admin.skills.create');
    Route::post('/admin/skills', [AdminSkillController::class, 'store'])
        ->name('admin.skills.store');
    Route::get('/admin/skills/{skill}', [AdminSkillController::class, 'show'])
        ->name('admin.skills.show');
    Route::get('/admin/skills/{skill}/edit', [AdminSkillController::class, 'edit'])
        ->name('admin.skills.edit');
    Route::put('/admin/skills/{skill}', [AdminSkillController::class, 'update'])
        ->name('admin.skills.update');
    Route::delete('/admin/skills/{skill}', [AdminSkillController::class, 'destroy'])
        ->name('admin.skills.destroy');

    // Users CRUD Routes
    Route::get('/admin/users', [AdminUserController::class, 'index'])
        ->name('admin.users.index');
    Route::get('/admin/users/create', [AdminUserController::class, 'create'])
        ->name('admin.users.create');
    Route::post('/admin/users', [AdminUserController::class, 'store'])
        ->name('admin.users.store');
    Route::get('/admin/users/{user}', [AdminUserController::class, 'show'])
        ->name('admin.users.show');
    Route::get('/admin/users/{user}/edit', [AdminUserController::class, 'edit'])
        ->name('admin.users.edit');
    Route::put('/admin/users/{user}', [AdminUserController::class, 'update'])
        ->name('admin.users.update');
    Route::delete('/admin/users/{user}', [AdminUserController::class, 'destroy'])
        ->name('admin.users.destroy');
});

