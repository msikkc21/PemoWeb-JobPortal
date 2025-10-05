<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LowonganKeahlian extends Model
{
    /** @use HasFactory<\Database\Factories\LowonganKeahlianFactory> */
    use HasFactory;

    protected $table = 'lowongan_keahlians';

    public $incrementing = false;
    protected $primaryKey = ['id_lowongan', 'id_keahlian'];

    protected $fillable = [
        'id_lowongan',
        'id_keahlian',
        'tingkat',
    ];

    public function lowongan()
    {
        return $this->belongsTo(Lowongan::class, 'id_lowongan', 'id_lowongan');
    }

    public function keahlian()
    {
        return $this->belongsTo(Keahlian::class, 'id_keahlian', 'id_keahlian');
    }
}
