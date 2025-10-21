<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Job extends Model
{
    use HasFactory;

    protected $table = 'job_posts'; // penting: konsisten dengan migration

    protected $fillable = [
        'company_id',
        'title',
        'description',
        'requirements',
        'salary_min',
        'salary_max',
        'currency',
        'location',
        'job_type',
        'job_level',
        'status',
        'posted_date',
        'expiry_date',
    ];

    protected $casts = [
        'salary_min' => 'decimal:2',
        'salary_max' => 'decimal:2',
        'posted_date' => 'date',
        'expiry_date' => 'date',
    ];

    // ===============================
    // 🔗 RELATIONS
    // ===============================

    /** Job milik sebuah perusahaan */
    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class, 'company_id');
    }

    /** Job punya banyak pelamar (applications) */
    public function applications(): HasMany
    {
        return $this->hasMany(Application::class, 'job_id');
    }

    /** Job memiliki banyak skill (via job_skills) */
    public function skills(): BelongsToMany
    {
        return $this->belongsToMany(Skill::class, 'job_skills', 'job_id', 'skill_id')
            ->withTimestamps();
    }

    // ===============================
    // 🧩 SCOPES & HELPERS
    // ===============================

    /** Ambil job aktif (status approved atau open) */
    public function scopeActive($query)
    {
        return $query->whereIn('status', ['approved', 'open']);
    }

    /** Cek apakah job sudah expired */
    public function isExpired(): bool
    {
        return $this->expiry_date && now()->greaterThan($this->expiry_date);
    }

    /** Hitung jumlah pelamar */
    public function applicantsCount(): int
    {
        return $this->applications()->count();
    }
}
