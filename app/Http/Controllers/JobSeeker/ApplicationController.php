<?php

namespace App\Http\Controllers;

use App\Models\Application;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ApplicationController extends Controller
{
    /**
     * Tampilkan semua lamaran milik job seeker yang login
     */
    public function index()
    {
        $jobSeekerId = Auth::id(); // id user yang login

        $applications = Application::with(['job', 'resume'])
            ->where('job_seeker_id', $jobSeekerId)
            ->orderBy('application_date', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $applications
        ]);
    }

    /**
     * Buat lamaran baru (cek duplikasi)
     */
    public function store(Request $request)
    {
        $request->validate([
            'job_id' => 'required|integer',
            'resume_id' => 'required|integer',
            'notes' => 'nullable|string',
        ]);

        $jobSeekerId = Auth::id();

        // Cek apakah user sudah pernah melamar job yang sama
        $existing = Application::where('job_id', $request->job_id)
            ->where('job_seeker_id', $jobSeekerId)
            ->first();

        if ($existing) {
            return response()->json([
                'success' => false,
                'message' => 'Anda sudah pernah melamar pekerjaan ini.'
            ], 409);
        }

        // Simpan lamaran baru
        $application = Application::create([
            'job_id' => $request->job_id,
            'job_seeker_id' => $jobSeekerId,
            'resume_id' => $request->resume_id,
            'status' => 'submitted',
            'application_date' => now(),
            'notes' => $request->notes,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Lamaran berhasil dikirim.',
            'data' => $application
        ], 201);
    }

    /**
     * Update status lamaran (misalnya "cancelled")
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|string'
        ]);

        $jobSeekerId = Auth::id();

        // Pastikan lamaran milik user
        $application = Application::where('id', $id)
            ->where('job_seeker_id', $jobSeekerId)
            ->first();

        if (!$application) {
            return response()->json([
                'success' => false,
                'message' => 'Lamaran tidak ditemukan atau bukan milik Anda.'
            ], 404);
        }

        // Update status
        $application->update([
            'status' => $request->status
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Status lamaran berhasil diperbarui.',
            'data' => $application
        ]);
    }
}
