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
        
        $adminRoleId = DB::table('roles')->where('name','Admin')->value('id');

        // Create one admin user
        DB::table('pengguna')->insert([
            'name' => 'Admin JobPortal',
            'email' => 'admin@jobportal.com',
            'password' => Hash::make('password123'),
            'role_id' => $adminRoleId,
            'created_at' => now(),
            'updated_at' => now(),
        ]);


        $jobSeekerRoleId = DB::table('roles')->where('name','Pencari_Kerja')->value('id');

        // Create 5 job seekers
        for ($i = 1; $i <= 5; $i++) {
            DB::table('pengguna')->insert([
                'name' => $faker->name,
                'email' => 'pencarikerja' . $i . '@example.com',
                'password' => Hash::make('password123'),
                'role_id' => $jobSeekerRoleId,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }


        $companyRoleId = DB::table('roles')->where('name','Perusahaan')->value('id');

        // Create 3 companies
        $companyNames = ['PT Teknologi Maju', 'CV Desain Kreatif', 'PT Global Inovasi'];
        
        for ($i = 0; $i < count($companyNames); $i++) {
            DB::table('pengguna')->insert([
                'name' => $companyNames[$i],
                'email' => 'perusahaan' . ($i + 1) . '@example.com',
                'password' => Hash::make('password123'),
                'role_id' => $companyRoleId,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}