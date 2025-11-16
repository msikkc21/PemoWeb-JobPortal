<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LowonganPendingReviewSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * 
     * KENAPA SEEDER INI DIPERLUKAN:
     * - Untuk membuat lowongan dengan status 'pending_review' agar admin bisa test approve/reject
     * - Lowongan ini akan muncul di halaman /admin/jobs/review
     */
    public function run(): void
    {
        // Get first company profile
        $company = DB::table('company_profiles')->first();
        
        if (!$company) {
            $this->command->warn('LowonganPendingReviewSeeder: Tidak ada company profile, skip seeder ini.');
            return;
        }

        $now = now();

        // Insert lowongan dengan status pending_review
        $lowongans = [
            [
                'id_company' => $company->id,
                'judul' => 'Software Developer (Java)',
                'deskripsi' => 'Kami mencari developer Java berpengalaman untuk proyek enterprise',
                'persyaratan' => 'Minimal 3 tahun pengalaman dengan Java dan Spring Boot',
                'gaji' => '15000000',
                'lokasi' => 'Jakarta',
                'jenis_pekerjaan' => 'Full Time',
                'level_pekerjaan' => 'Senior',
                'status' => 'pending_review',
                'tanggal_posting' => null,
                'tanggal_berakhir' => $now->copy()->addDays(30),
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'id_company' => $company->id,
                'judul' => 'Frontend Developer (React)',
                'deskripsi' => 'Dibutuhkan Frontend Developer yang expert di React dan TypeScript',
                'persyaratan' => 'Pengalaman minimal 2 tahun dengan React, TypeScript, dan CSS',
                'gaji' => '12000000',
                'lokasi' => 'Bandung',
                'jenis_pekerjaan' => 'Full Time',
                'level_pekerjaan' => 'Mid Level',
                'status' => 'pending_review',
                'tanggal_posting' => null,
                'tanggal_berakhir' => $now->copy()->addDays(30),
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'id_company' => $company->id,
                'judul' => 'Data Analyst',
                'deskripsi' => 'Cari Data Analyst untuk menganalisis big data dan membuat insights',
                'persyaratan' => 'Minimal 1 tahun pengalaman dengan SQL, Python, dan Data Visualization',
                'gaji' => '10000000',
                'lokasi' => 'Surabaya',
                'jenis_pekerjaan' => 'Full Time',
                'level_pekerjaan' => 'Junior',
                'status' => 'pending_review',
                'tanggal_posting' => null,
                'tanggal_berakhir' => $now->copy()->addDays(30),
                'created_at' => $now,
                'updated_at' => $now,
            ],
        ];

        foreach ($lowongans as $lowongan) {
            DB::table('lowongans')->insert($lowongan);
        }

        $this->command->info('✅ 3 lowongan dengan status pending_review berhasil dibuat!');
    }
}
