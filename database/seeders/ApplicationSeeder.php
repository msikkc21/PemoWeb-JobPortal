<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Application;
use App\Models\Job;
use App\Models\JobSeeker;
use App\Models\Resume;
use Carbon\Carbon;

class ApplicationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $jobs = Job::where('status', 'approved')->get();
        $jobSeekers = JobSeeker::with('resumes')->get();
        $statuses = ['submitted', 'in_process', 'shortlisted', 'interviewed', 'offered', 'accepted', 'rejected'];

        $appliedCombinations = [];

        foreach ($jobSeekers as $jsIndex => $jobSeeker) {
            // Setiap job seeker apply ke 1-4 jobs
            $applicationCount = rand(1, 4);
            $appliedJobs = $jobs->random(min($applicationCount, $jobs->count()));

            foreach ($appliedJobs as $job) {
                // Cek apakah sudah apply ke job ini
                $combination = $jobSeeker->id . '-' . $job->id;
                if (in_array($combination, $appliedCombinations)) {
                    continue;
                }
                $appliedCombinations[] = $combination;

                // Pilih resume pertama
                $resume = $jobSeeker->resumes->first();

                if (!$resume) {
                    continue;
                }

                // Status distribution:
                // 30% submitted, 25% in_process, 20% shortlisted, 10% interviewed, 5% offered, 5% accepted, 5% rejected
                $rand = rand(1, 100);
                if ($rand <= 30) {
                    $status = 'submitted';
                } elseif ($rand <= 55) {
                    $status = 'in_process';
                } elseif ($rand <= 75) {
                    $status = 'shortlisted';
                } elseif ($rand <= 85) {
                    $status = 'interviewed';
                } elseif ($rand <= 90) {
                    $status = 'offered';
                } elseif ($rand <= 95) {
                    $status = 'accepted';
                } else {
                    $status = 'rejected';
                }

                $appliedAt = Carbon::now()->subDays(rand(1, 30));

                Application::create([
                    'job_id' => $job->id,
                    'job_seeker_id' => $jobSeeker->id,
                    'resume_id' => $resume->id,
                    'status' => $status,
                    'application_date' => $appliedAt,
                    'notes' => $status === 'rejected' 
                        ? 'Terima kasih atas lamarannya. Saat ini kami memilih kandidat lain yang lebih sesuai.'
                        : ($status === 'accepted' 
                            ? 'Selamat! Anda diterima untuk posisi ini. Silakan tunggu informasi selanjutnya.'
                            : null),
                    'created_at' => $appliedAt,
                    'updated_at' => Carbon::now()->subDays(rand(0, 15)),
                ]);
            }
        }
    }
}
