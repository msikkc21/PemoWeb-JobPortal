<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Lowongan extends Model
{
    use HasFactory;

    protected $table = 'lowongans';
    protected $primaryKey = 'id_lowongan';

    protected $fillable = [
        'id_company',
        'judul',
        'deskripsi',
        'persyaratan',
        'gaji',
        'lokasi',
        'jenis_pekerjaan',
        'level_pekerjaan',
        'status',
        'tanggal_posting',
        'tanggal_berakhir',
        'approve',
    ];

    protected $casts = [
        'tanggal_posting' => 'date',
        'tanggal_berakhir' => 'date',
        'gaji' => 'decimal:2',
        'approve' => 'boolean'
    ];

    public function company()
    {
        return $this->belongsTo(\App\Models\CompanyProfile::class, 'id_company', 'id');
    }

    public function skills()
    {
        return $this->belongsToMany(
            \App\Models\Keahlian::class,
            'lowongan_keahlians',
            'id_lowongan',
            'id_keahlian'
        );
    }

    public function applications()
    {
        return $this->hasMany(\App\Models\Lamaran::class, 'id_lowongan', 'id_lowongan');
    }
}