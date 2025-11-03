<?php

use App\Http\Controllers\JobSeeker\ApplicationController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\JobSeeker\ProfileController;
use App\Http\Controllers\JobSeeker\DashboardController;
use App\Http\Controllers\JobSeeker\JobController;
use App\Http\Controllers\JobSeeker\ResumeController;

/*
================
JOBSEEKER ROUTES
================
Routes untuk role JobSeeker
*/

// Route onboarding - tidak memerlukan middleware ensure.profile agar tetap bisa diakses
Route::middleware(['auth', 'check.permission:jobseeker'])->group(function () {
    Route::get('/jobseeker/onboarding', [ProfileController::class, 'onboardingShow'])
        ->name('jobseeker.onboarding');

    Route::post('/jobseeker/onboarding', [ProfileController::class, 'onboardingStore'])
        ->name('jobseeker.onboarding.store');
});

// Route lainnya - memerlukan middleware ensure.profile
Route::middleware(['auth', 'check.permission:jobseeker', 'ensure.profile'])->group(function () {
    Route::get('/jobseeker/dashboard', [DashboardController::class, 'index'])
        ->name('jobseeker.dashboard');

    // Profile routes
    Route::get('/jobseeker/profile', [ProfileController::class, 'show'])
        ->name('jobseeker.profile.show');
    
    Route::get('/jobseeker/profile/edit', [ProfileController::class, 'edit'])
        ->name('jobseeker.profile.edit');
    
    Route::post('/jobseeker/profile/update', [ProfileController::class, 'update'])
        ->name('jobseeker.profile.update');

    // Jobs routes
    Route::get('/jobseeker/jobs', [JobController::class, 'index'])
        ->name('jobseeker.jobs.index');
    
    Route::get('/jobseeker/jobs/{job}', [JobController::class, 'show'])
        ->name('jobseeker.jobs.show');

    // Applications routes
    Route::resource('jobseeker/applications', ApplicationController::class)
        ->names([
            'index' => 'jobseeker.applications.index',
            'create' => 'jobseeker.applications.create',
            'store' => 'jobseeker.applications.store',
            'show' => 'jobseeker.applications.show',
            'edit' => 'jobseeker.applications.edit',
            'update' => 'jobseeker.applications.update',
            'destroy' => 'jobseeker.applications.destroy',
        ]);

    // Resumes routes
    Route::resource('jobseeker/resumes', ResumeController::class)
        ->names([
            'index' => 'jobseeker.resumes.index',
            'create' => 'jobseeker.resumes.create',
            'store' => 'jobseeker.resumes.store',
            'show' => 'jobseeker.resumes.show',
            'edit' => 'jobseeker.resumes.edit',
            'update' => 'jobseeker.resumes.update',
            'destroy' => 'jobseeker.resumes.destroy',
        ]);

    // Tambahkan route jobseeker lainnya di sini
    // Semua route di group ini akan memerlukan profil lengkap
});
