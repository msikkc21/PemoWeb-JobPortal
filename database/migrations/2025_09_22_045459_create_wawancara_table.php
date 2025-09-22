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
        Schema::create('wawancara', function (Blueprint $table) {
            $table->increments('id_wawancara'); // primary key auto increment
            $table->unsignedBigInteger('id_lamaran'); // foreign key ke tabel lamaran (nanti bisa ditambah relasi)
            $table->dateTime('jadwal');
            $table->string('lokasi');
            $table->string('status');

            $table->foreign('id_lamaran')->references('id_lamaran')->on('lamarans')->onDelete('cascade');
        });
    }

    /**
     * Rollback migration.
     */
    public function down(): void
    {
        Schema::dropIfExists('wawancara');
    }
};
