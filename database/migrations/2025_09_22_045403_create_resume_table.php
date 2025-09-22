<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Jalankan migration.
     */
    public function up(): void
    {
        Schema::create('resume', function (Blueprint $table) {
            $table->id('id_resume'); // primary key auto increment
            $table->unsignedBigInteger('id_pencari'); // foreign key ke tabel pencari kerja (nanti bisa ditambah relasi)
            $table->string('file_cv');
            $table->text('data_parsing');
            $table->date('tanggal_upload');
        });
    }

    /**
     * Rollback migration.
     */
    public function down(): void
    {
        Schema::dropIfExists('resume');
    }
};
