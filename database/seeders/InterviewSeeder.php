<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Interview;
use App\Models\Application;
use Carbon\Carbon;
use Faker\Factory as Faker;

class InterviewSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create('id_ID');
        // Hanya buat interview untuk aplikasi dengan status 'interviewed', 'offered', atau 'accepted'
        $applications = Application::whereIn('status', ['interviewed', 'offered', 'accepted'])->get();

        foreach ($applications as $application) {
            // Interview round (1-3 rounds)
            $interviewRounds = rand(1, 2);

            for ($round = 1; $round <= $interviewRounds; $round++) {
                $scheduledDate = Carbon::now()->addDays(rand(1, 20));
                
                // Tentukan status interview
                if ($round < $interviewRounds || in_array($application->status, ['interviewed', 'offered', 'accepted'])) {
                    // Round sebelumnya atau masih dalam proses
                    if ($scheduledDate < Carbon::now()->addDays(5)) {
                        $status = 'completed';
                    } else {
                        $status = 'scheduled';
                    }
                } else {
                    // Round terakhir dan sudah accepted
                    $status = 'completed';
                }

                // 5% chance untuk cancelled
                if (rand(1, 100) <= 5) {
                    $status = 'cancelled';
                }

                $locations = [
                    'Kantor Pusat - Ruang Meeting A',
                    'Virtual - Google Meet',
                    'Virtual - Zoom Meeting',
                    'Kantor Cabang Jakarta',
                    'Virtual - Microsoft Teams',
                ];

                Interview::create([
                    'application_id' => $application->id,
                    'schedule' => $scheduledDate->setHour(rand(9, 16))->setMinute([0, 30][rand(0, 1)]),
                    'location' => $faker->randomElement($locations),
                    'status' => $status,
                    'created_at' => $application->application_date->copy()->addDays(rand(3, 10)),
                    'updated_at' => Carbon::now()->subDays(rand(0, 5)),
                ]);
            }
        }
    }
}
