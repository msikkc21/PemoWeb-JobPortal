<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Skill;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SkillController extends Controller
{
    /**
     * Display a listing of skills.
     */
    public function index(Request $request)
    {
        $query = Skill::query();

        // Search functionality
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', '%' . $search . '%')
                  ->orWhere('description', 'like', '%' . $search . '%');
            });
        }

        // Get counts for related entities
        $skills = $query->withCount(['jobs', 'jobSeekers'])
            ->orderBy('name')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/Skills/Index', [
            'skills' => $skills,
            'search' => $request->search ?? '',
        ]);
    }

    /**
     * Show the form for creating a new skill.
     */
    public function create()
    {
        return Inertia::render('Admin/Skills/Create');
    }

    /**
     * Store a newly created skill in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:skills,name',
            'description' => 'nullable|string|max:1000',
        ], [
            'name.required' => 'Nama skill wajib diisi.',
            'name.unique' => 'Nama skill sudah ada.',
            'name.max' => 'Nama skill maksimal 255 karakter.',
            'description.max' => 'Deskripsi maksimal 1000 karakter.',
        ]);

        Skill::create($validated);

        return redirect()->route('admin.skills.index')
            ->with('success', 'Skill berhasil ditambahkan!');
    }

    /**
     * Display the specified skill.
     */
    public function show(Skill $skill)
    {
        $skill->loadCount(['jobs', 'jobSeekers']);
        $skill->load([
            'jobs' => fn($q) => $q->with('company')->latest()->take(5),
            'jobSeekers' => fn($q) => $q->take(5),
        ]);

        return Inertia::render('Admin/Skills/Show', [
            'skill' => $skill,
        ]);
    }

    /**
     * Show the form for editing the specified skill.
     */
    public function edit(Skill $skill)
    {
        return Inertia::render('Admin/Skills/Edit', [
            'skill' => $skill,
        ]);
    }

    /**
     * Update the specified skill in storage.
     */
    public function update(Request $request, Skill $skill)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:skills,name,' . $skill->id,
            'description' => 'nullable|string|max:1000',
        ], [
            'name.required' => 'Nama skill wajib diisi.',
            'name.unique' => 'Nama skill sudah ada.',
            'name.max' => 'Nama skill maksimal 255 karakter.',
            'description.max' => 'Deskripsi maksimal 1000 karakter.',
        ]);

        $skill->update($validated);

        return redirect()->route('admin.skills.index')
            ->with('success', 'Skill berhasil diperbarui!');
    }

    /**
     * Remove the specified skill from storage.
     */
    public function destroy(Skill $skill)
    {
        // Check if skill is being used
        $jobsCount = $skill->jobs()->count();
        $jobSeekersCount = $skill->jobSeekers()->count();

        if ($jobsCount > 0 || $jobSeekersCount > 0) {
            return redirect()->route('admin.skills.index')
                ->with('error', "Skill tidak dapat dihapus karena masih digunakan oleh {$jobsCount} lowongan dan {$jobSeekersCount} job seeker.");
        }

        $skill->delete();

        return redirect()->route('admin.skills.index')
            ->with('success', 'Skill berhasil dihapus!');
    }
}
