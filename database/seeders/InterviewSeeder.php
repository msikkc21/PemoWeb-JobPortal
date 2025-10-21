<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class InterviewSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $applications = \App\Models\Application::whereIn('status', ['shortlisted', 'interviewed'])->get();

        foreach ($applications as $application) {
            \App\Models\Interview::create([
                'application_id' => $application->id,
                'schedule' => now()->addDays(rand(1, 14))->setHour(rand(9, 16))->setMinute(0),
                'location' => fake()->randomElement(['Office', 'Zoom Meeting', 'Google Meet', 'Microsoft Teams']),
                'status' => fake()->randomElement(['scheduled', 'completed', 'cancelled']),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
