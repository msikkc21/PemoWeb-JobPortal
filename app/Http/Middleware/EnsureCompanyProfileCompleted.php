<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Models\CompanyProfile;
use Illuminate\Support\Facades\Auth;

class EnsureCompanyProfileCompleted
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // If user is not authenticated, let auth guard handle it
        // if (!Auth::check()) {
        //     return $next($request);
        // }

        // $user = Auth::user();

        // // Check if user is a company (role name: "Perusahaan" or "Company")
        // $roleName = $user->role?->name;
        // $isCompany = in_array($roleName, ['Perusahaan', 'Company']);

        // if ($isCompany) {
        //     // Check if company profile exists and is complete
        //     $profile = CompanyProfile::where('user_id', $user->id)->first();

        //     // Profile is incomplete if:
        //     // - No profile exists, OR
        //     // - Missing essential fields: company_name, industry, location
        //     $isIncomplete = !$profile || 
        //                    empty($profile->company_name) || 
        //                    empty($profile->industry) || 
        //                    empty($profile->location);

        //     if ($isIncomplete) {
        //         // Redirect to company profile creation form
        //         return redirect()->route('company_profiles.create')
        //             ->with('warning', 'Silakan lengkapi profil perusahaan Anda terlebih dahulu.');
        //     }
        // }

        // return $next($request);

        if (!Auth::check()) {
            return $next($request);
        }

        $user = Auth::user();
        $isCompany = in_array($user->role?->name, ['Perusahaan', 'Company']);

        if (!$isCompany) {
            return $next($request);
        }

        $path = $request->path();
        $isOnProfileCreate = $path === 'company/create';
        $isOnPaymentRelated = str_starts_with($path, 'company/payment');

        // ✅ Jangan redirect kalau sedang di halaman create atau payment
        if ($isOnProfileCreate || $isOnPaymentRelated) {
            return $next($request);
        }

        $profile = CompanyProfile::where('user_id', $user->id)->first();
        $isIncomplete = !$profile || empty($profile->company_name) || empty($profile->industry) || empty($profile->location);

        if ($isIncomplete) {
            return redirect()->to('/company/create')->with('warning', 'Silakan lengkapi profil perusahaan terlebih dahulu.');
        }

        return $next($request);
    }
}
