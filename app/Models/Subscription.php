<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Subscription extends Model
{
    use HasFactory;

    protected $fillable = [
        'company_id',
        'plan_id',
        'starts_at',
        'ends_at',
        'renews_at',
        'cancels_at',
        'status',
    ];

    protected $casts = [
        'starts_at' => 'datetime',
        'ends_at' => 'datetime',
        'renews_at' => 'datetime',
        'cancels_at' => 'datetime',
    ];

    // ===============================
    // 🔗 RELATIONS
    // ===============================

    /** Langganan ini milik perusahaan */
    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class, 'company_id');
    }

    /** Langganan ini terkait dengan plan tertentu */
    public function plan(): BelongsTo
    {
        return $this->belongsTo(SubscriptionPlan::class, 'plan_id');
    }

    /** Langganan ini punya banyak pembayaran */
    public function payments(): HasMany
    {
        return $this->hasMany(SubscriptionPayment::class, 'subscription_id');
    }

    // ===============================
    // 🧩 SCOPES & HELPERS
    // ===============================

    /** Scope: langganan aktif */
    public function scopeActive($query)
    {
        return $query->where('status', 'active')
                     ->where('ends_at', '>', now());
    }

    /** Scope: langganan yang perlu diperbarui */
    public function scopeExpiringSoon($query, int $days = 7)
    {
        return $query->whereBetween('ends_at', [now(), now()->addDays($days)]);
    }

    /** Ambil pembayaran terakhir */
    public function latestPayment()
    {
        return $this->payments()->latest()->first();
    }

    /** Cek apakah subscription sudah berakhir */
    public function isExpired(): bool
    {
        return $this->ends_at && now()->greaterThan($this->ends_at);
    }

    /** Cek apakah subscription masih aktif */
    public function isActive(): bool
    {
        return !$this->isExpired() && $this->status === 'active';
    }
}
