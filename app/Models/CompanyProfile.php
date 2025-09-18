<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CompanyProfile extends Model
{
    protected $table = 'company_profiles';
    protected $primaryKey = 'id_perusahaan';

    const CREATED_AT = 'dibuat_pada';
    const UPDATED_AT = 'diperbarui_pada';

    protected $fillable = [
        'id_pengguna',
        'nama_perusahaan',
        'industri',
        'deskripsi',
        'lokasi',
        'website',
        'email_perusahaan',
        'telepon',
        'alamat',
        'path_foto',
        'jumlah_karyawan',
        'tahun_dibentuk',
    ];

    protected $casts = [
        'jumlah_karyawan' => 'integer',
        'tahun_dibentuk' => 'integer',
        'dibuat_pada' => 'datetime',
        'diperbarui_pada' => 'datetime',
    ];
}
