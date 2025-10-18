<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // This migration is now obsolete - using standard users table instead
        // See: database/migrations/0001_01_01_000000_create_users_table.php
    }

    public function down(): void
    {
        // No action needed
    }
};