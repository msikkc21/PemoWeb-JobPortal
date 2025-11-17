<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = \App\Models\Role::all();
        
        foreach ($roles as $role) {
            $permission = \App\Models\Permission::where('name', $role->name)->first();
            
            if ($permission) {
                \App\Models\RolePermission::create([
                    'role_id' => $role->id,
                    'permission_id' => $permission->id,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
}
