<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Resume;
use App\Models\JobSeeker;
use Carbon\Carbon;

class ResumeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $jobSeekers = JobSeeker::all();

        foreach ($jobSeekers as $index => $jobSeeker) {
            // Setiap job seeker punya 1-2 resume
            $resumeCount = rand(1, 2);

            for ($i = 0; $i < $resumeCount; $i++) {
                $uploadDate = Carbon::now()->subDays(rand(1, 90));

                Resume::create([
                    'job_seeker_id' => $jobSeeker->id,
                    'cv_file' => 'resumes/user_' . $jobSeeker->user_id . '_' . ($i + 1) . '.pdf',
                    'parsed_data' => json_encode([
                        'name' => $jobSeeker->name,
                        'education' => $jobSeeker->education,
                        'experience' => $jobSeeker->experience,
                        'phone' => $jobSeeker->phone,
                        'address' => $jobSeeker->address,
                    ]),
                    'upload_date' => $uploadDate,
                    'created_at' => $uploadDate,
                    'updated_at' => Carbon::now()->subDays(rand(1, 30)),
                ]);
            }
        }
    }
}
