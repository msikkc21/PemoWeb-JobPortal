<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ResumeSeeder extends Seeder
{
    /**
     * Jalankan seeder.
     */
    public function run(): void
    {
        DB::table('resume')->insert([
            [
                'id_pencari' => 1,
                'file_cv' => 'cv_john_doe.pdf',
                'data_parsing' => 'Nama: John Doe, Skill: PHP, Laravel, MySQL',
                'tanggal_upload' => now(),
            ],
            [
                'id_pencari' => 2,
                'file_cv' => 'cv_jane_smith.pdf',
                'data_parsing' => 'Nama: Jane Smith, Skill: JavaScript, React, Node.js',
                'tanggal_upload' => now(),
            ]
        ]);
    }
}
