<?php

namespace App\Models\Tenaker;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PrimaryKaryawan extends Model
{
    use HasFactory;

    protected $table = 'primary_karyawan';
    protected $primaryKey = 'id';
    public $timestamps = false;
    public $incrementing = true;
    protected $keyType = 'int';

    protected $fillable = [
        'no_induk_absen',
        'nama',
        'status_upah',
        'status_karyawan',
        
        'ditetapkan',
        'bagian',
        'sub_bagian',
        'kelompok_kerja',
        'pekerjaan',
        'alamat_rt_rw',
        'alamat_desa',
        'alamat_kecamatan',
        'alamat_kabupaten',
        'no_nik',
        'no_kk',
        'kelamin',
        'tempat_lahir',
        'tanggal_lahir',
        'pendidikan',
        'disabilitas',
        'kpi',
        'no_bpjs_kes',
        'no_kpj',
        'no_hp',
        'whatsapp_number',
        'email',
        'bank',
        'no_bank',
        'vaksin',
        'riwayat_kesehatan',
        
        'foto_formal',
    ];

    protected $casts = [
        'masuk_kerja'   => 'date',
        'ditetapkan'    => 'date',
        'tanggal_lahir' => 'date',
    ];

    protected $appends = [
        
        'foto_formal_url',
    ];

    protected $hidden = [
        
        'foto_formal',
    ];

   

    /**
     * Accessor foto_formal_url
     */
    public function getFotoFormalUrlAttribute()
    {
        return $this->foto_formal 
            ? asset('storage/' . $this->foto_formal) 
            : null;
    }

    /**
     * Relasi ke User
     * PrimaryKaryawan → hasOne User
     */
    public function user()
    {
        return $this->hasOne(\App\Models\User::class, 'primary_karyawan_id', 'id');
    }
}
