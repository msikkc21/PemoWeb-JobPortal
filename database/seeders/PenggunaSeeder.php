<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Faker\Factory as Faker;

class PenggunaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create('id_ID');
        
        // Create one admin user
        DB::table('pengguna')->insert([
            'nama' => 'Admin JobPortal',
            'email' => 'admin@jobportal.com',
            'password' => Hash::make('password123'),
            'peran' => 'Admin',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Create 5 job seekers
        for ($i = 1; $i <= 5; $i++) {
            DB::table('pengguna')->insert([
                'nama' => $faker->name,
                'email' => 'pencarikerja' . $i . '@example.com',
                'password' => Hash::make('password123'),
                'peran' => 'Pencari Kerja',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // Create 3 companies
        $companyNames = ['PT Teknologi Maju', 'CV Desain Kreatif', 'PT Global Inovasi'];
        
        for ($i = 0; $i < count($companyNames); $i++) {
            DB::table('pengguna')->insert([
                'nama' => $companyNames[$i],
                'email' => 'perusahaan' . ($i + 1) . '@example.com',
                'password' => Hash::make('password123'),
                'peran' => 'Perusahaan',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}