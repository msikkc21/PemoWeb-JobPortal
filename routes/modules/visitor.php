<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Foundation\Application;
use App\Http\Controllers\PublicJobController;
use App\Http\Controllers\WelcomeController;

Route::get('/', [WelcomeController::class, 'index'])->name('home');

// About page
Route::get('/about', function () {
    return Inertia::render('About');
})->name('about');

// Public Job Routes (accessible by guests)
Route::get('/jobs', [PublicJobController::class, 'index'])->name('jobs.index');
Route::get('/jobs/{job}', [PublicJobController::class, 'show'])->name('jobs.show');