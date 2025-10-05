<?php

namespace App\Http\Controllers;

use App\Models\CompanyProfile;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CompanyProfileController extends Controller
{
    public function index()
    {
        $companies = CompanyProfile::all();
        return Inertia::render('Companies/Index', [
            'companies' => $companies
        ]);
    }

    public function create()
    {
        return Inertia::render('Companies/Create');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'nama_perusahaan' => 'required|string|max:255',
            'industri' => 'nullable|string',
            'lokasi' => 'nullable|string',
            'email_perusahaan' => 'nullable|email',
        ]);

        CompanyProfile::create($data);
        return redirect()->route('companies.index')->with('success', 'Profil perusahaan dibuat.');
    }

    public function edit($id)
    {
        $company = CompanyProfile::findOrFail($id);
        return Inertia::render('Companies/Edit', ['company' => $company]);
    }

    public function update(Request $request, $id)
    {
        $company = CompanyProfile::findOrFail($id);
        $data = $request->validate([
            'nama_perusahaan' => 'required|string|max:255',
            'industri' => 'nullable|string',
            'lokasi' => 'nullable|string',
        ]);
        $company->update($data);
        return redirect()->route('companies.index')->with('success', 'Profil perusahaan diperbarui.');
    }

    public function destroy($id)
    {
        $company = CompanyProfile::findOrFail($id);
        $company->delete();
        return redirect()->route('companies.index')->with('success', 'Profil perusahaan dihapus.');
    }
}
