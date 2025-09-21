<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('lowongan_keahlian', function (Blueprint $table) {
            $table->foreignId('id_lowongan')
                  ->constrained('lowongan', 'id_lowongan') 
                  ->onDelete('cascade'); 

            $table->foreignId('id_keahlian')
                  ->constrained('keahlian', 'id_keahlian') 
                  ->onDelete('cascade');
            $table->primary(['id_lowongan', 'id_keahlian']); 
            
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lowongan_keahlian');
    }
};