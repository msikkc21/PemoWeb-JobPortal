<?php

use App\Http\Controllers\CompanyPaymentController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\CompanyProfileController;
use App\Http\Controllers\JobSeekerProfileController;
use App\Http\Controllers\WebhookPaymentController;

Route::get('/', function () {
    return Inertia::render('Auth/Login');
})->middleware('guest');

Route::get('/test', function () {
    return "ok";
})->middleware('guest');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// ==========================================
// Company Routes - Dengan Proteksi Permission Penuh
// ==========================================
Route::middleware(['auth'])->prefix('company')->group(function () {

    // Profile Management Routes
    Route::name('company_profiles.')->group(function () {
        // View company profile (permission: view_company_profiles)
        Route::get('/', [CompanyProfileController::class, 'index'])
            ->middleware('permission:view_company_profiles')
            ->name('index');

        // Create company profile (permission: create_company_profile)
        Route::get('/create', [CompanyProfileController::class, 'create'])
            ->middleware('permission:create_company_profile')
            ->name('create');

        // Store company profile (permission: create_company_profile)
        Route::post('/', [CompanyProfileController::class, 'store'])
            ->middleware('permission:create_company_profile')
            ->name('store');

        // Edit company profile (permission: edit_company_profile)
        Route::get('/edit', [CompanyProfileController::class, 'edit'])
            ->middleware('permission:edit_company_profile')
            ->name('edit');

        // Update company profile (permission: edit_company_profile)
        Route::put('/update', [CompanyProfileController::class, 'update'])
            ->middleware('permission:edit_company_profile')
            ->name('update');
    });

    // Payment routes (auth + permission, TANPA prefix dobel)
    Route::middleware(['permission:view_company_payment', 'company.profile.completed'])
        ->group(function () {
            // Halaman ringkasan pembayaran
            Route::get('/payment', [CompanyPaymentController::class, 'index'])->name('company.payment');

            // Buat/ulang pembayaran (tidak auto-redirect ke payment_url)
            Route::post('/payment/start', [CompanyPaymentController::class, 'startPayment'])->name('company.payment.start');

            // Lanjutkan ke payment_url untuk tagihan pending & belum expired
            Route::post('/payment/continue', [CompanyPaymentController::class, 'continueExisting'])->name('company.payment.continue');
        });


    // Dashboard Route (memerlukan profile completed)
    Route::middleware(['company.profile.completed', 'company.payment.completed', 'permission:view_company_profiles'])
        ->name('company.')
        ->group(function () {
            Route::get('/dashboard', [CompanyProfileController::class, 'dashboard'])->name('dashboard');
        });
});

Route::post('/payment/webhook/callback', [WebhookPaymentController::class, 'handle'])
    ->name('payment.webhook.callback');


require __DIR__ . '/auth.php';

// // Admin routes
// Route::middleware(['auth', 'verified'])->prefix('admin')->name('admin.')->group(function () {
//     // Users routes
//     Route::get('/users', function () {
//         return Inertia::render('Admin/Users/Index', [
//             'auth' => [
//                 'user' => Auth::user(),
//             ],
//         ]);
//     })->name('users');

//     // Companies routes
//     Route::get('/companies', function () {
//         return Inertia::render('Admin/Companies/Index', [
//             'auth' => [
//                 'user' => Auth::user(),
//             ],
//         ]);
//     })->name('companies.index');

//     Route::get('/companies/pending', function () {
//         return Inertia::render('Admin/Companies/Pending', [
//             'auth' => [
//                 'user' => Auth::user(),
//             ],
//         ]);
//     })->name('companies.pending');

//     Route::get('/companies/{id}', function ($id) {
//         return Inertia::render('Admin/Companies/Show', [
//             'auth' => [
//                 'user' => Auth::user(),
//             ],
//             'id' => (int) $id
//         ]);
//     })->name('companies.show');
    
//     // Jobs routes
//     Route::get('/jobs', function () {
//         return Inertia::render('Admin/Jobs/Index', [
//             'auth' => [
//                 'user' => Auth::user(),
//             ],
//         ]);
//     })->name('jobs.index');

//     Route::get('/jobs/pending', function () {
//         return Inertia::render('Admin/Jobs/Pending', [
//             'auth' => [
//                 'user' => Auth::user(),
//             ],
//         ]);
//     })->name('jobs.pending');

//     Route::get('/jobs/{id}', function ($id) {
//         return Inertia::render('Admin/Jobs/Show', [
//             'auth' => [
//                 'user' => Auth::user(),
//             ],
//             'id' => (int) $id
//         ]);
//     })->name('jobs.show');
// });


// Route::middleware(['auth', 'permission:view_users'])->group(function () {
//     Route::get('/view_all_users', function() {
//         return '<h1>View All Users</h1>';
//     })->name('view_all_users');
// });

// Route::middleware(['auth', 'permission:update_application_status'])->group(function () {
//     Route::get('/update_application_status', function() {
//         return '<h1>Update Application Status</h1>';
//     })->name('update_application_status');
// });

// Route::middleware(['auth', 'permission:upload_resume'])->group(function () {
//     Route::get('/upload_resume', function() {
//         return '<h1>Upload Resume</h1>';
//     })->name('upload_resume');
// });

// //------zidnan-------
// Route::middleware(['auth'])->group(function () {
//     Route::get('/company-profile', [CompanyProfileController::class, 'index'])->name('company_profiles.index');
//     Route::get('/company-profile/create', [CompanyProfileController::class, 'create'])->name('company_profiles.create');
//     Route::post('/company-profile', [CompanyProfileController::class, 'store'])->name('company_profiles.store');
//     Route::get('/company-profile/{id}/edit', [CompanyProfileController::class, 'edit'])->name('company_profiles.edit');
//     Route::put('/company-profile/{id}', [CompanyProfileController::class, 'update'])->name('company_profiles.update');
// });


// Route::middleware(['auth'])->group(function () {
//     Route::get('/jobseeker-profile', [JobSeekerProfileController::class, 'index'])->name('jobseeker_profiles.index');
//     Route::get('/jobseeker-profile/create', [JobSeekerProfileController::class, 'create'])->name('jobseeker_profiles.create');
//     Route::post('/jobseeker-profile', [JobSeekerProfileController::class, 'store'])->name('jobseeker_profiles.store');
//     Route::get('/jobseeker-profile/{id}/edit', [JobSeekerProfileController::class, 'edit'])->name('jobseeker_profiles.edit');
//     Route::put('/jobseeker-profile/{id}', [JobSeekerProfileController::class, 'update'])->name('jobseeker_profiles.update');
//     Route::post('/jobseeker-profile/upload-resume', [JobSeekerProfileController::class, 'uploadResume'])->name('jobseeker_profiles.upload_resume');
// });

// //----------------------
