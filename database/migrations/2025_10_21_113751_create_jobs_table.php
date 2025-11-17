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
        Schema::create('job_posts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained('companies')->cascadeOnDelete();
            $table->string('title');
            $table->text('description');
            $table->text('requirements')->nullable();
            $table->decimal('salary_min', 15, 2)->nullable();
            $table->decimal('salary_max', 15, 2)->nullable();
            $table->char('currency', 3)->default('IDR');
            $table->string('location')->nullable();
            $table->string('job_type')->nullable();
            $table->string('job_level')->nullable();
            $table->enum('status', ['draft', 'pending_review', 'approved', 'rejected', 'closed'])->default('draft');
            $table->date('posted_date')->nullable();
            $table->date('expiry_date')->nullable();
            $table->timestamps();
            
            $table->index(['company_id', 'status']);
            $table->index(['posted_date', 'expiry_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('jobs');
    }
};
