<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Lowongan extends Model
{
    use HasFactory;

    protected $table = 'lowongans';
    protected $primaryKey = 'job_id';

    protected $fillable = [
        'company_id',
        'title',
        'description',
        'requirements',
        'salary',
        'location',
        'job_type',
        'job_level',
        'status',
        'posted_date',
        'expiry_date',
        'is_approved',
    ];

    protected $casts = [
        'salary' => 'decimal:2',
        'posted_date' => 'date',
        'expiry_date' => 'date',
        'is_approved' => 'boolean',
    ];

    public function company()
    {
        return $this->belongsTo(CompanyProfile::class, 'company_id');
    }
}
