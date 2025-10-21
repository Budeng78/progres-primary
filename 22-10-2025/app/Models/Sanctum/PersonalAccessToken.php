<?php
namespace App\Models\Sanctum;

use Laravel\Sanctum\PersonalAccessToken as SanctumPersonalAccessToken;
use Illuminate\Database\Eloquent\Casts\Attribute;

class PersonalAccessToken extends SanctumPersonalAccessToken
{
	/**
	 * Casting kolom ke tipe data yang sesuai
	 */
	protected $casts = [
		'abilities' => 'array',
		'last_used_at' => 'datetime',
		'expires_at' => 'datetime',
	];

	/**
	 * Relasi ke model user
	 */
	public function user()
	{
		return $this->belongsTo(\App\Models\User::class);
	}

	/**
	 * Scope untuk token yang masih aktif (belum expired)
	 */
	public function scopeActive($query)
	{
		return $query->where(function ($q) {
			$q->whereNull('expires_at')->orWhere('expires_at', '>', now());
		});
	}

	/**
	 * Cek apakah token sudah kedaluwarsa
	 */
	public function isExpired(): bool
	{
		return optional($this->expires_at)->isPast() ?? false;
	}

	/**
	 * Aksesor opsional untuk nama device yang lebih ramah
	 */
	protected function deviceLabel(): Attribute
	{
		return Attribute::make(
			get: fn () => ucfirst(str_replace('_', ' ', $this->name))
		);
	}
}