<?php

namespace App\Http\Controllers;

use App\Models\CompanyProfile;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class CompanyProfileController extends Controller
{
    // Tampilkan profil perusahaan user yang login
    public function index()
    {
        $profile = CompanyProfile::where('id_pengguna', Auth::id())->first();

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
            'nama_perusahaan' => 'required|string|max:255',
            'industri' => 'nullable|string|max:255',
            'deskripsi' => 'nullable|string',
            'lokasi' => 'nullable|string|max:255',
            'website' => 'nullable|url|max:255',
            'email_perusahaan' => 'nullable|email|max:255',
            'telepon' => 'nullable|string|max:20',
            'alamat' => 'nullable|string',
            'jumlah_karyawan' => 'nullable|integer',
            'tahun_dibentuk' => 'nullable|integer',
        ]);

        $validated['id_pengguna'] = Auth::id();
        $validated['approve'] = false;

        CompanyProfile::create($validated);

        return redirect()->route('company_profiles.index')
            ->with('success', 'Profil perusahaan berhasil dibuat.');
    }

    // Tampilkan form edit
    public function edit($id)
    {
        $profile = CompanyProfile::findOrFail($id);

        $this->authorize('update', $profile);

        return Inertia::render('CompanyProfiles/Edit', [
            'profile' => $profile,
        ]);
    }

    // Update data
    public function update(Request $request, $id)
    {
        $profile = CompanyProfile::findOrFail($id);

        $this->authorize('update', $profile);

        $validated = $request->validate([
            'nama_perusahaan' => 'required|string|max:255',
            'industri' => 'nullable|string|max:255',
            'deskripsi' => 'nullable|string',
            'lokasi' => 'nullable|string|max:255',
            'website' => 'nullable|url|max:255',
            'email_perusahaan' => 'nullable|email|max:255',
            'telepon' => 'nullable|string|max:20',
            'alamat' => 'nullable|string',
            'jumlah_karyawan' => 'nullable|integer',
            'tahun_dibentuk' => 'nullable|integer',
        ]);

        $profile->update($validated);

        return redirect()->route('company_profiles.index')
            ->with('success', 'Profil perusahaan berhasil diperbarui.');
    }
}
