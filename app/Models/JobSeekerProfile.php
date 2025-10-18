<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JobSeekerProfile extends Model
{
    protected $table = 'jobseeker_profiles';
    protected $primaryKey = 'jobseeker_id';

    protected $fillable = [
        'user_id',
        'name',
        'gender',
        'birth_place',
        'birth_date',
        'phone',
        'address',
        'education',
        'experience',
        'description',
        'photo_path',
        'linkedin',
        'github',
        'portfolio',
    ];

    protected $casts = [
        'user_id' => 'integer',
        'birth_date' => 'date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
