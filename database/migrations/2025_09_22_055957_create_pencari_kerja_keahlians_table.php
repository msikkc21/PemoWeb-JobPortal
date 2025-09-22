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
        Schema::create('pencari_kerja_keahlians', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('id_pencari');
            $table->unsignedBigInteger('id_keahlian');
            $table->enum('tingkat', ['pemula', 'menengah', 'mahir']);
            $table->integer('pengalaman_tahun');
            $table->timestamps();

            $table->primary(['id_pencari', 'id_keahlian']);
            $table->foreign('id_pencari')->references('id_pencari')->on('profil_pencarikerja')->onDelete('cascade');
            $table->foreign('id_keahlian')->references('id_keahlian')->on('keahlians')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pencari_kerja_keahlians');
    }
};
