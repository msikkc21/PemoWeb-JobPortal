<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'check.permission:admin'])->get('/test-admin', function () {
    return response()->json(['message' => '✅ Kamu punya permission admin.']);
});

// Route tes untuk permission company
Route::middleware(['auth', 'check.permission:company'])->get('/test-company', function () {
    return response()->json(['message' => '✅ Kamu punya permission company.']);
});

// Route tes untuk permission jobseeker
Route::middleware(['auth', 'check.permission:jobseeker'])->get('/test-jobseeker', function () {
    return response()->json(['message' => '✅ Kamu punya permission jobseeker.']);
});