<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Lowongan extends Model
{
    use HasFactory;

    protected $table = 'lowongan';

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
}
