<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\JobSeeker;
use App\Models\User;
use App\Models\Role;
use Faker\Factory as Faker;
use Carbon\Carbon;

class JobSeekerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create('id_ID');
        $jobSeekerRole = Role::where('name', 'jobseeker')->first();
        $jobSeekerUsers = User::where('role_id', $jobSeekerRole->id)->get();

        $educations = [
            'S1 Teknik Informatika',
            'S1 Sistem Informasi',
            'D3 Teknik Komputer',
            'S1 Desain Komunikasi Visual',
            'S1 Manajemen',
            'S1 Ilmu Komunikasi',
            'D4 Rekayasa Perangkat Lunak',
            'S1 Matematika',
        ];

        $experienceLevels = [
            'Fresh Graduate',
            '1-2 tahun',
            '2-4 tahun',
            '4-6 tahun',
        ];

        $genders = ['Male', 'Female'];

        foreach ($jobSeekerUsers as $index => $user) {
            $gender = $faker->randomElement($genders);
            $education = $faker->randomElement($educations);
            $experienceLevel = $faker->randomElement($experienceLevels);
            $age = rand(22, 35);
            $birthDate = Carbon::now()->subYears($age)->subDays(rand(1, 365));

            JobSeeker::create([
                'user_id' => $user->id,
                'name' => $user->name,
                'gender' => $gender,
                'birth_place' => $faker->city,
                'birth_date' => $birthDate->format('Y-m-d'),
                'phone' => $faker->phoneNumber,
                'address' => $faker->address,
                'education' => $education,
                'experience' => "Saya memiliki pengalaman {$experienceLevel} dalam bidang teknologi. Selama berkarier, saya telah mengerjakan berbagai proyek yang menantang dan meningkatkan kemampuan teknis saya.",
                'description' => "Saya adalah {$user->name}, lulusan {$education} dengan pengalaman {$experienceLevel}. Saya memiliki passion dalam teknologi dan selalu antusias untuk belajar hal-hal baru. Saya mencari peluang untuk berkembang dan berkontribusi dalam tim yang dinamis.",
                'photo_path' => 'profiles/jobseeker_' . ($index + 1) . '.jpg',
                'linkedin' => rand(0, 100) > 30 ? 'https://linkedin.com/in/' . strtolower(str_replace(' ', '-', $user->name)) : null,
                'github' => rand(0, 100) > 40 ? 'https://github.com/' . strtolower(str_replace(' ', '', $user->name)) : null,
                'portfolio' => rand(0, 100) > 50 ? 'https://portfolio.' . strtolower(str_replace(' ', '', $user->name)) . '.com' : null,
                'created_at' => $user->created_at,
                'updated_at' => Carbon::now()->subDays(rand(1, 20)),
            ]);
        }
    }
}
