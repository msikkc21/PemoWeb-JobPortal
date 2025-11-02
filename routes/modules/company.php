<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Company\ProfileController;
use App\Http\Controllers\Company\ApplicantController;
use App\Http\Controllers\Company\DashboardController;
use App\Http\Controllers\Company\SubscriptionController;
use App\Http\Controllers\JobSeeker\ApplicationController;

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

    // Payment routes
    Route::post('/company/subscription/payment/create', [SubscriptionController::class, 'createPayment'])
        ->name('company.subscription.payment.create');

    Route::get('/company/subscription/payment/continue', [SubscriptionController::class, 'continuePayment'])
        ->name('company.subscription.payment.continue');

    Route::get('/company/subscription/payment/check/{external_id}', [SubscriptionController::class, 'checkPayment'])
        ->name('company.subscription.payment.check');

    Route::get('/company/jobs/create', [\App\Http\Controllers\Company\JobController::class, 'create'])
        ->name('company.jobs.create')->middleware('ensure.active.subscription');

    // Jobs routes - Read-only (no subscription required)
    Route::get('/company/jobs', [\App\Http\Controllers\Company\JobController::class, 'index'])
        ->name('company.jobs.index');

    Route::get('/company/jobs/{job}', [\App\Http\Controllers\Company\JobController::class, 'show'])
        ->name('company.jobs.show');

    // Jobs CRUD routes - Require active subscription
    Route::middleware('ensure.active.subscription')->group(function () {

        Route::post('/company/jobs', [\App\Http\Controllers\Company\JobController::class, 'store'])
            ->name('company.jobs.store');

        Route::get('/company/jobs/{job}/edit', [\App\Http\Controllers\Company\JobController::class, 'edit'])
            ->name('company.jobs.edit');

        Route::put('/company/jobs/{job}', [\App\Http\Controllers\Company\JobController::class, 'update'])
            ->name('company.jobs.update');

        Route::patch('/company/jobs/{job}', [\App\Http\Controllers\Company\JobController::class, 'update']);

        Route::delete('/company/jobs/{job}', [\App\Http\Controllers\Company\JobController::class, 'destroy'])
            ->name('company.jobs.destroy');

        Route::post('/company/jobs/{job}/submit', [\App\Http\Controllers\Company\JobController::class, 'submitForReview'])
            ->name('company.jobs.submit');

        Route::post('/company/jobs/{job}/close', [\App\Http\Controllers\Company\JobController::class, 'close'])
            ->name('company.jobs.close');
    });
    
    Route::get('/company/applicants', [ApplicantController::class, 'index'])->name('company.applicants.index');

    Route::get('/company/applicants/{id}', [ApplicantController::class, 'show'])->name('company.applicants.show');

    // Applicant status update
    Route::post('/company/applicants/{id}/status', [\App\Http\Controllers\Company\ApplicantController::class, 'updateStatus'])
        ->name('company.applicants.status');

    // Schedule interview form and store
    Route::get('/company/applicants/{id}/interviews/create', [\App\Http\Controllers\Company\InterviewController::class, 'create'])
        ->name('company.applicants.interviews.create');

    Route::post('/company/interviews', [\App\Http\Controllers\Company\InterviewController::class, 'store'])
        ->name('company.interviews.store');

    // Company interview listing
    Route::get('/company/interviews', [\App\Http\Controllers\Company\InterviewController::class, 'index'])
        ->name('company.interviews.index');

    // Start and complete interview
    Route::get('/company/interviews/{id}/start', [\App\Http\Controllers\Company\InterviewController::class, 'start'])
        ->name('company.interviews.start');

    Route::post('/company/interviews/{id}/complete', [\App\Http\Controllers\Company\InterviewController::class, 'complete'])
        ->name('company.interviews.complete');

    // Tambahkan route company lainnya di sini
    // Semua route di group ini akan memerlukan profil lengkap
});
