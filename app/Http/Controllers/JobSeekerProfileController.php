<?php

namespace App\Http\Controllers;

use App\Models\JobSeekerProfile;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class JobSeekerProfileController extends Controller
{
    public function index()
    {
        $profiles = JobSeekerProfile::all();
        return Inertia::render('JobSeekers/Index', [
            'profiles' => $profiles
        ]);
    }

    public function create()
    {
        return Inertia::render('JobSeekers/Create');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'nama' => 'required|string|max:255',
            'jenis_kelamin' => 'nullable|string',
            'telepon' => 'nullable|string',
            'alamat' => 'nullable|string',
            'pendidikan' => 'nullable|string',
            'pengalaman' => 'nullable|string',
            'resume' => 'nullable|file|mimes:pdf,doc,docx',
        ]);

        // Simpan resume
        if ($request->hasFile('resume')) {
            $data['path_resume'] = $request->file('resume')->store('resumes', 'public');
        }

        JobSeekerProfile::create($data);
        return redirect()->route('jobseekers.index')->with('success', 'Profil berhasil dibuat.');
    }

    public function edit($id)
    {
        $profile = JobSeekerProfile::findOrFail($id);
        return Inertia::render('JobSeekers/Edit', ['profile' => $profile]);
    }

    public function update(Request $request, $id)
    {
        $profile = JobSeekerProfile::findOrFail($id);
        $data = $request->validate([
            'nama' => 'required|string|max:255',
            'telepon' => 'nullable|string',
            'alamat' => 'nullable|string',
        ]);
        $profile->update($data);
        return redirect()->route('jobseekers.index')->with('success', 'Profil diperbarui.');
    }

    public function destroy($id)
    {
        $profile = JobSeekerProfile::findOrFail($id);
        $profile->delete();
        return redirect()->route('jobseekers.index')->with('success', 'Profil dihapus.');
    }

    // Parsing resume sederhana
    public function parseResume($id)
    {
        $profile = JobSeekerProfile::findOrFail($id);
        if (!$profile->path_resume) {
            return response()->json(['error' => 'Resume belum diunggah'], 404);
        }

        $filePath = storage_path("app/public/{$profile->path_resume}");
        $text = file_get_contents($filePath); // Bisa ganti dengan parser seperti `smalot/pdfparser`
        return response()->json(['parsed' => substr($text, 0, 1000)]);
    }
}
