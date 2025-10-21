<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ApplicationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $jobSeekers = \App\Models\JobSeeker::all();
        $jobs = \App\Models\Job::where('status', 'approved')->get();

        foreach ($jobSeekers as $jobSeeker) {
            $resume = \App\Models\Resume::where('job_seeker_id', $jobSeeker->id)->first();
            $randomJobs = $jobs->random(min(rand(2, 4), $jobs->count()));
            
            foreach ($randomJobs as $job) {
                \App\Models\Application::create([
                    'job_id' => $job->id,
                    'job_seeker_id' => $jobSeeker->id,
                    'resume_id' => $resume->id,
                    'status' => fake()->randomElement(['submitted', 'in_process', 'shortlisted', 'interviewed', 'offered', 'accepted', 'rejected']),
                    'application_date' => now()->subDays(rand(1, 20)),
                    'notes' => fake()->optional()->sentence(),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
}
