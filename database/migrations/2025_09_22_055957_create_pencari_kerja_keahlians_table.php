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
            $table->foreignId('jobseeker_id')->constrained('jobseeker_profiles', 'jobseeker_id')->onDelete('cascade');
            $table->foreignId('skill_id')->constrained('keahlians', 'skill_id')->onDelete('cascade');
            $table->enum('level', ['beginner', 'intermediate', 'expert']); // level mapping: pemula->beginner, menengah->intermediate, mahir->expert
            $table->integer('experience_years');
            $table->timestamps();

            $table->primary(['jobseeker_id', 'skill_id']);
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
