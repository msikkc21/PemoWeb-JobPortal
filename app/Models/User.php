<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    /**
     * Kolom yang bisa diisi secara mass-assignment.
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role_id',
    ];

    /**
     * Kolom yang disembunyikan saat serialisasi (misalnya ke JSON).
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Konversi otomatis tipe data atribut.
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // ======================================================
    // 🔗 RELASI
    // ======================================================

    /**
     * Relasi ke Role (user -> role)
     */
    public function role(): BelongsTo
    {
        return $this->belongsTo(Role::class, 'role_id');
    }

    /**
     * Relasi ke Company (jika user merupakan perusahaan)
     */
    public function company(): HasOne
    {
        return $this->hasOne(Company::class, 'user_id');
    }

    /**
     * Relasi ke JobSeeker (jika user merupakan pencari kerja)
     */
    public function jobSeeker(): HasOne
    {
        return $this->hasOne(JobSeeker::class, 'user_id');
    }

    // ======================================================
    // 🔐 ROLE & PERMISSION CHECK
    // ======================================================

    /**
     * Mengecek apakah user memiliki permission tertentu
     */
    public function hasPermission(string $permission): bool
    {
        return $this->role?->hasPermission($permission) ?? false;
    }

    /**
     * Mengecek apakah user memiliki salah satu permission dari array
     */
    public function hasAnyPermission(array $permissions): bool
    {
        foreach ($permissions as $perm) {
            if ($this->hasPermission($perm)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Mengecek apakah user memiliki semua permission di array
     */
    public function hasAllPermissions(array $permissions): bool
    {
        foreach ($permissions as $perm) {
            if (!$this->hasPermission($perm)) {
                return false;
            }
        }
        return true;
    }

    /**
     * Mengambil nama role user
     */
    public function getRoleName(): string
    {
        return $this->role?->name ?? 'No Role';
    }

    // ======================================================
    // 🧭 HELPER METHODS
    // ======================================================

    /**
     * Mengecek apakah user adalah admin
     */
    public function isAdmin(): bool
    {
        return strtolower($this->getRoleName()) === 'admin';
    }

    /**
     * Mengecek apakah user adalah perusahaan
     */
    public function isCompany(): bool
    {
        return strtolower($this->getRoleName()) === 'company';
    }

    /**
     * Mengecek apakah user adalah pencari kerja
     */
    public function isJobSeeker(): bool
    {
        return strtolower($this->getRoleName()) === 'jobseeker';
    }
}
