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
        // Order matters! Sesuaikan dengan foreign key dependencies
        
        // 1. Master data & authentication
        $this->call(RoleSeeder::class);
        
        // Create permissions and role-permission mappings
        $this->call(PermissionSeeder::class);
        $this->call(RolePermissionSeeder::class);
        
        // Create users with roles
        $adminRole = \App\Models\Role::where('name', 'admin')->first();
        $companyRole = \App\Models\Role::where('name', 'company')->first();
        $jobSeekerRole = \App\Models\Role::where('name', 'jobseeker')->first();
        
        // 1 Admin User
        User::create([
            'name' => 'Super Admin',
            'email' => 'admin@jobportal.com',
            'email_verified_at' => now(),
            'password' => bcrypt('password123'),
            'role_id' => $adminRole->id,
        ]);
        
        // 5 Company Users
        $companyNames = [
            'PT Teknologi Maju Bersama',
            'PT Digital Solutions Indonesia',
            'PT Inovasi Kreatif Nusantara',
            'PT Berkah Tech Global',
            'PT Startup Gemilang',
        ];

        foreach ($companyNames as $index => $companyName) {
            User::create([
                'name' => $companyName,
                'email' => 'company' . ($index + 1) . '@example.com',
                'email_verified_at' => now()->subDays(rand(10, 60)),
                'password' => bcrypt('password123'),
                'role_id' => $companyRole->id,
            ]);
        }
        
        // 10 Job Seeker Users
        $jobSeekerNames = [
            'Budi Santoso',
            'Rina Kusuma',
            'Ahmad Fauzi',
            'Siti Nurhaliza',
            'Dedi Prasetyo',
            'Maya Andini',
            'Reza Firmansyah',
            'Lina Marlina',
            'Agus Setiawan',
            'Dewi Lestari',
        ];

        foreach ($jobSeekerNames as $index => $name) {
            User::create([
                'name' => $name,
                'email' => 'jobseeker' . ($index + 1) . '@example.com',
                'email_verified_at' => now()->subDays(rand(5, 90)),
                'password' => bcrypt('password123'),
                'role_id' => $jobSeekerRole->id,
            ]);
        }
        
        // 2. Company & subscription setup
        $this->call([
            CompanySeeder::class,
            SubscriptionPlanSeeder::class,
            SubscriptionSeeder::class,
            SubscriptionPaymentSeeder::class,
        ]);
        
        // 3. Skills master data
        $this->call(SkillSeeder::class);
        
        // 4. Job posts
        $this->call([
            JobSeeder::class,
            JobSkillSeeder::class,
        ]);
        
        // 5. Job seekers
        $this->call([
            JobSeekerSeeder::class,
            JobSeekerSkillSeeder::class,
            ResumeSeeder::class,
        ]);
        
        // 6. Applications & interviews (depends on jobs & job seekers)
        $this->call([
            ApplicationSeeder::class,
            InterviewSeeder::class,
        ]);

        $this->command->info('');
        $this->command->info('🎉 Database seeding completed successfully!');
        $this->command->info('');
        $this->command->info('📊 Summary:');
        $this->command->info('  ✓ 3 Roles');
        $this->command->info('  ✓ 16 Users (1 Admin, 5 Companies, 10 Job Seekers)');
        $this->command->info('  ✓ 5 Companies (varied subscription status)');
        $this->command->info('  ✓ 4 Subscription Plans');
        $this->command->info('  ✓ ~50 Skills');
        $this->command->info('  ✓ 10-20 Job Posts (draft, pending, approved, closed)');
        $this->command->info('  ✓ 10 Job Seekers with complete profiles');
        $this->command->info('  ✓ 10-20 Resumes');
        $this->command->info('  ✓ Multiple Applications (various statuses)');
        $this->command->info('  ✓ Multiple Interviews (scheduled, completed, cancelled)');
        $this->command->info('');
        $this->command->info('🔑 Login Credentials:');
        $this->command->info('  Admin: admin@jobportal.com / password123');
        $this->command->info('  Company: company1@example.com - company5@example.com / password123');
        $this->command->info('  Job Seeker: jobseeker1@example.com - jobseeker10@example.com / password123');
    }
}
