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
        Schema::create('company_profiles', function (Blueprint $table) {
            $table->bigIncrements('id_perusahaan');

            $table->unsignedBigInteger('id_pengguna');
            $table->string('nama_perusahaan');
            $table->string('industri')->nullable();
            $table->text('deskripsi')->nullable();
            $table->string('lokasi')->nullable();
            $table->string('website')->nullable();
            $table->string('email_perusahaan')->nullable();
            $table->string('telepon')->nullable();
            $table->text('alamat')->nullable();
            $table->string('path_foto')->nullable();
            $table->unsignedInteger('jumlah_karyawan')->nullable();
            $table->unsignedSmallInteger('tahun_dibentuk')->nullable();

            // Custom timestamps to match the model constants
            $table->timestamp('dibuat_pada')->useCurrent();
            $table->timestamp('diperbarui_pada')->useCurrent()->useCurrentOnUpdate();

            // Foreign key to users table
            $table->foreign('id_pengguna')
                ->references('id')->on('users')
                ->cascadeOnUpdate()
                ->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('company_profiles');
    }
};
