<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Resume extends Model
{
    use HasFactory;

    protected $fillable = [
        'job_seeker_id',
        'cv_file',
        'parsed_data',
        'upload_date',
    ];

    protected $casts = [
        'upload_date' => 'date',
    ];

    // ===============================
    // 🔗 RELATIONS
    // ===============================

    /** Resume milik seorang job seeker */
    public function jobSeeker(): BelongsTo
    {
        return $this->belongsTo(JobSeeker::class, 'job_seeker_id');
    }

    // ===============================
    // 🧩 SCOPES & HELPERS
    // ===============================

    /** Ambil CV terbaru */
    public function scopeLatest($query)
    {
        return $query->orderByDesc('upload_date');
    }

    /** Cek apakah resume sudah diparsing AI */
    public function isParsed(): bool
    {
        return !is_null($this->parsed_data);
    }
}
