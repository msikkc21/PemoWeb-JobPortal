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
        Schema::create('lowongan_keahlians', function (Blueprint $table) {
            $table->unsignedBigInteger('id_lowongan');
            $table->unsignedBigInteger('id_keahlian');
            $table->enum('tingkat', ['pemula', 'menengah', 'mahir']);
            $table->timestamps();

            $table->primary(['id_lowongan', 'id_keahlian']);
            $table->foreign('id_lowongan')->references('id_lowongan')->on('lowongans')->onDelete('cascade');
            $table->foreign('id_keahlian')->references('id_keahlian')->on('keahlians')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lowongan_keahlians');
    }
};
