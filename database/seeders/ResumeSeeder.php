<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;

class ResumeSeeder extends Seeder
{
    /**
     * Jalankan seeder.
     */
    public function run(): void
    {
        $faker = Faker::create('id_ID');
        
        // Get all job seeker IDs
        $pencariKerjaIds = DB::table('jobseeker_profiles')->pluck('jobseeker_id')->toArray();
        
        if (empty($pencariKerjaIds)) {
            $this->command->warn('ResumeSeeder skipped: no job seeker profiles found.');
            return;
        }
        
        // Create resumes for each job seeker
        foreach ($pencariKerjaIds as $pencariId) {
            // Get job seeker's name and education from their profile
            $pencariProfile = DB::table('jobseeker_profiles')
                ->where('jobseeker_id', $pencariId)
                ->first();
            
            if (!$pencariProfile) {
                continue;
            }
            
            // Generate resume data based on job seeker profile
            $fileCV = 'cv_' . strtolower(str_replace(' ', '_', $pencariProfile->name)) . '.pdf';
            
            // Generate parsing data based on profile
            $dataParsing = "Nama: {$pencariProfile->name}\n";
            $dataParsing .= "Pendidikan: {$pencariProfile->education}\n";
            $dataParsing .= "Pengalaman: {$pencariProfile->experience}\n";
            $dataParsing .= "Keahlian: " . $faker->randomElement(['PHP', 'JavaScript', 'Python', 'Laravel', 'React']) . ", " 
                          . $faker->randomElement(['MySQL', 'MongoDB', 'UI/UX Design', 'Komunikasi', 'Manajemen Proyek']);
            
            // Insert resume data
            DB::table('resume')->insert([
                'jobseeker_id' => $pencariId,
                'cv_file' => $fileCV,
                'parsed_data' => $dataParsing,
                'upload_date' => $faker->dateTimeBetween('-60 days', '-1 days')->format('Y-m-d'),
            ]);
        }
    }
}
// }
