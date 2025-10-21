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
        Schema::create('applications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('job_id')->constrained('job_posts')->cascadeOnDelete();
            $table->foreignId('job_seeker_id')->constrained('job_seekers')->cascadeOnDelete();
            $table->foreignId('resume_id')->constrained('resumes')->restrictOnDelete();
            $table->enum('status', ['submitted', 'in_process', 'shortlisted', 'interviewed', 'offered', 'accepted', 'rejected'])->default('submitted');
            $table->date('application_date');
            $table->text('notes')->nullable();
            $table->timestamps();
            
            $table->unique(['job_id', 'job_seeker_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('applications');
    }
};
