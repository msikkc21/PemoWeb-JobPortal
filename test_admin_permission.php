<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$admin = \App\Models\User::where('email', 'admin@jobportal.com')->with('role.permissions')->first();
if ($admin) {
    echo "✅ Admin user found: " . $admin->nama . "\n";
    echo "Role: " . ($admin->role ? $admin->role->name : 'NO ROLE') . "\n";
    if ($admin->role && $admin->role->permissions) {
        echo "Permissions count: " . $admin->role->permissions->count() . "\n";
        echo "Has 'admin' permission: " . ($admin->hasPermission('admin') ? '✅ YES' : '❌ NO') . "\n";
    } else {
        echo "❌ No role or permissions found\n";
    }
} else {
    echo "❌ Admin user not found\n";
}
