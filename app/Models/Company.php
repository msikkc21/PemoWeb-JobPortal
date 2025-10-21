<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Company extends Model
{
    use HasFactory;

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
    ];

    // ===============================
    // 🔗 RELATIONS
    // ===============================

    /** Relasi ke User (pemilik akun perusahaan) */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /** Relasi ke Job (lowongan yang diposting perusahaan ini) */
    public function jobs(): HasMany
    {
        return $this->hasMany(Job::class, 'company_id');
    }

    /** Relasi ke Subscription (langganan perusahaan) */
    public function subscriptions(): HasMany
    {
        return $this->hasMany(Subscription::class, 'company_id');
    }

    // ===============================
    // 🧩 SCOPES & HELPERS
    // ===============================

    /** Ambil langganan aktif (helper) */
    public function activeSubscription()
    {
        return $this->subscriptions()
            ->where('status', 'active')
            ->latest()
            ->first();
    }

    /** Cek apakah perusahaan memiliki langganan aktif */
    public function hasActiveSubscription(): bool
    {
        return $this->activeSubscription() !== null;
    }

    /** Jumlah job aktif (approved / open) */
    public function activeJobsCount(): int
    {
        return $this->jobs()
            ->whereIn('status', ['approved', 'open'])
            ->count();
    }
}
