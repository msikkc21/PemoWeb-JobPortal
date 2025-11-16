<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Keahlian;
use Inertia\Inertia;

class SkillController extends Controller
{
    /**
     * GET /admin/skills - Tampilkan daftar keahlian (list + search)
     * KENAPA DIPERLUKAN:
     * - Admin perlu melihat semua skill yang tersedia di sistem
     * - Bisa mencari skill berdasarkan nama, kategori, atau deskripsi
     */
    public function index(Request $request)
    {
        $search = $request->input('search');

        // Query keahlian dengan search di field nama_keahlian, kategori, deskripsi
        $keahlian = Keahlian::when($search, function ($query, $search) {
                $query->where('nama_keahlian', 'like', "%{$search}%")
                      ->orWhere('kategori', 'like', "%{$search}%")
                      ->orWhere('deskripsi', 'like', "%{$search}%");
            })
            ->orderBy('nama_keahlian')
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
     * POST /admin/skills - Simpan keahlian baru
     * KENAPA DIPERLUKAN:
     * - Admin perlu bisa menambah skill baru yang belum ada di sistem
     * - Nama skill WAJIB unik agar tidak duplikat
     * BODY PARAMS:
     * - nama_keahlian (required, unique)
     * - kategori (optional)
     * - deskripsi (optional)
     */
    public function store(Request $request)
    {
        // Validasi: nama_keahlian harus unique di table keahlians
        $validated = $request->validate([
            'nama_keahlian' => 'required|unique:keahlians,nama_keahlian',
            'kategori' => 'nullable|string',
            'deskripsi' => 'nullable|string',
        ]);

        Keahlian::create($validated);

        return redirect()->back()->with('success', 'Keahlian berhasil ditambahkan.');
    }

    /**
     * GET /admin/skills/{id}/edit - Ambil data keahlian untuk diedit
     * KENAPA DIPERLUKAN:
     * - Sebelum mengupdate skill, admin perlu lihat data lama terlebih dahulu
     * PARAM: $id = id keahlian
     */
    public function edit($id)
    {
        $keahlian = Keahlian::findOrFail($id);

        return Inertia::render('Admin/Skills/Edit', [
            'skill' => $keahlian
        ]);
    }

    /**
     * PUT /admin/skills/{id} - Update data keahlian
     * KENAPA DIPERLUKAN:
     * - Admin perlu bisa edit skill yang sudah ada
     * - Nama skill WAJIB unik kecuali untuk record yang sedang di-edit
     * PARAM: $id = id keahlian
     * BODY PARAMS:
     * - nama_keahlian (required, unique except current)
     * - kategori (optional)
     * - deskripsi (optional)
     */
    public function update(Request $request, $id)
    {
        $keahlian = Keahlian::findOrFail($id);

        // Validasi: nama_keahlian unique KECUALI untuk record ini sendiri
        $validated = $request->validate([
            'nama_keahlian' => 'required|unique:keahlians,nama_keahlian,' . $keahlian->id,
            'kategori' => 'nullable|string',
            'deskripsi' => 'nullable|string',
        ]);

        $keahlian->update($validated);

        return redirect()->route('admin.skills.index')->with('success', 'Keahlian berhasil diperbarui.');
    }

    /**
     * DELETE /admin/skills/{id} - Hapus keahlian
     * KENAPA DIPERLUKAN:
     * - Admin perlu bisa menghapus skill yang sudah tidak digunakan
     * - Tapi CEGAH hapus jika skill masih digunakan oleh lowongan atau pencari kerja
     * PARAM: $id = id keahlian
     */
    public function destroy($id)
    {
        $keahlian = Keahlian::findOrFail($id);

        // Cek apakah keahlian ini masih digunakan di lowongan_keahlians
        if ($keahlian->lowongans()->exists()) {
            return redirect()->back()->with('error', 'Keahlian tidak bisa dihapus karena masih digunakan oleh beberapa lowongan.');
        }

        // Cek apakah keahlian ini masih digunakan di pencari_kerja_keahlians
        if ($keahlian->jobSeekers()->exists()) {
            return redirect()->back()->with('error', 'Keahlian tidak bisa dihapus karena masih dimiliki oleh beberapa pencari kerja.');
        }

        $keahlian->delete();

        return redirect()->back()->with('success', 'Keahlian berhasil dihapus.');
    }
}
