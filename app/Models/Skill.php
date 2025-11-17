<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Skill extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
    ];

    // ===============================
    // 🔗 RELATIONS
    // ===============================

    /** Skill dimiliki oleh banyak Job */
    public function jobs(): BelongsToMany
    {
        return $this->belongsToMany(Job::class, 'job_skills', 'skill_id', 'job_id')
            ->withTimestamps();
    }

    /** Skill dimiliki oleh banyak JobSeeker (dengan level dan pengalaman) */
    public function jobSeekers(): BelongsToMany
    {
        return $this->belongsToMany(JobSeeker::class, 'job_seeker_skills', 'skill_id', 'job_seeker_id')
            ->withPivot(['level', 'experience_years'])
            ->withTimestamps();
    }

    // ===============================
    // 🧩 SCOPES & HELPERS
    // ===============================

    /** Cari skill berdasarkan nama (case-insensitive) */
    public function scopeSearch($query, string $term)
    {
        return $query->where('name', 'like', "%{$term}%");
    }
}
