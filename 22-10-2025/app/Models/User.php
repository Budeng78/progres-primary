<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, HasRoles;

    protected $fillable = [
        'name',
        'email',
        'password',
        'whatsapp_number',
        'primary_karyawan_id',
        'foto_profile',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Relasi ke PrimaryKaryawan
     * User → belongsTo PrimaryKaryawan
     */
    public function primaryKaryawan()
    {
        return $this->belongsTo(\App\Models\Tenaker\PrimaryKaryawan::class, 'primary_karyawan_id', 'id');
    }

    public function karyawan()
    {
        return $this->primaryKaryawan();
    }

        // Accessor untuk foto_profile
    public function getFotoProfileUrlAttribute()
    {
        return $this->foto_profile
            ? asset('storage/' . $this->foto_profile)
            : "https://ui-avatars.com/api/?name=" . urlencode($this->name) . "&background=random&size=128";
    }

}
