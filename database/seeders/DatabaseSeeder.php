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
        // Create roles first
        $this->call(RoleSeeder::class);
        
        // Create permissions and role-permission mappings
        $this->call(PermissionSeeder::class);
        $this->call(RolePermissionSeeder::class);
        
        // Create users with roles
        $adminRole = \App\Models\Role::where('name', 'Admin')->first();
        $companyRole = \App\Models\Role::where('name', 'Company')->first();
        $jobSeekerRole = \App\Models\Role::where('name', 'JobSeeker')->first();
        
        // Create admin user
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@jobportal.com',
            'email_verified_at' => now(),
            'password' => bcrypt('password'),
            'role_id' => $adminRole->id,
        ]);
        
        // Create company users
        User::create([
            'name' => 'PT Tech Inovasi',
            'email' => 'company1@example.com',
            'email_verified_at' => now(),
            'password' => bcrypt('password'),
            'role_id' => $companyRole->id,
        ]);
        
        User::create([
            'name' => 'CV Digital Solusi',
            'email' => 'company2@example.com',
            'email_verified_at' => now(),
            'password' => bcrypt('password'),
            'role_id' => $companyRole->id,
        ]);
        
        User::create([
            'name' => 'PT Maju Bersama',
            'email' => 'company3@example.com',
            'email_verified_at' => now(),
            'password' => bcrypt('password'),
            'role_id' => $companyRole->id,
        ]);
        
        // Create job seeker users
        User::create([
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'email_verified_at' => now(),
            'password' => bcrypt('password'),
            'role_id' => $jobSeekerRole->id,
        ]);
        
        User::create([
            'name' => 'Jane Smith',
            'email' => 'jane@example.com',
            'email_verified_at' => now(),
            'password' => bcrypt('password'),
            'role_id' => $jobSeekerRole->id,
        ]);
        
        User::create([
            'name' => 'Michael Johnson',
            'email' => 'michael@example.com',
            'email_verified_at' => now(),
            'password' => bcrypt('password'),
            'role_id' => $jobSeekerRole->id,
        ]);
        
        // Seed related data
        $this->call([
            CompanySeeder::class,
            JobSeekerSeeder::class,
            SkillSeeder::class,
            SubscriptionPlanSeeder::class,
            SubscriptionSeeder::class,
            SubscriptionPaymentSeeder::class,
            JobSeeder::class,
            JobSkillSeeder::class,
            JobSeekerSkillSeeder::class,
            ResumeSeeder::class,
            ApplicationSeeder::class,
            InterviewSeeder::class,
        ]);
    }
}
