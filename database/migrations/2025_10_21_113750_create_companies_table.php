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
        Schema::create('companies', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('company_name');
            $table->string('industry')->nullable();
            $table->text('description')->nullable();
            $table->string('location')->nullable();
            $table->string('website')->nullable();
            $table->string('company_email')->nullable();
            $table->string('phone')->nullable();
            $table->text('address')->nullable();
            $table->string('photo_path')->nullable();
            $table->unsignedInteger('employee_count')->nullable();
            $table->unsignedSmallInteger('founded_year')->nullable();
            $table->timestamps();
            
            $table->unique('user_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('companies');
    }
};
