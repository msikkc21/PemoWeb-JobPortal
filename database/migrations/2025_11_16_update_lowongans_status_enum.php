<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     * 
     * TUJUAN:
     * - Update enum status dari ['dibuka', 'ditutup'] menjadi ['pending_review', 'approved', 'rejected']
     * - Ini supaya admin bisa review lowongan sebelum di-publish
     * - Add rejection_reason untuk menyimpan alasan tolak
     * - Add posted_date untuk tanggal publikasi (saat approve)
     */
    public function up(): void
    {
        Schema::table('lowongans', function (Blueprint $table) {
            // Drop old status enum column
            // Catatan: MySQL tidak langsung bisa modify enum, jadi kita drop & recreate
            // Tapi dulu kita backup data dengan CASE statement
            
            // Untuk safety, ubah ke text dulu biar tidak error
            DB::statement("ALTER TABLE lowongans MODIFY status VARCHAR(255)");
            
            // Ubah value lama ke yang baru (mapping: dibuka→pending_review, ditutup→rejected)
            DB::statement("UPDATE lowongans SET status = 'pending_review' WHERE status = 'dibuka'");
            DB::statement("UPDATE lowongans SET status = 'rejected' WHERE status = 'ditutup'");
            
            // Ubah kembali ke enum dengan value baru
            DB::statement("ALTER TABLE lowongans MODIFY status ENUM('pending_review', 'approved', 'rejected') NOT NULL DEFAULT 'pending_review'");
            
            // Add rejection_reason column jika belum ada
            if (!Schema::hasColumn('lowongans', 'rejection_reason')) {
                $table->text('rejection_reason')->nullable()->after('status');
            }
            
            // Add posted_date column jika belum ada (untuk tracking kapan job di-approve)
            if (!Schema::hasColumn('lowongans', 'posted_date')) {
                $table->timestamp('posted_date')->nullable()->after('rejection_reason');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('lowongans', function (Blueprint $table) {
            // Rollback: ubah status kembali ke enum lama
            DB::statement("ALTER TABLE lowongans MODIFY status VARCHAR(255)");
            DB::statement("UPDATE lowongans SET status = 'dibuka' WHERE status IN ('pending_review', 'approved')");
            DB::statement("UPDATE lowongans SET status = 'ditutup' WHERE status = 'rejected'");
            DB::statement("ALTER TABLE lowongans MODIFY status ENUM('dibuka', 'ditutup') NOT NULL DEFAULT 'dibuka'");
            
            // Drop new columns
            if (Schema::hasColumn('lowongans', 'rejection_reason')) {
                $table->dropColumn('rejection_reason');
            }
            if (Schema::hasColumn('lowongans', 'posted_date')) {
                $table->dropColumn('posted_date');
            }
        });
    }
};
