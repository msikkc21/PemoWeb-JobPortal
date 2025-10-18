<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('lowongan_keahlians', function (Blueprint $table) {
            $table->foreignId('job_id')->constrained('lowongans', 'job_id')->onDelete('cascade');
            $table->foreignId('skill_id')->constrained('keahlians', 'skill_id')->onDelete('cascade');

            $table->primary(['job_id', 'skill_id']); 
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lowongan_keahlians');
    }
};