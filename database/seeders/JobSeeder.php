<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class JobSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $companies = \App\Models\Company::all();
        $jobTitles = ['Software Engineer', 'Data Analyst', 'Product Manager', 'UI/UX Designer', 'Marketing Specialist', 'Sales Manager', 'HR Manager', 'Backend Developer', 'Frontend Developer', 'Full Stack Developer'];

        foreach ($companies as $company) {
            $jobCount = rand(2, 4);
            
            for ($i = 0; $i < $jobCount; $i++) {
                \App\Models\Job::create([
                    'company_id' => $company->id,
                    'title' => fake()->randomElement($jobTitles),
                    'description' => fake()->paragraphs(3, true),
                    'requirements' => fake()->paragraphs(2, true),
                    'salary_min' => fake()->numberBetween(5000000, 8000000),
                    'salary_max' => fake()->numberBetween(10000000, 15000000),
                    'currency' => 'IDR',
                    'location' => fake()->city(),
                    'job_type' => fake()->randomElement(['Full Time', 'Part Time', 'Contract', 'Freelance']),
                    'job_level' => fake()->randomElement(['Entry Level', 'Mid Level', 'Senior Level']),
                    'status' => fake()->randomElement(['draft', 'pending_review', 'approved', 'rejected', 'closed']),
                    'posted_date' => now()->subDays(rand(1, 30)),
                    'expiry_date' => now()->addDays(rand(30, 90)),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
}
