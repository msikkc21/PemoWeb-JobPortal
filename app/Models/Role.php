<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    /** @use HasFactory<\Database\Factories\RoleFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'display_name',
        'description',
        'is_active'
    ];
    protected $casts = [
        'is_active' => 'boolean',
    ];


    public function penggunas()
    {
        return $this->hasMany(Pengguna::class, 'role_id');
    }

    public function permissions()
    {
        return $this->belongsToMany(Permission::class, 'role_permission');
    }
    public function hasPermission(string $permission): bool
    {
        return $this->permissions()->where('name', $permission)->exists();
    }
    public function givePermission(Permission $permission)
    {
        return $this->permissions()->attach($permission);
    }
    public function removePermission(Permission $permission)
    {
        return $this->permissions()->detach($permission);
    }
}
