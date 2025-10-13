<?php

namespace App\Http\Controllers;

use App\Models\Lowongan;
use App\Models\Keahlian;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LowonganController extends Controller
{
    public function index()
    {
        $lowongans = Lowongan::with(['company', 'skills'])
            ->where('status', 'dibuka')
            ->where('approve', 1)
            ->orderBy('tanggal_posting', 'desc')
            ->get()
            ->map(function ($lowongan) {
                return [
                    'id_lowongan' => $lowongan->id_lowongan,
                    'judul' => $lowongan->judul,
                    'deskripsi' => $lowongan->deskripsi,
                    'persyaratan' => $lowongan->persyaratan,
                    'gaji' => $lowongan->gaji,
                    'lokasi' => $lowongan->lokasi,
                    'jenis_pekerjaan' => $lowongan->jenis_pekerjaan,
                    'level_pekerjaan' => $lowongan->level_pekerjaan,
                    'status' => $lowongan->status,
                    'tanggal_posting' => $lowongan->tanggal_posting,
                    'tanggal_berakhir' => $lowongan->tanggal_berakhir,
                    'approve' => $lowongan->approve,
                    'company' => $lowongan->companyProfile,
                    'skills' => $lowongan->skills
                ];
            });

        $skills = Keahlian::all(['id', 'nama_keahlian', 'kategori']);

        return Inertia::render('ViewJobs', [
            'lowongans' => $lowongans,
            'skills' => $skills
        ]);
    }
}