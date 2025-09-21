<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\CompanyProfile;
use App\Models\User;
use Faker\Factory as Faker;
use Illuminate\Support\Arr;

class CompanyProfileSeeder extends Seeder
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
            // Respect instruction to not create users; skip if none exist
            $this->command?->warn('CompanyProfileSeeder skipped: no users found to satisfy foreign key id_pengguna.');
            return;
        }

        // Create 5 dummy company profiles
        for ($i = 0; $i < 5; $i++) {
            CompanyProfile::create([
                'id_pengguna' => Arr::random($userIds),
                'nama_perusahaan' => $faker->company(),
                'industri' => $faker->randomElement(['Teknologi', 'Keuangan', 'Pendidikan', 'Kesehatan', 'Manufaktur', 'Logistik', 'Ritel']),
                'deskripsi' => $faker->paragraphs(rand(2, 4), true),
                'lokasi' => $faker->city() . ', ' . $faker->country(),
                'website' => 'https://' . $faker->domainName(),
                'email_perusahaan' => $faker->unique()->companyEmail(),
                'telepon' => $faker->phoneNumber(),
                'alamat' => $faker->address(),
                'path_foto' => null,
                'jumlah_karyawan' => $faker->numberBetween(10, 5000),
                'tahun_dibentuk' => $faker->numberBetween(1970, (int)date('Y')),
            ]);
        }
    }
}
