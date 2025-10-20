<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Application;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\LowonganController;

// Route::get('/', function () {
//     return Inertia::render('Welcome', [
//         'canLogin' => Route::has('login'),
//         'canRegister' => Route::has('register'),
//         'laravelVersion' => Application::VERSION,
//         'phpVersion' => PHP_VERSION,
//     ]);
// });

Route::get('/', function () {
    return Inertia::render('Auth/Login');
})->middleware('guest');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

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

Route::middleware(['auth', 'permission:view_jobs'])->group(function () {
    Route::get('/view_jobs', [LowonganController::class, 'index'])->name('jobs.index');
    Route::get('/view_jobs/{id}', [LowonganController::class, 'show'])->name('jobs.show');
});

Route::middleware(['auth', 'permission:create_job'])->group(function () {
    // Route untuk perusahaan
    Route::prefix('company')->name('company.')->group(function () {
        Route::get('/jobs/create', [LowonganController::class, 'create'])->name('jobs.create');
        Route::post('/jobs', [LowonganController::class, 'store'])->name('jobs.store');
    });
});

Route::middleware(['auth', 'permission:edit_job'])->group(function () {
    Route::prefix('company')->name('company.')->group(function () {
        Route::get('/jobs/{id}/edit', [LowonganController::class, 'edit'])->name('jobs.edit');
        Route::put('/jobs/{id}', [LowonganController::class, 'update'])->name('jobs.update');
    });
});

Route::middleware(['auth', 'permission:delete_job'])->group(function () {
    Route::prefix('company')->name('company.')->group(function () {
        Route::delete('/jobs/{id}', [LowonganController::class, 'destroy'])->name('jobs.destroy');
    });
});

require __DIR__.'/auth.php';
