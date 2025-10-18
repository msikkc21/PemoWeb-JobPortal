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
            $table->id('job_id');
            $table->foreignId('company_id')->constrained('company_profiles')->onDelete('cascade');
            $table->string('title');
            $table->text('description');
            $table->string('requirements')->nullable();
            $table->decimal('salary', 15, 2)->nullable();
            $table->string('location')->nullable();
            $table->string('job_type')->nullable();
            $table->string('job_level');
            $table->enum('status', ['open', 'closed'])->default('open'); // status mapping: dibuka->open, ditutup->closed
            $table->date('posted_date')->nullable();
            $table->date('expiry_date')->nullable();
            $table->boolean('is_approved')->default(false);
            $table->timestamps();
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
