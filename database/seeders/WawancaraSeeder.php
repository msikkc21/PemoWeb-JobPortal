<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;

class WawancaraSeeder extends Seeder
{
    /**
     * Jalankan seeder.
     */
    public function run(): void
    {
        $faker = Faker::create('id_ID');
        
        // Get job applications with status 'in_process' or 'accepted'
        $validApplications = DB::table('lamarans')
            ->whereIn('lamarans.status', ['in_process', 'accepted'])
            ->join('lowongans', 'lamarans.job_id', '=', 'lowongans.job_id')
            ->join('company_profiles', 'lowongans.company_id', '=', 'company_profiles.id')
            ->select('lamarans.application_id', 'lamarans.status', 'lowongans.title', 'company_profiles.location', 'company_profiles.company_name')
            ->get();
            
        if ($validApplications->isEmpty()) {
            $this->command->warn('WawancaraSeeder skipped: no applications with status in_process or accepted found.');
            return;
        }
        
        // Interview locations and status templates
        $interviewLocations = [
            'online' => ['Online via Zoom', 'Online via Google Meet', 'Online via Microsoft Teams'],
            'office' => ['Kantor Pusat {0}', 'Ruang Meeting {0} Lantai {1}', 'Kantor Cabang {0}']
        ];
        
        $interviewStatuses = [
            'in_process' => ['Menunggu Konfirmasi', 'Dijadwalkan', 'Tertunda'],
            'accepted' => ['Selesai', 'Lulus Wawancara', 'Menunggu Tahap Selanjutnya']
        ];
        
        // Schedule interviews for selected applications
        foreach ($validApplications as $application) {
            // Determine if interview is online or in office (70% chance of in-office)
            $isInOffice = $faker->boolean(70);
            $locationType = $isInOffice ? 'office' : 'online';
            
            // Generate interview date
            if ($application->status === 'in_process') {
                // For applications in process, schedule in the future
                $interviewDate = $faker->dateTimeBetween('+3 days', '+30 days');
            } else {
                // For accepted applications, interview already happened
                $interviewDate = $faker->dateTimeBetween('-30 days', '-1 days');
            }
            
            // Format the date and add a time
            $interviewDateTime = $interviewDate->format('Y-m-d') . ' ' . 
                                $faker->dateTimeBetween('09:00', '17:00')->format('H:i:s');
            
            // Generate location
            $locationTemplate = $faker->randomElement($interviewLocations[$locationType]);
            $location = $locationTemplate;
            
            if ($locationType === 'office') {
                $location = str_replace('{0}', $application->company_name, $locationTemplate);
                $location = str_replace('{1}', $faker->numberBetween(1, 10), $location);
            }
            
            // Generate status
            $status = $faker->randomElement($interviewStatuses[$application->status]);
            
            // Create the interview
            DB::table('wawancara')->insert([
                'application_id' => $application->application_id,
                'schedule' => $interviewDateTime,
                'location' => $location,
                'status' => $status,
            ]);
        }
    }
}
