<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class PenggunaSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('pengguna')->insert([
            // 1. Akun Admin
            [
                'nama' => 'Admin JobPortal',
                'email' => 'admin@mail.com',
                'password' => Hash::make('password'), // Password di-hash
                'peran' => 'Admin',
            ],

            // 2. Akun Pencari Kerja
            [
                'nama' => 'Pencari Fulan',
                'email' => 'pencari@mail.com',
                'password' => Hash::make('password'),
                'peran' => 'Pencari Kerja',
            ],
            
            // 3. Akun Perusahaan
            [
                'nama' => 'Perusahaan ABC',
                'email' => 'perusahaan@mail.com',
                'password' => Hash::make('password'),
                'peran' => 'Perusahaan',
            ],
        ]);
    }
}