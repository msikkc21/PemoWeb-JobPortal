<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class WawancaraSeeder extends Seeder
{
    /**
     * Jalankan seeder.
     */
    public function run(): void
    {
        DB::table('wawancara')->insert([
            [
                'id_lamaran' => 1,
                'jadwal' => '2025-09-30 10:00:00',
                'lokasi' => 'Ruang Meeting Lantai 2',
                'status' => 'Menunggu Konfirmasi',
            ],
            [
                'id_lamaran' => 2,
                'jadwal' => '2025-10-01 14:00:00',
                'lokasi' => 'Online (Zoom)',
                'status' => 'Dijadwalkan',
            ],
            [
                'id_lamaran' => 3,
                'jadwal' => '2025-10-05 09:00:00',
                'lokasi' => 'Kantor Pusat Jakarta',
                'status' => 'Selesai',
            ],
        ]);
    }
}
