<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Role;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = Role::all()->keyBy('name');

        // 1 Admin User
        User::create([
            'name' => 'Super Admin',
            'email' => 'admin@jobportal.com',
            'password' => Hash::make('password123'),
            'role_id' => $roles['admin']->id,
            'email_verified_at' => now(),
            'created_at' => now()->subMonths(6),
            'updated_at' => now()->subMonths(6),
        ]);

        // 5 Company Users
        $companyNames = [
            'PT Teknologi Maju Bersama',
            'PT Digital Solutions Indonesia',
            'PT Inovasi Kreatif Nusantara',
            'PT Berkah Tech Global',
            'PT Startup Gemilang',
        ];

        foreach ($companyNames as $index => $companyName) {
            User::create([
                'name' => $companyName,
                'email' => 'company' . ($index + 1) . '@example.com',
                'password' => Hash::make('password123'),
                'role_id' => $roles['company']->id,
                'email_verified_at' => now()->subDays(rand(10, 60)),
                'created_at' => now()->subDays(rand(30, 180)),
                'updated_at' => now()->subDays(rand(1, 30)),
            ]);
        }

        // 10 Job Seeker Users
        $jobSeekerNames = [
            'Budi Santoso',
            'Rina Kusuma',
            'Ahmad Fauzi',
            'Siti Nurhaliza',
            'Dedi Prasetyo',
            'Maya Andini',
            'Reza Firmansyah',
            'Lina Marlina',
            'Agus Setiawan',
            'Dewi Lestari',
        ];

        foreach ($jobSeekerNames as $index => $name) {
            User::create([
                'name' => $name,
                'email' => 'jobseeker' . ($index + 1) . '@example.com',
                'password' => Hash::make('password123'),
                'role_id' => $roles['jobseeker']->id,
                'email_verified_at' => now()->subDays(rand(5, 90)),
                'created_at' => now()->subDays(rand(20, 150)),
                'updated_at' => now()->subDays(rand(1, 20)),
            ]);
        }
    }
}
