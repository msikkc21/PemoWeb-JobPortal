<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\Permission::insert([
            ['name' => 'admin', 'display_name' => 'Admin Access', 'group' => 'admin', 'description' => 'Full admin access', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'company', 'display_name' => 'Company Access', 'group' => 'company', 'description' => 'Company access', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'jobseeker', 'display_name' => 'Job Seeker Access', 'group' => 'jobseeker', 'description' => 'Job seeker access', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}
