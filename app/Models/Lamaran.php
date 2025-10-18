<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Lamaran extends Model
{
    /** @use HasFactory<\Database\Factories\LamaranFactory> */
    use HasFactory;

    protected $table = 'lamarans';
    protected $primaryKey = 'application_id';

    protected $fillable = [
        'job_id',
        'jobseeker_id',
        'resume_id',
        'status',
        'application_date',
        'notes',
    ];

    protected $casts = [
        'application_date' => 'date',
    ];

    public function lowongan()
    {
        return $this->belongsTo(Lowongan::class, 'job_id', 'job_id');
    }

    public function jobseeker()
    {
        return $this->belongsTo(JobSeekerProfile::class, 'jobseeker_id', 'jobseeker_id');
    }

    public function resume()
    {
        return $this->belongsTo(Resume::class, 'resume_id', 'resume_id');
    }
}
