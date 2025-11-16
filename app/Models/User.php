<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * PENTING: Table name di database adalah 'pengguna' (bukan 'users')
     */
    protected $table = 'pengguna';

    /**
     * Primary key untuk user
     */
    protected $primaryKey = 'id_pengguna';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role_id',
        'email_verified_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * RELATIONSHIP: User has a Role
     * KENAPA: Untuk check permission user berdasarkan rolenya
     */
    public function role()
    {
        return $this->belongsTo(Role::class, 'role_id', 'id');
    }

    /**
     * CHECK PERMISSION
     * FUNGSI: Cek apakah user punya permission tertentu
     * 
     * CARA PAKAI:
     * - $user->hasPermission('admin') → return true/false
     * 
     * ALASAN PENTING:
     * - Middleware check.permission:admin memanggil method ini
     * - Jika method tidak ada, middleware akan error
     */
    public function hasPermission(string $permission): bool
    {
        // Jika user punya role, check apakah role punya permission ini
        if ($this->role) {
            return $this->role->hasPermission($permission);
        }
        return false;
    }
}
