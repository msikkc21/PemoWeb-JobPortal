<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // $table->string('name')->unique();
        //     $table->string('display_name');
        //     $table->string('group')->nullable();
        //     $table->text('description')->nullable();

        // If the permissions table doesn't exist (early during setup), skip seeding
        if (! Schema::hasTable('permissions')) {
            $this->command->warn('permissions table not found, skipping PermissionSeeder.');
            return;
        }

        $permissions = [
            // User Management
            ["name" => "view_users", "display_name" => "View Users", "group" => "User Management", "description" => "Permission to view user list", "is_active" => true],
            ["name" => "create_user", "display_name" => "Create User", "group" => "User Management", "description" => "Permission to create new users", "is_active" => true],
            ["name" => "edit_user", "display_name" => "Edit User", "group" => "User Management", "description" => "Permission to edit user data", "is_active" => true],
            ["name" => "delete_user", "display_name" => "Delete User", "group" => "User Management", "description" => "Permission to delete users", "is_active" => true],
            ["name" => "assign_role", "display_name" => "Assign Role", "group" => "User Management", "description" => "Assign or remove roles for users", "is_active" => true],

            // Roles & Permissions management
            ["name" => "view_roles", "display_name" => "View Roles", "group" => "Roles & Permissions", "description" => "View roles list", "is_active" => true],
            ["name" => "create_role", "display_name" => "Create Role", "group" => "Roles & Permissions", "description" => "Create new role", "is_active" => true],
            ["name" => "edit_role", "display_name" => "Edit Role", "group" => "Roles & Permissions", "description" => "Edit existing role", "is_active" => true],
            ["name" => "delete_role", "display_name" => "Delete Role", "group" => "Roles & Permissions", "description" => "Delete role", "is_active" => true],
            ["name" => "view_permissions", "display_name" => "View Permissions", "group" => "Roles & Permissions", "description" => "View permissions list", "is_active" => true],
            ["name" => "manage_permissions", "display_name" => "Manage Permissions", "group" => "Roles & Permissions", "description" => "Create/edit/delete permissions", "is_active" => true],

            // Company / Profiles
            ["name" => "view_company_profiles", "display_name" => "View Company Profiles", "group" => "Company", "description" => "View company profiles", "is_active" => true],
            ["name" => "create_company_profile", "display_name" => "Create Company Profile", "group" => "Company", "description" => "Create company profile", "is_active" => true],
            ["name" => "edit_company_profile", "display_name" => "Edit Company Profile", "group" => "Company", "description" => "Edit company profile", "is_active" => true],
            ["name" => "delete_company_profile", "display_name" => "Delete Company Profile", "group" => "Company", "description" => "Delete company profile", "is_active" => true],

            // Jobs (Lowongan)
            ["name" => "view_jobs", "display_name" => "View Jobs", "group" => "Jobs", "description" => "View job listings", "is_active" => true],
            ["name" => "create_job", "display_name" => "Create Job", "group" => "Jobs", "description" => "Create job posting", "is_active" => true],
            ["name" => "edit_job", "display_name" => "Edit Job", "group" => "Jobs", "description" => "Edit own job posting", "is_active" => true],
            ["name" => "delete_job", "display_name" => "Delete Job", "group" => "Jobs", "description" => "Delete own job posting", "is_active" => true],
            ["name" => "publish_job", "display_name" => "Publish Job", "group" => "Jobs", "description" => "Publish job posting", "is_active" => true],

            // Applications (Lamaran)
            ["name" => "apply_job", "display_name" => "Apply Job", "group" => "Applications", "description" => "Apply to job postings", "is_active" => true],
            ["name" => "withdraw_application", "display_name" => "Withdraw Application", "group" => "Applications", "description" => "Withdraw a submitted application", "is_active" => true],
            ["name" => "view_applications", "display_name" => "View Applications", "group" => "Applications", "description" => "View applications for your jobs", "is_active" => true],
            ["name" => "update_application_status", "display_name" => "Update Application Status", "group" => "Applications", "description" => "Update status of applications", "is_active" => true],

            // Interviews
            ["name" => "schedule_interview", "display_name" => "Schedule Interview", "group" => "Interviews", "description" => "Schedule an interview", "is_active" => true],
            ["name" => "edit_interview", "display_name" => "Edit Interview", "group" => "Interviews", "description" => "Edit interview details", "is_active" => true],
            ["name" => "cancel_interview", "display_name" => "Cancel Interview", "group" => "Interviews", "description" => "Cancel an interview", "is_active" => true],

            // Resumes
            ["name" => "upload_resume", "display_name" => "Upload Resume", "group" => "Resume", "description" => "Upload resume", "is_active" => true],
            ["name" => "edit_resume", "display_name" => "Edit Resume", "group" => "Resume", "description" => "Edit resume", "is_active" => true],
            ["name" => "delete_resume", "display_name" => "Delete Resume", "group" => "Resume", "description" => "Delete resume", "is_active" => true],
            ["name" => "view_resumes", "display_name" => "View Resumes", "group" => "Resume", "description" => "View applicant resumes", "is_active" => true],

            // Skills
            ["name" => "view_skills", "display_name" => "View Skills", "group" => "Skills", "description" => "View skills list", "is_active" => true],
            ["name" => "create_skill", "display_name" => "Create Skill", "group" => "Skills", "description" => "Create a new skill", "is_active" => true],
            ["name" => "edit_skill", "display_name" => "Edit Skill", "group" => "Skills", "description" => "Edit skill", "is_active" => true],
            ["name" => "delete_skill", "display_name" => "Delete Skill", "group" => "Skills", "description" => "Delete skill", "is_active" => true],

            // Reports & Settings
            ["name" => "view_reports", "display_name" => "View Reports", "group" => "Reports", "description" => "View system reports", "is_active" => true],
            ["name" => "export_reports", "display_name" => "Export Reports", "group" => "Reports", "description" => "Export report data", "is_active" => true],
            ["name" => "manage_settings", "display_name" => "Manage Settings", "group" => "Settings", "description" => "Manage application settings", "is_active" => true],
            ["name" => "impersonate_user", "display_name" => "Impersonate User", "group" => "Settings", "description" => "Impersonate another user (admin only)", "is_active" => true],
        ];

        foreach ($permissions as $perm) {
            DB::table('permissions')->updateOrInsert(
                ['name' => $perm['name']],
                [
                    'display_name' => $perm['display_name'] ?? null,
                    'group' => $perm['group'] ?? null,
                    'description' => $perm['description'] ?? null,
                    'is_active' => $perm['is_active'] ?? true,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }

        // TAMBAHAN: Assign 'admin' permission ke Admin role
        // KENAPA PENTING: Admin user harus punya permission 'admin' agar bisa akses /admin/dashboard
        $this->assignAdminPermission();
    }

    /**
     * Assign admin permission to Admin role
     */
    private function assignAdminPermission()
    {
        // Get Admin role
        $adminRole = DB::table('roles')->where('name', 'Admin')->first();
        if (!$adminRole) {
            $this->command->warn('❌ Admin role not found. Run RoleSeeder first!');
            return;
        }

        // Create 'admin' permission jika belum ada
        // Create 'admin' permission jika belum ada (query builder tidak punya firstOrCreate)
        $adminPerm = DB::table('permissions')->where('name', 'admin')->first();
        if (! $adminPerm) {
            DB::table('permissions')->insert([
                'name' => 'admin',
                'display_name' => 'Admin Access',
                'group' => 'system',
                'description' => 'Akses ke admin panel',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            $adminPerm = DB::table('permissions')->where('name', 'admin')->first();
        }

        // Check apakah Admin role sudah punya admin permission
        $rolePermExists = DB::table('role_permission')
            ->where('role_id', $adminRole->id)
            ->where('permission_id', $adminPerm->id)
            ->exists();

        if (!$rolePermExists) {
            DB::table('role_permission')->insert([
                'role_id' => $adminRole->id,
                'permission_id' => $adminPerm->id,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            $this->command->info('✅ Permission "admin" assigned to role "Admin"');
        } else {
            $this->command->info('✅ Permission "admin" sudah ada di role "Admin"');
        }
    }
}
