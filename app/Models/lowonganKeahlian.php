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
    public $timestamps = false;
    protected $primaryKey = ['job_id', 'skill_id'];

    protected $fillable = [
        'job_id',
        'skill_id',
    ];

    public function lowongan()
    {
        return $this->belongsTo(Lowongan::class, 'job_id', 'job_id');
    }

    public function skill()
    {
        return $this->belongsTo(Keahlian::class, 'skill_id', 'skill_id');
    }
}
