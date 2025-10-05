<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\JobSeekerProfile;
use App\Models\User;
use Faker\Factory as Faker;
use Illuminate\Support\Arr;

class JobSeekerProfileSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create('id_ID');

        // Use existing users only; do not create new users
        $userIds = User::query()->pluck('id')->all();

        if (empty($userIds)) {
            $this->command?->warn('JobSeekerProfileSeeder skipped: no users found to satisfy foreign key id_pengguna.');
            return;
        }

        for ($i = 0; $i < 5; $i++) {
            JobSeekerProfile::create([
                'id_pengguna' => Arr::random($userIds),
                'nama' => $faker->name(),
                'jenis_kelamin' => $faker->randomElement(['Laki-laki', 'Perempuan']),
                'tempat_lahir' => $faker->city(),
                'tanggal_lahir' => $faker->dateTimeBetween('-40 years', '-18 years')->format('Y-m-d'),
                'telepon' => $faker->phoneNumber(),
                'alamat' => $faker->address(),
                'pendidikan' => $faker->randomElement(['SMA', 'D3', 'S1', 'S2']),
                'pengalaman' => $faker->paragraphs(rand(1, 3), true),
                'deskripsi' => $faker->sentence(12),
                'path_foto' => null,
                'linkedin' => 'https://www.linkedin.com/in/' . $faker->userName(),
                'github' => 'https://github.com/' . $faker->userName(),
                'portfolio' => 'https://' . $faker->domainName() . '/' . $faker->slug(),
            ]);
        }
    }
}
