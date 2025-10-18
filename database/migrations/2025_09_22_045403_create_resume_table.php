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
            $table->id('resume_id');
            $table->foreignId('jobseeker_id')->constrained('jobseeker_profiles', 'jobseeker_id')->onDelete('cascade');
            $table->string('cv_file');
            $table->text('parsed_data');
            $table->date('upload_date');
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
