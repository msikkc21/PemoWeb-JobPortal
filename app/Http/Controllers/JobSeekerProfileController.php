<?php

namespace App\Http\Controllers;

use App\Models\JobSeekerProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class JobSeekerProfileController extends Controller
{
    // Menampilkan profil user yang login
    public function index()
    {
        $profile = JobSeekerProfile::where('id_pengguna', Auth::id())->first();

        return Inertia::render('JobSeekerProfiles/Index', [
            'profile' => $profile,
        ]);
    }

    // Form membuat profil baru
    public function create()
    {
        return Inertia::render('JobSeekerProfiles/Create');
    }

    // Simpan profil baru
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'jenis_kelamin' => 'nullable|string|max:50',
            'tempat_lahir' => 'nullable|string|max:100',
            'tanggal_lahir' => 'nullable|date',
            'telepon' => 'nullable|string|max:20',
            'alamat' => 'nullable|string',
            'pendidikan' => 'nullable|string|max:255',
            'pengalaman' => 'nullable|string',
            'deskripsi' => 'nullable|string',
            'linkedin' => 'nullable|url',
            'github' => 'nullable|url',
            'portfolio' => 'nullable|url',
        ]);

        $validated['id_pengguna'] = Auth::id();

        JobSeekerProfile::create($validated);

        return redirect()->route('jobseeker_profiles.index')
            ->with('success', 'Profil pencari kerja berhasil dibuat.');
    }

    // Form edit profil
    public function edit($id)
    {
        $profile = JobSeekerProfile::findOrFail($id);
        $this->authorize('update', $profile);

        return Inertia::render('JobSeekerProfiles/Edit', [
            'profile' => $profile,
        ]);
    }

    // Update profil
    public function update(Request $request, $id)
    {
        $profile = JobSeekerProfile::findOrFail($id);
        $this->authorize('update', $profile);

        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'jenis_kelamin' => 'nullable|string|max:50',
            'tempat_lahir' => 'nullable|string|max:100',
            'tanggal_lahir' => 'nullable|date',
            'telepon' => 'nullable|string|max:20',
            'alamat' => 'nullable|string',
            'pendidikan' => 'nullable|string|max:255',
            'pengalaman' => 'nullable|string',
            'deskripsi' => 'nullable|string',
            'linkedin' => 'nullable|url',
            'github' => 'nullable|url',
            'portfolio' => 'nullable|url',
        ]);

        $profile->update($validated);

        return redirect()->route('jobseeker_profiles.index')
            ->with('success', 'Profil berhasil diperbarui.');
    }

    // Upload resume (PDF/DOC)
    public function uploadResume(Request $request)
    {
        $request->validate([
            'resume' => 'required|file|mimes:pdf,doc,docx|max:5120',
        ]);

        $profile = JobSeekerProfile::where('id_pengguna', Auth::id())->firstOrFail();

        $path = $request->file('resume')->store('resumes', 'public');

        // Simulasi parsing resume (bisa diganti dengan NLP atau PDF parser)
        $resumeText = $this->parseResume($request->file('resume')->getRealPath());

        // Simpan hasil parsing ke kolom 'pengalaman' atau 'deskripsi'
        $profile->update([
            'path_foto' => $path,
            'deskripsi' => $resumeText,
        ]);

        return redirect()->route('jobseeker_profiles.index')
            ->with('success', 'Resume berhasil diupload dan diparsing.');
    }

    // Parsing resume sederhana (ekstrak teks)
    private function parseResume($filePath)
    {
        $extension = pathinfo($filePath, PATHINFO_EXTENSION);
        $text = '';

        if ($extension === 'pdf') {
            try {
                $text = shell_exec("pdftotext '$filePath' -");
            } catch (\Exception $e) {
                $text = 'Gagal membaca file PDF.';
            }
        } else {
            $text = file_get_contents($filePath);
        }

        // Ambil hanya beberapa baris pertama
        return substr(trim($text), 0, 500);
    }
}
