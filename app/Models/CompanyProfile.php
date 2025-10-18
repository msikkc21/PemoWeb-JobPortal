<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CompanyProfile extends Model
{
    protected $table = 'company_profiles';

    protected $fillable = [
        'user_id',
        'company_name',
        'industry',
        'description',
        'location',
        'website',
        'company_email',
        'phone',
        'address',
        'photo_path',
        'employee_count',
        'founded_year',
        'is_approved',
    ];

    protected $casts = [
        'employee_count' => 'integer',
        'founded_year' => 'integer',
        'is_approved' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
