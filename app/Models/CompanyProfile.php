<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CompanyProfile extends Model
{
    protected $table = 'company_profiles';
    // PENTING: Primary key adalah 'id' (bukan 'id_perusahaan')
    // Ini sesuai dengan migration: 2025_09_18_153546_create_company_profiles_tables.php
    protected $primaryKey = 'id';
    public $incrementing = true;

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

    /**
     * Relationship: CompanyProfile has many job listings
     * KENAPA: Satu perusahaan bisa memiliki banyak lowongan pekerjaan
     */
    public function lowongans(): HasMany
    {
        return $this->hasMany(Lowongan::class, 'id_company', 'id');
    }
}
