<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Auth/Login');
})->middleware('guest');

// Rute dashboard untuk pengguna non-admin (Job Seeker, Company, dll.)
Route::get('/dashboard', function () {
    return Inertia::render('Dashboard'); 
})->middleware(['auth', 'verified'])->name('dashboard');

// ADMIN ROUTES: Pindah ke routes/modules/admin.php
// Jangan di-define di sini agar routing lebih bersih dan mudah di-maintain

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
// Load modular admin routes (kehilangan load ini membuat /admin/* tidak ter-registrasi)
if (file_exists(__DIR__ . '/modules/admin.php')) {
    require __DIR__ . '/modules/admin.php';
}