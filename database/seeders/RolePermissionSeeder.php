<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Role;
use App\Models\Permission;
use Illuminate\Support\Facades\Schema;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        if (! Schema::hasTable('roles') || ! Schema::hasTable('permissions') || ! Schema::hasTable('role_permission')) {
            $this->command->warn('roles/permissions pivot tables not found, skipping RolePermissionSeeder.');
            return;
        }

        // Fetch roles by exact names used in RoleSeeder
        $admin = Role::where('name', 'Admin')->first();
        $company = Role::where('name', 'Perusahaan')->first();
        $jobSeeker = Role::where('name', 'Pencari_Kerja')->first();

        if (! $admin) {
            $this->command->warn('Admin role not found, please run RoleSeeder first.');
            return;
        }

        // Admin: give all permissions
        $allPermissionIds = Permission::pluck('id')->toArray();
        $admin->permissions()->sync($allPermissionIds);

        // Perusahaan (Company) permissions
        if ($company) {
            $companyPermissions = [
                'view_company_profiles',
                'create_company_profile',
                'edit_company_profile',
                'delete_company_profile',
                'view_company_payment',
                'view_jobs',
                'create_job',
                'edit_job',
                'delete_job',
                'publish_job',
                'view_applications',
                'update_application_status',
                'schedule_interview',
                'edit_interview',
                'cancel_interview',
                'view_resumes',
            ];
            $ids = Permission::whereIn('name', $companyPermissions)->pluck('id')->toArray();
            $company->permissions()->sync($ids);
        }

        // Pencari Kerja (Job Seeker) permissions
        if ($jobSeeker) {
            $jobSeekerPermissions = [
                'view_jobs',
                'apply_job',
                'withdraw_application',
                'upload_resume',
                'edit_resume',
                'delete_resume',
                'view_company_profiles',
            ];
            $ids = Permission::whereIn('name', $jobSeekerPermissions)->pluck('id')->toArray();
            $jobSeeker->permissions()->sync($ids);
        }
    }
}
