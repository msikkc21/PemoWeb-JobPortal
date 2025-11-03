<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CompanyProfile;
use App\Models\Lowongan;
use App\Models\Lamaran;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Menampilkan statistik ringkas di dashboard admin
     */
    public function index()
    {
        $data = [
            'total_perusahaan' => CompanyProfile::count(),
            'total_lowongan' => Lowongan::count(),
            'total_lamaran' => Lamaran::count(),
            'pending_review' => Lowongan::where('status', 'pending_review')->count(),
        ];

        return Inertia::render('Admin/DashboardAdmin', [
            'stats' => $data,
        ]);
    }
}
