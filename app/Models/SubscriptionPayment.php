<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SubscriptionPayment extends Model
{
    use HasFactory;

    protected $fillable = [
        'subscription_id',
        'amount',
        'currency',
        'status',
        'payment_method',
        'external_id',
        'va_number',
        'payment_url',
        'expired_at',
        'paid_at',
    ];

    protected $casts = [
        'expired_at' => 'datetime',
        'paid_at' => 'datetime',
    ];

    // ===============================
    // 🔗 RELATIONS
    // ===============================

    /** Pembayaran ini milik subscription tertentu */
    public function subscription(): BelongsTo
    {
        return $this->belongsTo(Subscription::class, 'subscription_id');
    }

    // ===============================
    // 🧩 SCOPES & HELPERS
    // ===============================

    /** Scope: pembayaran yang masih pending */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    /** Cek apakah pembayaran sudah lunas */
    public function isPaid(): bool
    {
        return $this->status === 'paid';
    }

    /** Cek apakah pembayaran sudah expired */
    public function isExpired(): bool
    {
        return $this->status === 'expired' || ($this->expired_at && now()->greaterThan($this->expired_at));
    }

    /** Cek apakah gagal */
    public function isFailed(): bool
    {
        return $this->status === 'failed';
    }

    /** Format nominal */
    public function formattedAmount(): string
    {
        return number_format($this->amount, 0, ',', '.') . ' ' . $this->currency;
    }
}
