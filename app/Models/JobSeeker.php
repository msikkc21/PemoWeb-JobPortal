<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class JobSeeker extends Model
{
    use HasFactory;

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
        'birth_date' => 'date',
    ];

    // ===============================
    // 🔗 RELATIONS
    // ===============================

    /** Relasi ke User */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /** Relasi ke Resume (CV yang diunggah) */
    public function resumes(): HasMany
    {
        return $this->hasMany(Resume::class, 'job_seeker_id');
    }

    /** Relasi ke Application (lamaran pekerjaan) */
    public function applications(): HasMany
    {
        return $this->hasMany(Application::class, 'job_seeker_id');
    }

    /** Relasi ke Skill (via pivot job_seeker_skills) */
    public function skills(): BelongsToMany
    {
        return $this->belongsToMany(Skill::class, 'job_seeker_skills', 'job_seeker_id', 'skill_id')
            ->withPivot(['level', 'experience_years'])
            ->withTimestamps();
    }

    // ===============================
    // 🧩 SCOPES & HELPERS
    // ===============================

    /** Total lamaran yang dikirim */
    public function totalApplications(): int
    {
        return $this->applications()->count();
    }

    /** Ambil lamaran terakhir */
    public function latestApplication()
    {
        return $this->applications()->latest()->first();
    }

    /** Cek apakah JobSeeker punya resume aktif */
    public function hasResume(): bool
    {
        return $this->resumes()->exists();
    }

    /** Cek apakah skill tertentu dimiliki */
    public function hasSkill(string $skillName): bool
    {
        return $this->skills()->where('name', $skillName)->exists();
    }

    /**
     * Cek apakah profil job seeker sudah lengkap
     * 
     * Profil dianggap lengkap jika field-field penting sudah terisi
     */
    public function isProfileComplete(): bool
    {
        return !empty($this->name)
            && !empty($this->gender)
            && !empty($this->birth_place)
            && !empty($this->birth_date)
            && !empty($this->phone)
            && !empty($this->address)
            && !empty($this->education);
    }
}
