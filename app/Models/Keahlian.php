<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Keahlian extends Model
{
    use HasFactory;

    protected $table = 'keahlians';

    protected $fillable = [
        'nama_keahlian',
        'kategori',
        'deskripsi',
    ];

    public function lowongans()
    {
        return $this->belongsToMany(Lowongan::class, 'lowongan_keahlians', 'id_keahlian', 'id_lowongan');
    }
}
