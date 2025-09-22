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
        Schema::create('lowongans', function (Blueprint $table) {
            $table->id('id_lowongan');
            $table->unsignedBigInteger('id_company');
            $table->string('judul');
            $table->text('deskripsi');
            $table->string('persyaratan')->nullable();
            $table->decimal('gaji', 15, 2)->nullable();
            $table->string('lokasi')->nullable();
            $table->string('jenis_pekerjaan')->nullable();
            $table->string('level_pekerjaan');
            $table->enum('status', ['dibuka', 'ditutup'])->default('dibuka');
            $table->date('tanggal_posting')->nullable();
            $table->date('tanggal_berakhir')->nullable();
            $table->timestamps();

            // Relasi ke tabel company
            $table->foreign('id_company')->references('id')->on('company_profiles')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lowongans');
    }
};
