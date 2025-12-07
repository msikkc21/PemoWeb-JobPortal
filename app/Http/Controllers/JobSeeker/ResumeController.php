<?php

namespace App\Http\Controllers\JobSeeker;

use App\Http\Controllers\Controller;
use App\Models\Resume;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ResumeController extends Controller
{
    public function index()
    {
        $jobSeekerId = Auth::id();

        $resumes = Resume::where('job_seeker_id', $jobSeekerId)
            ->latest()
            ->get();

        return Inertia::render('JobSeeker/Resume/Index', [
            'resumes' => $resumes,
        ]);
    }

    public function create()
    {
        return Inertia::render('JobSeeker/Resume/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'cv_file' => 'required|mimes:pdf,doc,docx|max:2048',
        ]);

        $cvPath = $request->file('cv_file')->store('resumes', 'public');

        Resume::create([
            'job_seeker_id' => Auth::id(),
            'cv_file'       => $cvPath,
            'parsed_data'   => null,
            'upload_date'   => now(),
        ]);

        return redirect()->route('jobseeker.resumes.index')
            ->with('success', 'Resume berhasil diupload.');
    }

    public function show(string $id)
    {
        $resume = Resume::where('job_seeker_id', Auth::id())->findOrFail($id);

        return Inertia::render('JobSeeker/Resume/Show', [
            'resume' => $resume,
        ]);
    }

    public function edit(string $id)
    {
        $resume = Resume::where('job_seeker_id', Auth::id())->findOrFail($id);

        return Inertia::render('JobSeeker/Resume/Edit', [
            'resume' => $resume,
        ]);
    }

    public function update(Request $request, string $id)
    {
        $resume = Resume::where('job_seeker_id', Auth::id())->findOrFail($id);

        $request->validate([
            'cv_file' => 'nullable|mimes:pdf,doc,docx|max:2048',
            'parsed_data' => 'nullable|string',
        ]);

        if ($request->hasFile('cv_file')) {

            if ($resume->cv_file && Storage::disk('public')->exists($resume->cv_file)) {
                Storage::disk('public')->delete($resume->cv_file);
            }

            $resume->cv_file = $request->file('cv_file')->store('resumes', 'public');
            $resume->upload_date = now();
        }

        if ($request->filled('parsed_data')) {
            $resume->parsed_data = $request->parsed_data;
        }

        $resume->save();

        return redirect()->route('jobseeker.resumes.index')
            ->with('success', 'Resume berhasil diperbarui.');
    }

    public function destroy(string $id)
    {
        $resume = Resume::where('job_seeker_id', Auth::id())->findOrFail($id);

        if (Storage::disk('public')->exists($resume->cv_file)) {
            Storage::disk('public')->delete($resume->cv_file);
        }

        $resume->delete();

        return redirect()->route('jobseeker.resumes.index')
            ->with('success', 'Resume berhasil dihapus.');
    }
}
