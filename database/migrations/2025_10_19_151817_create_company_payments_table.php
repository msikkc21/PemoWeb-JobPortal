<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('company_payments', function (Blueprint $table) {
            $table->id();
            
            // Relasi ke user/perusahaan
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();

            // Data Virtual Account
            $table->string('va_number')->nullable(); // nomor VA yang di-generate payment gateway
            $table->string('external_id')->nullable(); // unique code yang dikirim ke gateway untuk tracking
            $table->string('payment_url')->nullable(); // URL redirect ke halaman bayar (jika disediakan)
            $table->timestamp('expired_at')->nullable(); // batas waktu pembayaran

            // Status pembayaran: 'pending', 'paid', 'expired', 'failed'
            $table->enum('status', ['pending', 'paid', 'expired', 'failed'])->default('pending');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('company_payments');
    }
};
