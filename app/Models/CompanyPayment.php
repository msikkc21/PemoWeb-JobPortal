<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CompanyPayment extends Model
{
    /** @use HasFactory<\Database\Factories\CompanyPaymentFactory> */
    use HasFactory;

    protected $fillable = [
        'user_id',
        'va_number',
        'external_id',
        'payment_url',
        'expired_at',
        'status',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // public function payment()
    // {
    //     return $this->hasOne(CompanyPayment::class, 'user_id', 'user_id');
    // }
}
