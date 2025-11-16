<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * 
     * KENAPA MIGRATION INI DIPERLUKAN:
     * - Column 'rejection_reason' dibutuhkan untuk menyimpan alasan admin menolak lowongan
     * - Kolom ini hanya berisi data ketika status = 'rejected'
     * - Type: text (agar bisa menyimpan alasan yang panjang)
     * - Nullable: true (tidak semua lowongan punya alasan tolak)
     */
    public function up(): void
    {
        Schema::table('lowongans', function (Blueprint $table) {
            // Cek apakah column sudah ada sebelumnya (untuk keamanan)
            if (!Schema::hasColumn('lowongans', 'rejection_reason')) {
                $table->text('rejection_reason')
                      ->nullable()
                      ->after('status')
                      ->comment('Alasan admin menolak lowongan ini');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('lowongans', function (Blueprint $table) {
            if (Schema::hasColumn('lowongans', 'rejection_reason')) {
                $table->dropColumn('rejection_reason');
            }
        });
    }
};
