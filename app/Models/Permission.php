<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Permission extends Model
{
    /** @use HasFactory<\Database\Factories\PermissionFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'display_name',
        'group',
        'description',
        'is_active'
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];
    // Permission belongs to many roles
    public function roles() 
    {
        return $this->belongsToMany(Role::class, 'role_permission');
    }
    // Scope untuk filter berdasarkan group
    public function scopeByGroup($query, $group)
    {
        return $query->where('group', $group);
    }
    // Scope untuk permission yang aktif
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
