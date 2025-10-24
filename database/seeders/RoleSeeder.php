<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Role;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Role::insert([
            ['name' => 'admin', 'display_name' => 'Administrator', 'description' => 'Full system access', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'company', 'display_name' => 'Company', 'description' => 'Manage job postings', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'jobseeker', 'display_name' => 'Job Seeker', 'description' => 'Apply for jobs', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}
