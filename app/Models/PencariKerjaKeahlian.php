<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PencariKerjaKeahlian extends Model
{
    use HasFactory;

    protected $table = 'pencari_kerja_keahlians';
    public $incrementing = false;
    protected $primaryKey = ['jobseeker_id', 'skill_id'];

    protected $fillable = [
        'jobseeker_id',
        'skill_id',
        'level',
        'experience_years',
    ];

    public function jobseeker()
    {
        return $this->belongsTo(JobSeekerProfile::class, 'jobseeker_id', 'jobseeker_id');
    }

    public function skill()
    {
        return $this->belongsTo(Keahlian::class, 'skill_id', 'skill_id');
    }
}
