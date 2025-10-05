<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

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

//---- aku (zidnan) nambah ini
use App\Http\Controllers\JobSeekerProfileController;
use App\Http\Controllers\CompanyProfileController;

Route::middleware(['auth'])->group(function () {
    // Job Seeker CRUD
    Route::get('/jobseekers', [JobSeekerProfileController::class, 'index'])->name('jobseekers.index');
    Route::get('/jobseekers/create', [JobSeekerProfileController::class, 'create'])->name('jobseekers.create');
    Route::post('/jobseekers', [JobSeekerProfileController::class, 'store'])->name('jobseekers.store');
    Route::get('/jobseekers/{id}/edit', [JobSeekerProfileController::class, 'edit'])->name('jobseekers.edit');
    Route::put('/jobseekers/{id}', [JobSeekerProfileController::class, 'update'])->name('jobseekers.update');
    Route::delete('/jobseekers/{id}', [JobSeekerProfileController::class, 'destroy'])->name('jobseekers.destroy');
    Route::get('/jobseekers/{id}/parse', [JobSeekerProfileController::class, 'parseResume'])->name('jobseekers.parse');

    // Company CRUD
    Route::get('/companies', [CompanyProfileController::class, 'index'])->name('companies.index');
    Route::get('/companies/create', [CompanyProfileController::class, 'create'])->name('companies.create');
    Route::post('/companies', [CompanyProfileController::class, 'store'])->name('companies.store');
    Route::get('/companies/{id}/edit', [CompanyProfileController::class, 'edit'])->name('companies.edit');
    Route::put('/companies/{id}', [CompanyProfileController::class, 'update'])->name('companies.update');
    Route::delete('/companies/{id}', [CompanyProfileController::class, 'destroy'])->name('companies.destroy');
});

//-----------------------------

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
