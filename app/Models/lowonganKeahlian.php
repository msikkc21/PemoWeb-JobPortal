<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\Pivot;

class LowonganKeahlian extends Pivot
{
    protected $table = 'lowongan_keahlian';
    
    public function lowongan(): BelongsTo
    {
        return $this->belongsTo(Lowongan::class, 'id_lowongan', 'id_lowongan');
    }

    public function keahlian(): BelongsTo
    {
        return $this->belongsTo(Keahlian::class, 'id_keahlian', 'id_keahlian');
    }
}