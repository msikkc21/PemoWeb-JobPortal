<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Resume extends Model
{
    use HasFactory;

    protected $table = 'resume';
    protected $primaryKey = 'resume_id';

    public $timestamps = false;

    protected $fillable = [
        'jobseeker_id',
        'cv_file',
        'parsed_data',
        'upload_date',
    ];

    protected $casts = [
        'upload_date' => 'date',
    ];

    public function jobseeker()
    {
        return $this->belongsTo(JobSeekerProfile::class, 'jobseeker_id', 'jobseeker_id');
    }
}
