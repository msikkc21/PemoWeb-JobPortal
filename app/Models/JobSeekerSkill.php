<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JobSeekerSkill extends Model
{
    use HasFactory;

    protected $table = 'job_seeker_skills';

    protected $fillable = [
        'job_seeker_id',
        'skill_id',
        'level',
        'experience_years',
    ];

    public $timestamps = true;

    // ===============================
    // 🧩 ENUM LOGIC
    // ===============================

    /** Level skill yang valid */
    public const LEVELS = ['beginner', 'intermediate', 'expert'];

    /** Scope: filter berdasarkan level */
    public function scopeLevel($query, string $level)
    {
        return $query->where('level', $level);
    }

    /** Cek apakah skill ini expert */
    public function isExpert(): bool
    {
        return $this->level === 'expert';
    }
}
