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
            $table->id('interview_id');
            $table->foreignId('application_id')->constrained('lamarans', 'application_id')->onDelete('cascade');
            $table->dateTime('schedule');
            $table->string('location');
            $table->string('status');
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
