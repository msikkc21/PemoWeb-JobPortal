<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class JobSeekerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $jobSeekerRole = \App\Models\Role::where('name', 'JobSeeker')->first();
        $jobSeekerUsers = \App\Models\User::where('role_id', $jobSeekerRole->id)->get();

        foreach ($jobSeekerUsers as $user) {
            \App\Models\JobSeeker::create([
                'user_id' => $user->id,
                'name' => $user->name,
                'gender' => fake()->randomElement(['Male', 'Female']),
                'birth_place' => fake()->city(),
                'birth_date' => fake()->date('Y-m-d', '-25 years'),
                'phone' => fake()->phoneNumber(),
                'address' => fake()->address(),
                'education' => fake()->randomElement(['SMA', 'D3', 'S1', 'S2']),
                'experience' => fake()->paragraph(2),
                'description' => fake()->paragraph(3),
                'photo_path' => null,
                'linkedin' => 'https://linkedin.com/in/' . fake()->userName(),
                'github' => 'https://github.com/' . fake()->userName(),
                'portfolio' => fake()->url(),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
