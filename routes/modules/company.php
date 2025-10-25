<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Company\ProfileController;
use App\Http\Controllers\Company\DashboardController;
use App\Http\Controllers\Company\SubscriptionController;

/*
================
COMPANY ROUTES
================
Routes untuk role Company
*/

// Route onboarding - tidak memerlukan middleware ensure.profile agar tetap bisa diakses
Route::middleware(['auth', 'check.permission:company'])->group(function () {
    Route::get('/company/onboarding', [ProfileController::class, 'onboardingShow'])
        ->name('company.onboarding');

    Route::post('/company/onboarding', [ProfileController::class, 'onboardingStore'])
        ->name('company.onboarding.store');
});

// Route lainnya - memerlukan middleware ensure.profile
Route::middleware(['auth', 'check.permission:company', 'ensure.profile'])->group(function () {
    Route::get('/company/dashboard', [DashboardController::class, 'index'])
        ->name('company.dashboard');

    // Profile routes
    Route::get('/company/profile', [ProfileController::class, 'show'])
        ->name('company.profile.show');
    
    Route::get('/company/profile/edit', [ProfileController::class, 'edit'])
        ->name('company.profile.edit');
    
    Route::post('/company/profile/update', [ProfileController::class, 'update'])
        ->name('company.profile.update');

    // Subscription routes (Point 7 & 8: Lihat Status & Pilih Paket)
    Route::get('/company/subscription', [SubscriptionController::class, 'index'])
        ->name('company.subscription.index');
    
    Route::get('/company/subscription/choose', [SubscriptionController::class, 'choose'])
        ->name('company.subscription.choose');
    
    Route::post('/company/subscription/activate', [SubscriptionController::class, 'activate'])
        ->name('company.subscription.activate');
    
    Route::get('/company/subscription/invoice/{id}', [SubscriptionController::class, 'invoice'])
        ->name('company.subscription.invoice');

    // Jobs routes
    Route::resource('/company/jobs', \App\Http\Controllers\Company\JobController::class)
        ->names('company.jobs');

    Route::post('/company/jobs/{job}/submit', [\App\Http\Controllers\Company\JobController::class, 'submitForReview'])
        ->name('company.jobs.submit');

    Route::post('/company/jobs/{job}/close', [\App\Http\Controllers\Company\JobController::class, 'close'])
        ->name('company.jobs.close');

    // Tambahkan route company lainnya di sini
    // Semua route di group ini akan memerlukan profil lengkap
});
