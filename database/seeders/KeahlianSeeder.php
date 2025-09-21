<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Keahlian;
use Faker\Factory as Faker;

class KeahlianSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create('id_ID');

        $kategoriList = ['Programming', 'Design', 'Management', 'Marketing', 'Data Science'];

        for ($i = 1; $i <= 5; $i++) {
            Keahlian::create([
                'nama_keahlian' => $faker->unique()->word(),
                'kategori' => $faker->randomElement($kategoriList),
                'deskripsi' => $faker->sentence(10),
            ]);
        }
    }
}
