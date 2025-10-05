<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;

class LamaranSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create('id_ID');
        
        // Get job seekers with resumes
        $jobSeekerResumes = DB::table('resume')
            ->join('jobseeker_profiles', 'resume.id_pencari', '=', 'jobseeker_profiles.id_pencari')
            ->select('resume.id_resume', 'resume.id_pencari', 'jobseeker_profiles.nama')
            ->get();
            
        if ($jobSeekerResumes->isEmpty()) {
            $this->command->warn('LamaranSeeder skipped: no job seeker resumes found.');
            return;
        }
        
        // Get all job vacancies
        $lowongans = DB::table('lowongans')
            ->select('id_lowongan', 'judul', 'id_company')
            ->get();
            
        if ($lowongans->isEmpty()) {
            $this->command->warn('LamaranSeeder skipped: no job vacancies found.');
            return;
        }
        
        // Track which job seekers have already applied to which jobs to avoid duplicates
        $applications = [];
        
        // For each job seeker, create 1-3 job applications
        foreach ($jobSeekerResumes as $jobSeeker) {
            // How many applications this job seeker will make (1-3)
            $applicationCount = rand(1, min(3, $lowongans->count()));
            
            // Randomly select job vacancies for this job seeker to apply
            $shuffledVacancies = $lowongans->shuffle()->take($applicationCount);
            
            foreach ($shuffledVacancies as $vacancy) {
                // Skip if already applied
                $key = $jobSeeker->id_pencari . '-' . $vacancy->id_lowongan;
                if (isset($applications[$key])) {
                    continue;
                }
                
                $applications[$key] = true;
                
                // Generate application date (within the last 30 days)
                $applicationDate = $faker->dateTimeBetween('-30 days', 'now')->format('Y-m-d');
                
                // Generate status with weighted probabilities
                $statuses = ['dikirim' => 30, 'diproses' => 40, 'diterima' => 20, 'ditolak' => 10];
                $status = $this->getRandomWeightedElement($statuses);
                
                // Generate a note/cover letter
                $catatan = $this->generateCoverLetter($jobSeeker->nama, $vacancy->judul);
                
                // Create the job application
                DB::table('lamarans')->insert([
                    'id_lowongan' => $vacancy->id_lowongan,
                    'id_pencari' => $jobSeeker->id_pencari,
                    'id_resume' => $jobSeeker->id_resume,
                    'status' => $status,
                    'tanggal_lamaran' => $applicationDate,
                    'catatan' => $catatan,
                    'created_at' => $applicationDate . ' ' . $faker->time(),
                    'updated_at' => $applicationDate . ' ' . $faker->time(),
                ]);
            }
        }
    }
    
    /**
     * Generate a cover letter for a job application
     * 
     * @param string $name Job seeker name
     * @param string $jobTitle Job title
     * @return string Cover letter
     */
    private function generateCoverLetter($name, $jobTitle)
    {
        $templates = [
            "Dengan surat ini, saya {name} mengajukan lamaran untuk posisi {jobTitle}. Saya memiliki pengalaman dan kualifikasi yang sesuai dengan posisi ini. Saya sangat tertarik dengan peluang ini dan berharap dapat berkontribusi pada perusahaan Anda.",
            
            "Saya {name} sangat tertarik dengan posisi {jobTitle} yang ditawarkan. Dengan latar belakang dan kemampuan yang saya miliki, saya yakin dapat menjadi aset yang berharga bagi tim Anda. Saya berharap dapat membahas lebih lanjut tentang posisi ini dalam wawancara.",
            
            "Sebagai seorang profesional yang berdedikasi, saya {name} mengajukan lamaran untuk posisi {jobTitle}. Keahlian dan pengalaman saya sangat sesuai dengan posisi yang ditawarkan. Saya berharap dapat bertemu dan mendiskusikan bagaimana saya dapat berkontribusi pada kesuksesan perusahaan."
        ];
        
        $template = $templates[array_rand($templates)];
        return str_replace(['{name}', '{jobTitle}'], [$name, $jobTitle], $template);
    }
    
    /**
     * Get a random element with weighted probabilities.
     *
     * @param array $weightedValues Array of values with their weights
     * @return string The selected element
     */
    private function getRandomWeightedElement(array $weightedValues)
    {
        $rand = rand(1, array_sum($weightedValues));
        
        foreach ($weightedValues as $key => $value) {
            $rand -= $value;
            if ($rand <= 0) {
                return $key;
            }
        }
        
        return array_key_first($weightedValues); // Fallback
    }
}
