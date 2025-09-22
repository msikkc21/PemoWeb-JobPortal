<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Wawancara extends Model
{
    use HasFactory;

    protected $table = 'wawancara'; // nama tabel
    protected $primaryKey = 'id_wawancara'; // primary key

    public $timestamps = false; // karena tabel tidak ada created_at & updated_at

    protected $fillable = [
        'id_lamaran',
        'jadwal',
        'lokasi',
        'status',
    ];
}
