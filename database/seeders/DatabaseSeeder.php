<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Don't create users; rely on existing users only
        $this->call([
            CompanyProfileSeeder::class,
            JobSeekerProfileSeeder::class,
        ]);
    }
}
