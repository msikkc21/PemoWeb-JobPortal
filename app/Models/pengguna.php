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
        'peran',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    public function profilPencariKerja(): HasOne
    {
        return $this->hasOne(ProfilPencariKerja::class, 'id_pengguna', 'id_pengguna');
    }

    public function profilPerusahaan(): HasOne
    {
        return $this->hasOne(ProfilPerusahaan::class, 'id_pengguna', 'id_pengguna');
    }
}