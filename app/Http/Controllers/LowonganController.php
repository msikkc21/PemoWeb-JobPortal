<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Keahlian;
use App\Models\Lowongan;
use Illuminate\Http\Request;
use App\Models\CompanyProfile;

class LowonganController extends Controller
{
    public function index()
    {
        $user = auth()->user();
    
        // Filter lowongan berdasarkan role
        if ($user->isPerusahaan()) {
            // Perusahaan hanya melihat lowongan miliknya
            $lowongans = Lowongan::with(['company', 'skills'])
                ->whereHas('company', function($query) use ($user) {
                    $query->where('id_pengguna', $user->id_pengguna);
                })
                ->get();
        } else {
            // Pencari kerja dan lainnya melihat semua lowongan
            $lowongans = Lowongan::with(['company', 'skills'])
            ->where('status', 'dibuka')
            ->where('approve', 1)
            ->orderBy('tanggal_posting', 'desc')
            ->get();
        }
    
        return Inertia::render('ViewJobs', [
            'lowongans' => $lowongans,
            'skills' => Keahlian::all(),
            'auth' => [
                'user' => [
                    'id_pengguna' => $user->id_pengguna,
                    'name' => $user->name,
                    'email' => $user->email,
                    'is_pencari_kerja' => $user->isPencariKerja(),
                    'is_perusahaan' => $user->isPerusahaan(),
                    'is_admin' => $user->isAdmin(),
                ]
            ]
        ]);
    }

    public function show($id) {
        $lowongan = Lowongan::with(['company', 'skills'])->findOrFail($id);

        return Inertia::render('JobDetail', [
            'lowongan' => $lowongan,
        ]);
    }

    public function create()
    {
        return Inertia::render('CreateJob', [
            'skills' => Keahlian::all(['id', 'nama_keahlian', 'kategori']),
        ]);
    }

    public function store(Request $request)
    {
        $user = auth()->user();
        
        // Validasi apakah user adalah perusahaan
        if (!$user->isPerusahaan()) {
            return redirect()->back()->with('error', 'Hanya perusahaan yang dapat membuat lowongan.');
        }

        // Ambil company profile
        $companyProfile = CompanyProfile::where('id_pengguna', $user->id_pengguna)->first();
        
        if (!$companyProfile) {
            return redirect()->back()->with('error', 'Profil perusahaan belum lengkap.');
        }

        $validated = $request->validate([
            'judul' => 'required|string|max:255',
            'deskripsi' => 'required|string',
            'persyaratan' => 'required|string',
            'gaji' => 'nullable|numeric|min:0',
            'lokasi' => 'required|string|max:255',
            'jenis_pekerjaan' => 'required|string|max:100',
            'level_pekerjaan' => 'required|string|max:100',
            'tanggal_berakhir' => 'required|date|after:today',
            'skills' => 'nullable|array',
        ]);
        
        $lowongan = Lowongan::create([
            'id_company' => $companyProfile->id,
            'judul' => $validated['judul'],
            'deskripsi' => $validated['deskripsi'],
            'persyaratan' => $validated['persyaratan'],
            'gaji' => $validated['gaji'] ?? null,
            'lokasi' => $validated['lokasi'],
            'jenis_pekerjaan' => $validated['jenis_pekerjaan'],
            'level_pekerjaan' => $validated['level_pekerjaan'],
            'tanggal_posting' => now(),
            'tanggal_berakhir' => $validated['tanggal_berakhir'],
            'status' => 'dibuka',
            'approve' => 0, // Menunggu approval admin
        ]);

        // Attach skills
        if (!empty($validated['skills'])) {
            $lowongan->skills()->attach($validated['skills']);
        }

        return redirect()->route('jobs.index')
            ->with('success', 'Lowongan berhasil dibuat dan menunggu persetujuan admin.');
    }

    public function edit($id)
    {
        $user = auth()->user();
        $lowongan = Lowongan::with(['company', 'skills'])->findOrFail($id);
        
        // Validasi apakah user adalah pemilik lowongan
        if (!$user->isPerusahaan() || $lowongan->company->id_pengguna !== $user->id_pengguna) {
            abort(403, 'Anda tidak memiliki akses untuk mengedit lowongan ini.');
        }

        return Inertia::render('EditJob', [
            'lowongan' => [
                'id_lowongan' => $lowongan->id_lowongan,
                'judul' => $lowongan->judul,
                'deskripsi' => $lowongan->deskripsi,
                'persyaratan' => $lowongan->persyaratan,
                'gaji' => $lowongan->gaji,
                'lokasi' => $lowongan->lokasi,
                'jenis_pekerjaan' => $lowongan->jenis_pekerjaan,
                'level_pekerjaan' => $lowongan->level_pekerjaan,
                'tanggal_berakhir' => $lowongan->tanggal_berakhir ? $lowongan->tanggal_berakhir->format('Y-m-d') : null,
                'status' => $lowongan->status,
                'approve' => $lowongan->approve,
                'skills' => $lowongan->skills,
            ],
            'skills' => Keahlian::all(['id', 'nama_keahlian', 'kategori']),
        ]);
    }

    public function update(Request $request, $id)
    {
        $user = auth()->user();
        $lowongan = Lowongan::with('company')->findOrFail($id);
        
        // Validasi apakah user adalah pemilik lowongan
        if (!$user->isPerusahaan() || $lowongan->company->id_pengguna !== $user->id_pengguna) {
            abort(403, 'Anda tidak memiliki akses untuk mengedit lowongan ini.');
        }

        $validated = $request->validate([
            'judul' => 'required|string|max:255',
            'deskripsi' => 'required|string',
            'persyaratan' => 'required|string',
            'gaji' => 'nullable|numeric|min:0',
            'lokasi' => 'required|string|max:255',
            'jenis_pekerjaan' => 'required|string|max:100',
            'level_pekerjaan' => 'required|string|max:100',
            'tanggal_berakhir' => 'required|date',
            'status' => 'required|in:dibuka,ditutup',
            'skills' => 'nullable|array',
        ]);

        $lowongan->update([
            'judul' => $validated['judul'],
            'deskripsi' => $validated['deskripsi'],
            'persyaratan' => $validated['persyaratan'],
            'gaji' => $validated['gaji'] ?? null,
            'lokasi' => $validated['lokasi'],
            'jenis_pekerjaan' => $validated['jenis_pekerjaan'],
            'level_pekerjaan' => $validated['level_pekerjaan'],
            'tanggal_berakhir' => $validated['tanggal_berakhir'],
            'status' => $validated['status'],
        ]);

        // Sync skills
        if (isset($validated['skills'])) {
            $lowongan->skills()->sync($validated['skills']);
        } else {
            $lowongan->skills()->detach();
        }

        return redirect()->route('jobs.index')
            ->with('success', 'Lowongan berhasil diperbarui.');
    }

    public function destroy($id)
    {
        $user = auth()->user();
        $lowongan = Lowongan::with('company')->findOrFail($id);
        
        // Validasi apakah user adalah pemilik lowongan
        if (!$user->isPerusahaan() || $lowongan->company->id_pengguna !== $user->id_pengguna) {
            abort(403, 'Anda tidak memiliki akses untuk menghapus lowongan ini.');
        }

        $lowongan->skills()->detach(); // Hapus relasi skills
        $lowongan->delete();

        return redirect()->route('jobs.index')
            ->with('success', 'Lowongan berhasil dihapus.');
    }
}