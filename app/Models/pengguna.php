<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Pengguna extends Authenticatable
{
    use Notifiable;

    protected $table = 'pengguna';
    protected $primaryKey = 'id_pengguna';
    protected $fillable = [
        'name',
        'email',
        'password',
        'role_id',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    public function jobSeekerProfile(): HasOne
    {
        return $this->hasOne(JobSeekerProfile::class, 'id_pengguna', 'id_pengguna');
    }

    public function companyProfile(): HasOne
    {
        return $this->hasOne(CompanyProfile::class, 'id_pengguna', 'id_pengguna');
    }

    public function role()
    {
        return $this->belongsTo(Role::class, 'role_id');
    }

    // Check if user has specific permission
    public function hasPermission(string $permission): bool
    {
        return $this->role?->hasPermission($permission) ?? false;
    }
    // Check if user has any of the given permissions
    public function hasAnyPermission(array $permissions): bool
    {
        foreach ($permissions as $permission) {
            if ($this->hasPermission($permission)) {
                return true;
            }
        }
        return false;
    }
    // Check if user has all given permissions
    public function hasAllPermissions(array $permissions): bool
    {
        foreach ($permissions as $permission) {
            if (!$this->hasPermission($permission)) {
                return false;
            }
        }
        return true;
    }

    // Get user's role name
    public function getRoleName(): string
    {
        return $this->role?->name ?? 'No Role';
    }
    // Helper methods for role checking
    public function isAdmin(): bool
    {
        return $this->getRoleName() === 'Administrator';
    }
    public function isPencariKerja(): bool
    {
        return $this->getRoleName() === 'Pencari_Kerja';
    }
    public function isPerusahaan(): bool
    {
        return $this->getRoleName() === 'Perusahaan';
    }
};
