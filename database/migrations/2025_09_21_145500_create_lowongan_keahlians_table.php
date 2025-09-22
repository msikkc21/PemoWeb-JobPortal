<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('lowongan_keahlians', function (Blueprint $table) {
            $table->foreignId('id_lowongan')
                  ->constrained('lowongans') 
                  ->onDelete('cascade'); 

            $table->foreignId('id_keahlian')
                  ->constrained('keahlians') 
                  ->onDelete('cascade');
            $table->primary(['id_lowongan', 'id_keahlian']); 
            
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lowongan_keahlians');
    }
};