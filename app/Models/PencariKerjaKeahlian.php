<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PencariKerjaKeahlian extends Model
{
    use HasFactory;

    protected $table = 'pencari_kerja_keahlians';
    public $incrementing = false;
    protected $primaryKey = ['id_pencari', 'id_keahlian'];

    protected $fillable = [
        'id_pencari',
        'id_keahlian',
        'tingkat',
        'pengalaman_tahun',
    ];

    public function pencari()
    {
        return $this->belongsTo(JobSeekerProfile::class, 'id_pencari', 'id_pencari');
    }

    public function keahlian()
    {
        return $this->belongsTo(Keahlian::class, 'id_keahlian', 'id_keahlian');
    }
}
