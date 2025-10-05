<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // $table->string('name');
        //     $table->string('display_name');
        //     $table->text('description')->nullable();
        //     $table->boolean('is_active')->default(true);
        // make roles  Admin, Pencari Kerja, Perusahaan
        $roles = [
            [
                'name' => 'Admin',
                'display_name' => 'Administrator',
                'description' => 'User with full access',
                'is_active' => true,
            ],
            [
                'name' => 'Pencari_Kerja',
                'display_name' => 'Job Seeker',
                'description' => 'User looking for jobs',
                'is_active' => true,
            ],
            [
                'name' => 'Perusahaan',
                'display_name' => 'Company',
                'description' => 'User representing a company',
                'is_active' => true,
            ],
        ];
        foreach ($roles as $role) {
            \App\Models\Role::firstOrCreate($role);
        }
    }
}
