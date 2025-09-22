<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class KeahlianSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Array of skills with categories and descriptions
        $keahlians = [
            // Programming Languages
            [
                'nama_keahlian' => 'PHP',
                'kategori' => 'Bahasa Pemrograman',
                'deskripsi' => 'Bahasa pemrograman server-side untuk pengembangan web.',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nama_keahlian' => 'JavaScript',
                'kategori' => 'Bahasa Pemrograman',
                'deskripsi' => 'Bahasa pemrograman untuk membuat web interaktif.',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nama_keahlian' => 'Python',
                'kategori' => 'Bahasa Pemrograman',
                'deskripsi' => 'Bahasa pemrograman serba guna untuk berbagai keperluan.',
                'created_at' => now(),
                'updated_at' => now()
            ],
            
            // Frameworks
            [
                'nama_keahlian' => 'Laravel',
                'kategori' => 'Framework',
                'deskripsi' => 'Framework PHP untuk pengembangan web yang ekspresif dan elegan.',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nama_keahlian' => 'React',
                'kategori' => 'Framework',
                'deskripsi' => 'Library JavaScript untuk membangun antarmuka pengguna.',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nama_keahlian' => 'Vue.js',
                'kategori' => 'Framework',
                'deskripsi' => 'Framework JavaScript progresif untuk membangun UI.',
                'created_at' => now(),
                'updated_at' => now()
            ],
            
            // Database
            [
                'nama_keahlian' => 'MySQL',
                'kategori' => 'Database',
                'deskripsi' => 'Sistem manajemen database relasional open source.',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nama_keahlian' => 'MongoDB',
                'kategori' => 'Database',
                'deskripsi' => 'Database NoSQL berorientasi dokumen.',
                'created_at' => now(),
                'updated_at' => now()
            ],
            
            // Design
            [
                'nama_keahlian' => 'UI/UX Design',
                'kategori' => 'Desain',
                'deskripsi' => 'Desain antarmuka pengguna dan pengalaman pengguna.',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nama_keahlian' => 'Adobe Photoshop',
                'kategori' => 'Desain',
                'deskripsi' => 'Perangkat lunak untuk mengedit dan manipulasi gambar.',
                'created_at' => now(),
                'updated_at' => now()
            ],
            
            // Soft Skills
            [
                'nama_keahlian' => 'Komunikasi',
                'kategori' => 'Soft Skill',
                'deskripsi' => 'Kemampuan berkomunikasi dengan efektif dalam tim.',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nama_keahlian' => 'Manajemen Proyek',
                'kategori' => 'Soft Skill',
                'deskripsi' => 'Kemampuan mengelola proyek dari awal hingga selesai.',
                'created_at' => now(),
                'updated_at' => now()
            ]
        ];

        // Insert all skills to the database
        DB::table('keahlians')->insert($keahlians);
    }
}
