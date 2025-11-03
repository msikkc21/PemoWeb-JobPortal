<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Keahlian;
use Inertia\Inertia;

class SkillController extends Controller
{
    /**
     * Tampilkan daftar keahlian (list + search)
     */
    public function index(Request $request)
    {
        $search = $request->input('search');

        $keahlian = Keahlian::when($search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->orderBy('name')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/Skills/Index', [
            'skills' => $keahlian,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    /**
     * Simpan keahlian baru
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|unique:keahlian,name',
            'description' => 'nullable|string',
        ]);

        Keahlian::create($validated);

        return redirect()->back()->with('success', 'Keahlian berhasil ditambahkan.');
    }

    /**
     * Ambil data keahlian untuk diedit
     */
    public function edit($id)
    {
        $keahlian = Keahlian::findOrFail($id);

        return Inertia::render('Admin/Skills/Edit', [
            'skill' => $keahlian
        ]);
    }

    /**
     * Update data keahlian
     */
    public function update(Request $request, $id)
    {
        $keahlian = Keahlian::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|unique:keahlian,name,' . $keahlian->id,
            'description' => 'nullable|string',
        ]);

        $keahlian->update($validated);

        return redirect()->route('admin.skills.index')->with('success', 'Keahlian berhasil diperbarui.');
    }

    /**
     * Hapus keahlian
     */
    public function destroy($id)
    {
        $keahlian = Keahlian::findOrFail($id);
        $keahlian->delete();

        return redirect()->back()->with('success', 'Keahlian berhasil dihapus.');
    }
}
