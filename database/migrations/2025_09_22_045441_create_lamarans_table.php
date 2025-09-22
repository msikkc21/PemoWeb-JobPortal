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
        Schema::create('lamarans', function (Blueprint $table) {
            $table->id('id_lamaran');
            $table->unsignedBigInteger('id_lowongan');
            $table->unsignedBigInteger('id_pencari');
            $table->unsignedBigInteger('id_resume');
            $table->enum('status', ['dikirim', 'diproses', 'diterima', 'ditolak']);
            $table->date('tanggal_lamaran');
            $table->text('catatan')->nullable();
            $table->timestamps();

            $table->foreign('id_lowongan')->references('id_lowongan')->on('lowongans')->onDelete('cascade');
            $table->foreign('id_pencari')->references('id_pencari')->on('jobseeker_profiles')->onDelete('cascade');
            $table->foreign('id_resume')->references('id_resume')->on('resume')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lamarans');
    }
};
