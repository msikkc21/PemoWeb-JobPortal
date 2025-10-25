<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\JobSeeker\ProfileController;
use App\Http\Controllers\JobSeeker\DashboardController;

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

    // Tambahkan route jobseeker lainnya di sini
    // Semua route di group ini akan memerlukan profil lengkap
});
