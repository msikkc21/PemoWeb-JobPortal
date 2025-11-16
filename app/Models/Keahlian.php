<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Keahlian extends Model
{
    use HasFactory;

    // PENTING: Nama table di database adalah 'keahlians' (dengan s di akhir)
    // Ini sesuai dengan migration file: 2025_09_21_144955_create_keahlians_table.php
    protected $table = 'keahlians';

    protected $fillable = [
        'nama_keahlian',
        'kategori',
        'deskripsi',
    ];

    /**
     * Relationship: Keahlian has many jobs (many-to-many)
     * KENAPA: Satu keahlian bisa dibutuhkan oleh banyak lowongan
     */
    public function lowongans(): BelongsToMany
    {
        return $this->belongsToMany(
            Lowongan::class,
            'lowongan_keahlians',      // Nama pivot table
            'id_keahlian',             // Foreign key di pivot untuk keahlian
            'id_lowongan'              // Foreign key di pivot untuk lowongan
        );
    }

    /**
     * Relationship: Keahlian has many job seekers (many-to-many)
     * KENAPA: Satu keahlian bisa dimiliki oleh banyak pencari kerja
     */
    public function jobSeekers(): BelongsToMany
    {
        return $this->belongsToMany(
            JobSeekerProfile::class,
            'pencari_kerja_keahlians',  // Nama pivot table
            'id_keahlian',              // Foreign key di pivot untuk keahlian
            'id_pencari'                // Foreign key di pivot untuk pencari kerja
        );
    }
}
