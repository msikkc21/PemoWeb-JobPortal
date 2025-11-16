<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Lowongan extends Model
{
    use HasFactory;

    protected $table = 'lowongans';
    protected $primaryKey = 'id_lowongan';
    public $incrementing = true;

    protected $fillable = [
        'id_company',
        'judul',
        'deskripsi',
        'persyaratan',
        'gaji',
        'lokasi',
        'jenis_pekerjaan',
        'level_pekerjaan',
        'status',
        'tanggal_posting',
        'tanggal_berakhir',
        'rejection_reason',
        'posted_date',
    ];

    protected $casts = [
        'tanggal_posting' => 'datetime',
        'tanggal_berakhir' => 'datetime',
    ];

    /**
     * Relationship: Lowongan belongs to CompanyProfile
     * KENAPA: Setiap lowongan harus punya perusahaan yang membuat
     */
    public function company(): BelongsTo
    {
        return $this->belongsTo(CompanyProfile::class, 'id_company', 'id');
    }

    /**
     * Relationship: Lowongan has many skills (many-to-many)
     * KENAPA: Satu lowongan bisa membutuhkan banyak keahlian
     */
    public function skills(): BelongsToMany
    {
        return $this->belongsToMany(
            Keahlian::class,
            'lowongan_keahlians',      // Nama pivot table
            'id_lowongan',             // Foreign key di pivot untuk lowongan
            'id_keahlian'              // Foreign key di pivot untuk keahlian
        );
    }

    /**
     * Relationship: Lowongan has many applications
     * KENAPA: Satu lowongan bisa menerima banyak lamaran
     */
    public function lamarans(): HasMany
    {
        return $this->hasMany(Lamaran::class, 'id_lowongan', 'id_lowongan');
    }
}
