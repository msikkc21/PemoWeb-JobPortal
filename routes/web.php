<?php

// --- IMPORTS YANG DIBUTUHKAN ---
use App\Models\Company; 
use App\Models\JobPost;
use App\Models\Application; // Tambahkan jika menggunakan model Application di controller

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\SkillController;
use App\Http\Controllers\Admin\JobController;

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
// -----------------------------

Route::get('/', function () {
    return Inertia::render('Auth/Login');
})->middleware('guest');

// Rute dashboard untuk pengguna non-admin (Job Seeker, Company, dll.)
Route::get('/dashboard', function () {
    return Inertia::render('Dashboard'); 
})->middleware(['auth', 'verified'])->name('dashboard');


// --- GRUP ROUTE KHUSUS UNTUK ADMIN (DEV A) ---
Route::middleware(['auth', 'verified'])->prefix('admin')->name('admin.')->group(function () {
    
    // 1. Dashboard Admin
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    // 2. Skills CRUD
    Route::resource('skills', SkillController::class)->except(['create', 'show']);

    // 3. Job Review & History
    Route::get('/jobs/review', [JobController::class, 'reviewIndex'])->name('jobs.review');
    Route::post('/jobs/{jobPost}/approve', [JobController::class, 'approve'])->name('jobs.approve');
    Route::post('/jobs/{jobPost}/reject', [JobController::class, 'reject'])->name('jobs.reject');
    Route::get('/jobs/history', [JobController::class, 'historyIndex'])->name('jobs.history');
});
// ------------------------------------------------------------------------

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});


Route::middleware(['auth', 'permission:view_users'])->group(function () {
    Route::get('/view_all_users', function() {
        return '<h1>View All Users</h1>';
    })->name('view_all_users');
});

Route::middleware(['auth', 'permission:update_application_status'])->group(function () {
    Route::get('/update_application_status', function() {
        return '<h1>Update Application Status</h1>';
    })->name('update_application_status');
});

Route::middleware(['auth', 'permission:upload_resume'])->group(function () {
    Route::get('/upload_resume', function() {
        return '<h1>Upload Resume</h1>';
    })->name('upload_resume');
});

require __DIR__.'/auth.php';