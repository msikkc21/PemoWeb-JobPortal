<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            // First, create roles
            RoleSeeder::class,
            // 1. Create users with different roles
            PenggunaSeeder::class,
            
            // 2. Create company profiles and job seeker profiles
            CompanyProfileSeeder::class,
            JobSeekerProfileSeeder::class,
            
            // 3. Create skills
            KeahlianSeeder::class,
            
            // 4. Create job vacancies from companies
            LowonganSeeder::class,
            
            // 5. Link skills to job vacancies
            LowonganKeahlianSeeder::class,
            
            // 6. Create resumes for job seekers
            ResumeSeeder::class,
            
            // 7. Assign skills to job seekers
            PencariKerjaKeahlianSeeder::class,
            
            // 8. Create job applications
            LamaranSeeder::class,
            
            // 9. Schedule interviews for selected applications
            WawancaraSeeder::class,
        ]);
    }
}
//     }
// }
