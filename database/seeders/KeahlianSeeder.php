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
                'skill_name' => 'PHP',
                'category' => 'Bahasa Pemrograman',
                'description' => 'Bahasa pemrograman server-side untuk pengembangan web.',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'skill_name' => 'JavaScript',
                'category' => 'Bahasa Pemrograman',
                'description' => 'Bahasa pemrograman untuk membuat web interaktif.',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'skill_name' => 'Python',
                'category' => 'Bahasa Pemrograman',
                'description' => 'Bahasa pemrograman serba guna untuk berbagai keperluan.',
                'created_at' => now(),
                'updated_at' => now()
            ],
            
            // Frameworks
            [
                'skill_name' => 'Laravel',
                'category' => 'Framework',
                'description' => 'Framework PHP untuk pengembangan web yang ekspresif dan elegan.',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'skill_name' => 'React',
                'category' => 'Framework',
                'description' => 'Library JavaScript untuk membangun antarmuka pengguna.',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'skill_name' => 'Vue.js',
                'category' => 'Framework',
                'description' => 'Framework JavaScript progresif untuk membangun UI.',
                'created_at' => now(),
                'updated_at' => now()
            ],
            
            // Database
            [
                'skill_name' => 'MySQL',
                'category' => 'Database',
                'description' => 'Sistem manajemen database relasional open source.',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'skill_name' => 'MongoDB',
                'category' => 'Database',
                'description' => 'Database NoSQL berorientasi dokumen.',
                'created_at' => now(),
                'updated_at' => now()
            ],
            
            // Design
            [
                'skill_name' => 'UI/UX Design',
                'category' => 'Desain',
                'description' => 'Desain antarmuka pengguna dan pengalaman pengguna.',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'skill_name' => 'Adobe Photoshop',
                'category' => 'Desain',
                'description' => 'Perangkat lunak untuk mengedit dan manipulasi gambar.',
                'created_at' => now(),
                'updated_at' => now()
            ],
            
            // Soft Skills
            [
                'skill_name' => 'Komunikasi',
                'category' => 'Soft Skill',
                'description' => 'Kemampuan berkomunikasi dengan efektif dalam tim.',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'skill_name' => 'Manajemen Proyek',
                'category' => 'Soft Skill',
                'description' => 'Kemampuan mengelola proyek dari awal hingga selesai.',
                'created_at' => now(),
                'updated_at' => now()
            ]
        ];

        // Insert all skills to the database
        DB::table('keahlians')->insert($keahlians);
    }
}
