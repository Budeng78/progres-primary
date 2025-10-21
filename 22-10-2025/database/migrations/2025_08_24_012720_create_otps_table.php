<?php

  // database/migrations/xxxx_xx_xx_create_otps_table.php  
  use Illuminate\Database\Migrations\Migration;  
  use Illuminate\Database\Schema\Blueprint;  
  use Illuminate\Support\Facades\Schema;  

class CreateOtpsTable extends Migration
{
    public function up()
    {
        Schema::create('otps', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('whatsapp_number')->unique(); // Nomor tujuan OTP
            $table->string('otp_code');                // Kode OTP
            $table->timestamp('expires_at');           // Waktu kedaluwarsa
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('otps');
    }
}