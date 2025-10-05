<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LowonganKeahlianSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get job vacancies
        $lowongans = DB::table('lowongans')->pluck('id_lowongan')->toArray();
        
        if (empty($lowongans)) {
            $this->command->warn('LowonganKeahlianSeeder skipped: no job vacancies found.');
            return;
        }
        
        // Get skills
        $keahlians = DB::table('keahlians')->pluck('id')->toArray();
        
        if (empty($keahlians)) {
            $this->command->warn('LowonganKeahlianSeeder skipped: no skills found.');
            return;
        }
        
        // Job vacancy to skill mappings (realistic for each job)
        $lowonganKeahlians = [
            // Backend Developer PHP/Laravel needs PHP, Laravel, MySQL skills
            1 => [
                ['id_keahlian' => 1, 'category' => 'Bahasa Pemrograman'], // PHP
                ['id_keahlian' => 4, 'category' => 'Framework'], // Laravel
                ['id_keahlian' => 7, 'category' => 'Database'], // MySQL
            ],
            
            // Frontend Developer React needs JavaScript, React
            2 => [
                ['id_keahlian' => 2, 'category' => 'Bahasa Pemrograman'], // JavaScript
                ['id_keahlian' => 5, 'category' => 'Framework'], // React
            ],
            
            // UI/UX Designer needs UI/UX, Photoshop
            3 => [
                ['id_keahlian' => 9, 'category' => 'Desain'], // UI/UX
                ['id_keahlian' => 10, 'category' => 'Desain'], // Adobe Photoshop
            ],
            
            // Data Analyst needs Python, MySQL
            4 => [
                ['id_keahlian' => 3, 'category' => 'Bahasa Pemrograman'], // Python
                ['id_keahlian' => 7, 'category' => 'Database'], // MySQL
                ['id_keahlian' => 11, 'category' => 'Soft Skill'], // Komunikasi
            ],
            
            // DevOps Engineer needs various skills
            5 => [
                ['id_keahlian' => 1, 'category' => 'Bahasa Pemrograman'], // PHP
                ['id_keahlian' => 3, 'category' => 'Bahasa Pemrograman'], // Python
                ['id_keahlian' => 12, 'category' => 'Soft Skill'], // Manajemen Proyek
            ]
        ];
        
        // Process each job vacancy and assign skills
        foreach ($lowongans as $lowonganId) {
            // If we have specific skills for this vacancy
            if (isset($lowonganKeahlians[$lowonganId])) {
                foreach ($lowonganKeahlians[$lowonganId] as $keahlian) {
                    // Skip if the skill ID doesn't exist in our database
                    if (!in_array($keahlian['id_keahlian'], $keahlians)) {
                        continue;
                    }
                    
                    // Insert the relationship
                    DB::table('lowongan_keahlians')->insert([
                        'id_lowongan' => $lowonganId,
                        'id_keahlian' => $keahlian['id_keahlian']
                    ]);
                }
            } else {
                // For other vacancies, randomly assign 2-3 skills
                $skillCount = rand(2, 3);
                $selectedSkills = array_rand(array_flip($keahlians), min($skillCount, count($keahlians)));
                
                if (!is_array($selectedSkills)) {
                    $selectedSkills = [$selectedSkills];
                }
                
                foreach ($selectedSkills as $keahlianId) {
                    DB::table('lowongan_keahlians')->insert([
                        'id_lowongan' => $lowonganId,
                        'id_keahlian' => $keahlianId
                    ]);
                }
            }
        }
    }
}
