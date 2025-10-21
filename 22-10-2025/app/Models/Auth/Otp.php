<?php
// app/Models/Auth/Otp.php

namespace App\Models\Auth; // Ganti namespace di sini    
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Otp extends Model
{
    use HasFactory;

    protected $table = 'otps';

    protected $fillable = [
        'name',
        'whatsapp_number',
        'otp_code',
        'expires_at',
    ];

    protected $casts = [
        'expires_at' => 'datetime',
    ];
}