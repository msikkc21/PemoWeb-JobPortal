<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Wawancara extends Model
{
    use HasFactory;

    protected $table = 'wawancara';
    protected $primaryKey = 'interview_id';

    public $timestamps = false;

    protected $fillable = [
        'application_id',
        'schedule',
        'location',
        'status',
    ];

    protected $casts = [
        'schedule' => 'datetime',
    ];

    public function application()
    {
        return $this->belongsTo(Lamaran::class, 'application_id', 'application_id');
    }
}
