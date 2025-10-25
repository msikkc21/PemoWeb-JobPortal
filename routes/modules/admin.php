<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
================
ADMIN ROUTES
================
Routes untuk role Admin
*/

Route::middleware(['auth', 'check.permission:admin'])->group(function () {
    Route::get('/admin/dashboard', function () {
        return Inertia::render('Admin/DashboardAdmin');
    })->name('admin.dashboard');

    // Tambahkan route admin lainnya di sini
});
