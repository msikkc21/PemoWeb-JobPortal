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
        
        // Get job applications with status 'diproses' or 'diterima'
        $validApplications = DB::table('lamarans')
            ->whereIn('lamarans.status', ['diproses', 'diterima'])
            ->join('lowongans', 'lamarans.id_lowongan', '=', 'lowongans.id_lowongan')
            ->join('company_profiles', 'lowongans.id_company', '=', 'company_profiles.id')
            ->select('lamarans.id_lamaran', 'lamarans.status', 'lowongans.judul', 'company_profiles.lokasi', 'company_profiles.nama_perusahaan')
            ->get();
            
        if ($validApplications->isEmpty()) {
            $this->command->warn('WawancaraSeeder skipped: no applications with status diproses or diterima found.');
            return;
        }
        
        // Interview locations and status templates
        $interviewLocations = [
            'online' => ['Online via Zoom', 'Online via Google Meet', 'Online via Microsoft Teams'],
            'office' => ['Kantor Pusat {0}', 'Ruang Meeting {0} Lantai {1}', 'Kantor Cabang {0}']
        ];
        
        $interviewStatuses = [
            'diproses' => ['Menunggu Konfirmasi', 'Dijadwalkan', 'Tertunda'],
            'diterima' => ['Selesai', 'Lulus Wawancara', 'Menunggu Tahap Selanjutnya']
        ];
        
        // Schedule interviews for selected applications
        foreach ($validApplications as $application) {
            // Determine if interview is online or in office (70% chance of in-office)
            $isInOffice = $faker->boolean(70);
            $locationType = $isInOffice ? 'office' : 'online';
            
            // Generate interview date
            if ($application->status === 'diproses') {
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
                $location = str_replace('{0}', $application->nama_perusahaan, $locationTemplate);
                $location = str_replace('{1}', $faker->numberBetween(1, 10), $location);
            }
            
            // Generate status
            $status = $faker->randomElement($interviewStatuses[$application->status]);
            
            // Create the interview
            DB::table('wawancara')->insert([
                'id_lamaran' => $application->id_lamaran,
                'jadwal' => $interviewDateTime,
                'lokasi' => $location,
                'status' => $status,
            ]);
        }
    }
}
