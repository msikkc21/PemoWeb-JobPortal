<?php

namespace App\Http\Controllers;

use App\Models\CompanyProfile;
use App\Models\Lowongan;
use App\Models\Lamaran;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class CompanyProfileController extends Controller
{
    // Company Dashboard
    public function dashboard()
    {
        $user = Auth::user();
        $profile = CompanyProfile::where('user_id', $user->id)->first();

        if (!$profile) {
            return redirect()->route('company_profiles.create')
                ->with('warning', 'Profil perusahaan tidak ditemukan. Silakan buat profil terlebih dahulu.');
        }

        // Get statistics
        $totalJobs = Lowongan::where('company_id', $profile->id)->count();
        
        // Get recent applications (if relations are set up)
        $recentApplications = Lamaran::join('lowongans', 'lamarans.job_id', '=', 'lowongans.job_id')
            ->join('jobseeker_profiles', 'lamarans.jobseeker_id', '=', 'jobseeker_profiles.jobseeker_id')
            ->where('lowongans.company_id', $profile->id)
            ->whereIn('lamarans.status', ['submitted', 'in_process'])
            ->select(
                'lamarans.application_id',
                'lamarans.status',
                'lamarans.application_date',
                'lamarans.created_at',
                'jobseeker_profiles.name as applicant_name',
                'lowongans.title as job_title'
            )
            ->orderBy('lamarans.created_at', 'desc')
            ->limit(5)
            ->get();

        return Inertia::render('CompanyProfiles/Dashboard', [
            'profile' => $profile,
            'stats' => [
                'totalJobs' => $totalJobs,
                'pendingApplications' => $recentApplications->where('status', 'submitted')->count(),
                'inProcessApplications' => $recentApplications->where('status', 'in_process')->count(),
            ],
            'recentApplications' => $recentApplications,
        ]);
    }

    // Tampilkan profil perusahaan user yang login
    public function index()
    {
        $profile = CompanyProfile::where('user_id', Auth::id())->first();

        return Inertia::render('CompanyProfiles/Index', [
            'profile' => $profile,
        ]);
    }

    // Tampilkan form create
    public function create()
    {
        return Inertia::render('CompanyProfiles/Create');
    }

    // Simpan data baru
    public function store(Request $request)
    {
        $validated = $request->validate([
            'company_name' => 'required|string|max:255',
            'industry' => 'required|string|max:255',
            'description' => 'nullable|string',
            'location' => 'required|string|max:255',
            'website' => 'nullable|max:255',
            'company_email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string',
            'employee_count' => 'nullable|integer',
            'founded_year' => 'nullable|integer',
        ]);

        $validated['user_id'] = Auth::id();
        $validated['is_approved'] = false;

        CompanyProfile::create($validated);

        return redirect()->route('company.dashboard')
            ->with('success', 'Profil perusahaan berhasil dibuat.');
    }

    // Tampilkan form edit
    public function edit()
    {
        $profile = CompanyProfile::where('user_id', Auth::id())->first();

        if (!$profile) {
            return redirect()->route('company_profiles.create')
                ->with('warning', 'Profil perusahaan tidak ditemukan. Silakan buat profil terlebih dahulu.');
        }

        return Inertia::render('CompanyProfiles/Edit', [
            'profile' => $profile,
        ]);
    }

    // Update data
    public function update(Request $request)
    {
        $profile = CompanyProfile::where('user_id', Auth::id())->first();

        if (!$profile) {
            return redirect()->route('company_profiles.create')
                ->with('warning', 'Profil perusahaan tidak ditemukan. Silakan buat profil terlebih dahulu.');
        }

        $validated = $request->validate([
            'company_name' => 'required|string|max:255',
            'industry' => 'required|string|max:255',
            'description' => 'nullable|string',
            'location' => 'required|string|max:255',
            'website' => 'nullable|max:255',
            'company_email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string',
            'employee_count' => 'nullable|integer',
            'founded_year' => 'nullable|integer',
        ]);

        $profile->update($validated);

        return redirect()->route('company.dashboard')
            ->with('success', 'Profil perusahaan berhasil diperbarui.');
    }
}
