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
        'nama',
        'email',
        'password',
        'role_id',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    public function profilPencariKerja(): HasOne
    {
        return $this->hasOne(JobSeekerProfile::class, 'id_pengguna', 'id_pengguna');
    }

    public function profilPerusahaan(): HasOne
    {
        return $this->hasOne(CompanyProfile::class, 'id_pengguna', 'id_pengguna');
    }

    public function role()
    {
        return $this->belongsTo(Role::class, 'role_id');
    }
};
