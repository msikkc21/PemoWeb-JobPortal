<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Job;
use App\Models\Company;
use Faker\Factory as Faker;
use Carbon\Carbon;

class JobSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create('id_ID');
        $companies = Company::all();

        $jobTitles = [
            'Backend Developer',
            'Frontend Developer',
            'Full Stack Developer',
            'Mobile Developer',
            'UI/UX Designer',
            'Product Manager',
            'DevOps Engineer',
            'Data Analyst',
            'Quality Assurance',
            'Project Manager',
            'Digital Marketing Specialist',
            'Content Writer',
            'Business Analyst',
            'System Administrator',
            'Database Administrator',
        ];

        $jobTypes = ['Full Time', 'Part Time', 'Contract', 'Internship', 'Freelance'];
        $jobLevels = ['Entry Level', 'Mid Level', 'Senior Level', 'Lead'];
        $statuses = ['draft', 'pending_review', 'approved', 'rejected', 'closed'];
        $locations = ['Jakarta', 'Bandung', 'Yogyakarta', 'Surabaya', 'Bali', 'Semarang', 'Medan', 'Remote'];

        foreach ($companies as $companyIndex => $company) {
            $jobCount = rand(2, 4);
            
            for ($i = 0; $i < $jobCount; $i++) {
                // Logika status berdasarkan subscription
                $subscription = $company->subscriptions()->latest()->first();
                $hasActiveSubscription = $subscription && $subscription->status === 'active';
                
                if ($i == 0) {
                    // Job pertama selalu approved jika ada subscription aktif
                    $status = $hasActiveSubscription ? 'approved' : 'pending_review';
                } elseif ($i == 1) {
                    // Job kedua draft
                    $status = 'draft';
                } else {
                    // Job lainnya random
                    $status = $hasActiveSubscription 
                        ? $faker->randomElement(['approved', 'pending_review', 'closed'])
                        : $faker->randomElement(['draft', 'pending_review']);
                }

                $salaryMin = rand(4, 10) * 1000000;
                $salaryMax = $salaryMin + rand(2, 5) * 1000000;
                $jobLevel = $faker->randomElement($jobLevels);
                $jobType = $faker->randomElement($jobTypes);
                
                // Experience berdasarkan level
                $experienceMap = [
                    'Entry Level' => '0-2 tahun',
                    'Mid Level' => '3-5 tahun',
                    'Senior Level' => '5-8 tahun',
                    'Lead' => '8+ tahun',
                ];

                $jobTitle = $faker->randomElement($jobTitles);
                $createdAt = Carbon::now()->subDays(rand(5, 60));
                $postedDate = $status === 'approved' ? $createdAt->copy()->addDays(rand(1, 3)) : null;

                Job::create([
                    'company_id' => $company->id,
                    'title' => $jobTitle,
                    'description' => "Kami mencari {$jobLevel} {$jobTitle} yang berpengalaman untuk bergabung dengan tim kami.\n\nTanggung Jawab:\n- Mengembangkan dan memelihara aplikasi berkualitas tinggi\n- Berkolaborasi dengan tim lintas fungsi\n- Menulis kode yang bersih dan terdokumentasi dengan baik\n- Melakukan code review dan testing\n\nRequirements:\n- Pengalaman {$experienceMap[$jobLevel]}\n- Menguasai teknologi terkini\n- Kemampuan problem solving yang baik\n- Dapat bekerja dalam tim",
                    'requirements' => "- Pendidikan minimal S1 Teknik Informatika/sejenisnya\n- Pengalaman {$experienceMap[$jobLevel]}\n- Menguasai teknologi terkait\n- Kemampuan komunikasi yang baik\n- Dapat bekerja dalam deadline",
                    'salary_min' => $salaryMin,
                    'salary_max' => $salaryMax,
                    'currency' => 'IDR',
                    'location' => $faker->randomElement($locations),
                    'job_type' => $jobType,
                    'job_level' => $jobLevel,
                    'status' => $status,
                    'posted_date' => $postedDate,
                    'expiry_date' => $status === 'approved' ? Carbon::now()->addDays(rand(15, 60)) : null,
                    'created_at' => $createdAt,
                    'updated_at' => Carbon::now()->subDays(rand(1, 10)),
                ]);
            }
        }
    }
}
