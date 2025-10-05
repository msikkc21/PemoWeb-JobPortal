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
        // $jobSeekerUserIds = DB::table('pengguna')
        //     ->where('peran', 'Pencari Kerja')
        //     ->pluck('id_pengguna')
        //     ->toArray();
        $jobSeekerRoleId = DB::table('roles')->where('name','Pencari Kerja')->value('id');
        $jobSeekerUserIds = DB::table('pengguna')->where('role_id', $jobSeekerRoleId)->pluck('id_pengguna')->toArray();

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
                'id_pengguna' => $userId,
                'nama' => $faker->name(),
                'jenis_kelamin' => $faker->randomElement(['Laki-laki', 'Perempuan']),
                'tempat_lahir' => $faker->city(),
                'tanggal_lahir' => $faker->dateTimeBetween('-40 years', '-18 years')->format('Y-m-d'),
                'telepon' => $faker->phoneNumber(),
                'alamat' => $faker->address(),
<<<<<<< HEAD
                'pendidikan' => $faker->randomElement(['SMA', 'D3', 'S1', 'S2']),
                'pengalaman' => $faker->paragraphs(rand(1, 3), true),
                'deskripsi' => $faker->sentence(12),
                'path_foto' => null,
                'linkedin' => 'https://www.linkedin.com/in/' . $faker->userName(),
                'github' => 'https://github.com/' . $faker->userName(),
                'portfolio' => 'https://' . $faker->domainName() . '/' . $faker->slug(),
=======
                'pendidikan' => $education,
                'pengalaman' => $experience,
                'deskripsi' => $faker->paragraph(3),
                'path_foto' => null,
                'linkedin' => 'https://www.linkedin.com/in/' . $faker->userName(),
                'github' => $faker->optional(0.7)->url(),
                'portfolio' => $faker->optional(0.6)->url(),
                'dibuat_pada' => now(),
                'diperbarui_pada' => now()
>>>>>>> 30e7fb3476b20672f592f7fa60d6f4509fed3c9c
            ]);
        }
    }
}
