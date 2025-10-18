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
            $table->id('application_id');
            $table->foreignId('job_id')->constrained('lowongans', 'job_id')->onDelete('cascade');
            $table->foreignId('jobseeker_id')->constrained('jobseeker_profiles', 'jobseeker_id')->onDelete('cascade');
            $table->foreignId('resume_id')->constrained('resume', 'resume_id')->onDelete('cascade');
            $table->enum('status', ['submitted', 'in_process', 'accepted', 'rejected']); // status mapping: dikirim->submitted, diproses->in_process, diterima->accepted, ditolak->rejected
            $table->date('application_date');
            $table->text('notes')->nullable();
            $table->timestamps();
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
