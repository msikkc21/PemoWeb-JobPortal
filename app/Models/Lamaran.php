<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Lamaran extends Model
{
    /** @use HasFactory<\Database\Factories\LamaranFactory> */
    use HasFactory;

    protected $table = 'lamarans';

    protected $primaryKey = 'id_lamaran';

    protected $fillable = [
        'id_lowongan',
        'id_pencari',
        'id_resume',
        'status',
        'tanggal_lamaran',
        'catatan',
    ];

    public function lowongan()
    {
        return $this->belongsTo(Lowongan::class, 'id_lowongan', 'id_lowongan');
    }

    public function pencari()
    {
        return $this->belongsTo(ProfilPencariKerja::class, 'id_pencari', 'id_pencari');
    }

    public function resume()
    {
        return $this->belongsTo(Resume::class, 'id_resume', 'id_resume');
    }
}
