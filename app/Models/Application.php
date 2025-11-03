<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Application extends Model
{
    use HasFactory;

    protected $fillable = [
        'job_id',
        'job_seeker_id',
        'resume_id',
        'status',
        'application_date',
        'notes',
    ];

    protected $casts = [
        'application_date' => 'date',
    ];

    // ===============================
    // 🔗 RELATIONS
    // ===============================

    /** Lamaran ini dikirim ke job tertentu */
    public function job(): BelongsTo
    {
        return $this->belongsTo(Job::class, 'job_id');
    }

    /** Lamaran dikirim oleh job seeker tertentu */
    public function jobSeeker(): BelongsTo
    {
        return $this->belongsTo(JobSeeker::class, 'job_seeker_id');
    }

    /** Alias untuk jobSeeker (snake_case support) */
    public function job_seeker(): BelongsTo
    {
        return $this->jobSeeker();
    }

    /** Lamaran menggunakan resume tertentu */
    public function resume(): BelongsTo
    {
        return $this->belongsTo(Resume::class, 'resume_id');
    }

    /** Interview yang terkait dengan lamaran ini */
    public function interview(): HasOne
    {
        return $this->hasOne(Interview::class, 'application_id');
    }

    // ===============================
    // 🧩 SCOPES & HELPERS
    // ===============================

    /** Scope: lamaran yang masih aktif dalam proses */
    public function scopeActive($query)
    {
        return $query->whereIn('status', ['submitted', 'in_process', 'shortlisted', 'interviewed']);
    }

    /** Cek apakah sudah diterima */
    public function isAccepted(): bool
    {
        return $this->status === 'accepted';
    }

    /** Cek apakah sudah ditolak */
    public function isRejected(): bool
    {
        return $this->status === 'rejected';
    }

    /** Cek apakah ada jadwal interview */
    public function hasInterview(): bool
    {
        return $this->interview()->exists();
    }
}
