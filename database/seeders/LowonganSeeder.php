<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Lowongan;
use Faker\Factory as Faker;

class LowonganSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create('id_ID');

        for ($i = 1; $i <= 5; $i++) {
            Lowongan::create([
                'id_company' => $faker->numberBetween(1, 5),
                'judul' => $faker->jobTitle(),
                'deskripsi' => $faker->paragraph(5),
                'persyaratan' => $faker->paragraph(3),
                'gaji' => $faker->numberBetween(4000000, 15000000),
                'lokasi' => $faker->city(),
                'jenis_pekerjaan' => $faker->randomElement(['Full-time', 'Part-time', 'Contract', 'Freelance']),
                'level_pekerjaan' => $faker->randomElement(['Entry-level', 'Junior', 'Mid-level', 'Senior', 'Manager']),
                'status' => $faker->randomElement(['aktif', 'nonaktif']),
                'tanggal_posting' => $faker->dateTimeBetween('-1 month', 'now'),
                'tanggal_berakhir' => $faker->dateTimeBetween('now', '+1 month'),
            ]);
        }
    }
}
