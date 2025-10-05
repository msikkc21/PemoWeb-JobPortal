<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Auth;
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

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Admin routes
Route::middleware(['auth', 'verified'])->prefix('admin')->name('admin.')->group(function () {
    // Users routes
    Route::get('/users', function () {
        return Inertia::render('Admin/Users/Index', [
            'auth' => [
                'user' => Auth::user(),
            ],
        ]);
    })->name('users');

    // Companies routes
    Route::get('/companies', function () {
        return Inertia::render('Admin/Companies/Index', [
            'auth' => [
                'user' => Auth::user(),
            ],
        ]);
    })->name('companies.index');

    Route::get('/companies/pending', function () {
        return Inertia::render('Admin/Companies/Pending', [
            'auth' => [
                'user' => Auth::user(),
            ],
        ]);
    })->name('companies.pending');

    Route::get('/companies/{id}', function ($id) {
        return Inertia::render('Admin/Companies/Show', [
            'auth' => [
                'user' => Auth::user(),
            ],
            'id' => (int) $id
        ]);
    })->name('companies.show');
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
