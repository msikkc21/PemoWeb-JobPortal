<?php

namespace App\Providers;

use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;

class RouteServiceProvider extends ServiceProvider
{
    /**
     * Path to the "home" route for your application.
     *
     * @var string
     */
    public const HOME = '/dashboard';

    /**
     * Define your route model bindings, pattern filters, and other route configuration.
     */
    public function boot(): void
    {
        $this->routes(function () {

            /*
            |--------------------------------------------------------------------------
            | Web Routes
            |--------------------------------------------------------------------------
            */
            Route::middleware('web')
                ->group(base_path('routes/web.php'));

            /*
            |--------------------------------------------------------------------------
            | API Routes
            |--------------------------------------------------------------------------
            */
            Route::prefix('api')
                ->middleware('api')
                ->group(base_path('routes/api.php'));

            /*
            |--------------------------------------------------------------------------
            | Auth Routes (jika ada)
            |--------------------------------------------------------------------------
            */
            if (file_exists(base_path('routes/auth.php'))) {
                Route::middleware('web')
                    ->group(base_path('routes/auth.php'));
            }

            /*
            |--------------------------------------------------------------------------
            | Admin Routes (module khusus admin)
            |--------------------------------------------------------------------------
            */
            if (file_exists(base_path('routes/modules/admin.php'))) {
                Route::middleware(['web'])
                    ->group(base_path('routes/modules/admin.php'));
            }
        });
    }
}
