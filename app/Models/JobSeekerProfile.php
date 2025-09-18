<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JobSeekerProfile extends Model
{
    protected $table = 'job_seeker_profiles';
    protected $primaryKey = 'id_pencari';

    const CREATED_AT = 'dibuat_pada';
    const UPDATED_AT = 'diperbarui_pada';

    protected $fillable = [
        'id_pengguna',
        'nama',
        'jenis_kelamin',
        'tempat_lahir',
        'tanggal_lahir',
        'telepon',
        'alamat',
        'pendidikan',
        'pengalaman',
        'deskripsi',
        'path_foto',
        'linkedin',
        'github',
        'portfolio',
    ];

    protected $casts = [
        'id_pengguna' => 'integer',
        'tanggal_lahir' => 'date',
        'dibuat_pada' => 'datetime',
        'diperbarui_pada' => 'datetime',
    ];
}
