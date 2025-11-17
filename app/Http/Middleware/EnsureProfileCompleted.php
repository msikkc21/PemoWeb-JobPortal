<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureProfileCompleted
{
    /**
     * Handle an incoming request.
     *
     * Middleware ini memastikan user dengan role Company atau JobSeeker
     * telah melengkapi profil sebelum dapat mengakses halaman lain.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        // Jika user tidak terautentikasi, lewati middleware ini
        if (!$user) {
            return $next($request);
        }

        // Jika user adalah Company
        if ($user->isCompany()) {
            $company = $user->company;

            // Jika belum ada profil company atau profil belum lengkap
            if (!$company || !$company->isProfileComplete()) {
                // Jangan redirect jika sudah di halaman onboarding (untuk menghindari loop)
                if (!$request->routeIs('company.onboarding')) {
                    return redirect()->route('company.onboarding');
                }
            }
        }

        // Jika user adalah JobSeeker
        if ($user->isJobSeeker()) {
            $jobSeeker = $user->jobSeeker;

            // Jika belum ada profil jobseeker atau profil belum lengkap
            if (!$jobSeeker || !$jobSeeker->isProfileComplete()) {
                // Jangan redirect jika sudah di halaman onboarding (untuk menghindari loop)
                if (!$request->routeIs('jobseeker.onboarding')) {
                    return redirect()->route('jobseeker.onboarding');
                }
            }
        }

        return $next($request);
    }
}
