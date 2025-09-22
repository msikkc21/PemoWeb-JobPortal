<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Resume extends Model
{
    use HasFactory;

    protected $table = 'resume'; // nama tabel
    protected $primaryKey = 'id_resume'; // primary key

    public $timestamps = false; // karena tabel tidak ada created_at & updated_at

    protected $fillable = [
        'id_pencari',
        'file_cv',
        'data_parsing',
        'tanggal_upload',
    ];
}
