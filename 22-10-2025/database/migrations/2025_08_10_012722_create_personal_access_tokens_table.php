<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
	public function up(): void
	{
		Schema::create('personal_access_tokens', function (Blueprint $table) {
			$table->id();
			$table->morphs('tokenable'); // relasi polymorphic (biasanya user)
			$table->string('name'); // nama token, biasanya nama device
			$table->string('token', 64)->unique(); // hashed token
			$table->text('abilities')->nullable(); // hak akses token (JSON string)
			$table->string('device_type')->nullable(); // desktop, mobile, dsb (opsional)
			$table->string('user_agent')->nullable(); // identitas perangkat (opsional)
			$table->ipAddress('ip_address')->nullable(); // IP saat pembuatan token
			$table->timestamp('last_used_at')->nullable();
			$table->timestamp('expires_at')->nullable();
			$table->timestamp('revoked_at')->nullable(); // untuk sistem revoke manual (opsional)
			$table->timestamps();
		});
	}

	public function down(): void
	{
		Schema::dropIfExists('personal_access_tokens');
	}
};