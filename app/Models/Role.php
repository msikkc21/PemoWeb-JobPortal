<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    /** @use HasFactory<\Database\Factories\RoleFactory> */
    use HasFactory;

    protected $fillable = ['name']; // guard_name optional

    public function penggunas()
    {
        return $this->hasMany(Pengguna::class, 'role_id');
    }
}
