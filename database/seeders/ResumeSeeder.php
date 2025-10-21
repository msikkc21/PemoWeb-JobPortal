<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ResumeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $jobSeekers = \App\Models\JobSeeker::all();

        foreach ($jobSeekers as $jobSeeker) {
            \App\Models\Resume::create([
                'job_seeker_id' => $jobSeeker->id,
                'cv_file' => 'resumes/cv_' . $jobSeeker->id . '.pdf',
                'parsed_data' => json_encode([
                    'name' => $jobSeeker->name,
                    'education' => $jobSeeker->education,
                    'experience' => $jobSeeker->experience,
                ]),
                'upload_date' => now()->subDays(rand(5, 30)),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
