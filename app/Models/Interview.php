<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Interview extends Model
{
    use HasFactory;

    protected $fillable = [
        'application_id',
        'schedule',
        'location',
        'status',
    ];

    protected $casts = [
        'schedule' => 'datetime',
    ];

    // ===============================
    // 🔗 RELATIONS
    // ===============================

    /** Interview berasal dari lamaran tertentu */
    public function application(): BelongsTo
    {
        return $this->belongsTo(Application::class, 'application_id');
    }

    // ===============================
    // 🧩 SCOPES & HELPERS
    // ===============================

    /** Scope: hanya interview yang akan datang */
    public function scopeUpcoming($query)
    {
        return $query->where('schedule', '>', now())->where('status', 'scheduled');
    }

    /** Cek apakah interview sudah selesai */
    public function isCompleted(): bool
    {
        return $this->status === 'completed';
    }

    /** Cek apakah interview dibatalkan */
    public function isCancelled(): bool
    {
        return $this->status === 'cancelled';
    }

    /** Format waktu tampil */
    public function formattedSchedule(): string
    {
        return $this->schedule ? $this->schedule->format('d M Y H:i') : '-';
    }
}