<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SubscriptionPlan extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'price_amount',
        'price_currency',
        'duration_in_days',
        'description',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    // ===============================
    // 🔗 RELATIONS
    // ===============================

    /** Plan bisa digunakan oleh banyak subscription */
    public function subscriptions(): HasMany
    {
        return $this->hasMany(Subscription::class, 'plan_id');
    }

    // ===============================
    // 🧩 SCOPES & HELPERS
    // ===============================

    /** Ambil plan yang aktif */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /** Format harga untuk tampilan */
    public function formattedPrice(): string
    {
        return number_format($this->price_amount, 0, ',', '.') . ' ' . $this->price_currency;
    }

    /** Hitung durasi dalam format hari → bulan */
    public function durationText(): string
    {
        return $this->duration_in_days >= 30
            ? ($this->duration_in_days / 30) . ' Bulan'
            : $this->duration_in_days . ' Hari';
    }
}
