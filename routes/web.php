<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Shared\SkillController;

/*
================
MODULAR ROUTE LOADING
================

Load all route files from the "modules" directory to keep routes organized and modular.
*/

foreach (glob(__DIR__.'/modules/*.php') as $routeFile) {
    require $routeFile;
}



/*
ROUTE FROM LARAVEL STARTER TEMPLATE
*/
Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::get('/skills', [SkillController::class, 'index'])->name('skills.index');



/*
Load the authentication routes.
*/
require __DIR__ . '/auth.php';
