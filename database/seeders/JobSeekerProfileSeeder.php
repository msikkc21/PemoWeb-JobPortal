<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\JobSeekerProfile;
use Faker\Factory as Faker;
use Illuminate\Support\Facades\DB;

class JobSeekerProfileSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create('id_ID');

        // Get all users with 'Pencari Kerja' role
        $jobSeekerRoleId = DB::table('roles')->where('name','Pencari_Kerja')->value('id');
        $jobSeekerUserIds = DB::table('users')->where('role_id', $jobSeekerRoleId)->pluck('id')->toArray();

        if (empty($jobSeekerUserIds)) {
            $this->command->warn('JobSeekerProfileSeeder skipped: no users with Pencari Kerja role found.');
            return;
        }

        // Create a job seeker profile for each user with the 'Pencari Kerja' role
        foreach ($jobSeekerUserIds as $index => $userId) {
            // Generate specific educational background and experience
            $education = $faker->randomElement(['SMA', 'D3', 'S1', 'S2']);
            
            switch ($education) {
                case 'SMA':
                    $experience = "Pengalaman kerja sebagai " . $faker->jobTitle() . " selama " . $faker->numberBetween(1, 3) . " tahun.";
                    break;
                case 'D3':
                    $experience = "Lulusan D3 " . $faker->randomElement(['Teknik Informatika', 'Akuntansi', 'Manajemen', 'Desain Grafis']) . 
                                 " dengan pengalaman kerja sebagai " . $faker->jobTitle() . " selama " . $faker->numberBetween(1, 5) . " tahun.";
                    break;
                case 'S1':
                    $experience = "Sarjana " . $faker->randomElement(['Teknik Informatika', 'Ekonomi', 'Hukum', 'Komunikasi', 'Psikologi']) . 
                                 " dengan pengalaman kerja di bidang " . $faker->word() . " selama " . $faker->numberBetween(1, 7) . " tahun.";
                    break;
                case 'S2':
                    $experience = "Magister " . $faker->randomElement(['Teknologi Informasi', 'Manajemen', 'Hukum Bisnis', 'Komunikasi']) . 
                                 " dengan pengalaman kerja sebagai " . $faker->jobTitle() . " selama " . $faker->numberBetween(2, 10) . " tahun.";
                    break;
            }
            
            DB::table('jobseeker_profiles')->insert([
                'user_id' => $userId,
                'name' => $faker->name(),
                'gender' => $faker->randomElement(['Laki-laki', 'Perempuan']),
                'birth_place' => $faker->city(),
                'birth_date' => $faker->dateTimeBetween('-40 years', '-18 years')->format('Y-m-d'),
                'phone' => $faker->phoneNumber(),
                'address' => $faker->address(),
                'education' => $education,
                'experience' => $experience,
                'description' => $faker->paragraph(3),
                'photo_path' => null,
                'linkedin' => 'https://www.linkedin.com/in/' . $faker->userName(),
                'github' => $faker->optional(0.7)->url(),
                'portfolio' => $faker->optional(0.6)->url(),
                'created_at' => now(),
                'updated_at' => now()
            ]);
        }
    }
}
