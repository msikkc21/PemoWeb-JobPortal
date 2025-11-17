<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\SubscriptionPlan;

class SubscriptionPlanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        SubscriptionPlan::insert([
            [
                'name' => 'Free',
                'price_amount' => 0,
                'price_currency' => 'IDR',
                'duration_in_days' => 30,
                'description' => 'Paket gratis untuk mencoba platform kami - Posting hingga 2 lowongan kerja, Akses dasar ke database kandidat',
                'is_active' => true,
                'created_at' => now()->subMonths(12),
                'updated_at' => now()->subMonths(12),
            ],
            [
                'name' => 'Basic',
                'price_amount' => 500000,
                'price_currency' => 'IDR',
                'duration_in_days' => 30,
                'description' => 'Paket dasar untuk perusahaan kecil - Posting hingga 10 lowongan kerja, 2 lowongan unggulan, Analytics dasar',
                'is_active' => true,
                'created_at' => now()->subMonths(12),
                'updated_at' => now()->subMonths(6),
            ],
            [
                'name' => 'Premium',
                'price_amount' => 1500000,
                'price_currency' => 'IDR',
                'duration_in_days' => 30,
                'description' => 'Paket lengkap untuk perusahaan berkembang - Posting hingga 50 lowongan kerja, 10 lowongan unggulan, Analytics lengkap, Dukungan 24/7',
                'is_active' => true,
                'created_at' => now()->subMonths(12),
                'updated_at' => now()->subMonths(3),
            ],
            [
                'name' => 'Enterprise',
                'price_amount' => 5000000,
                'price_currency' => 'IDR',
                'duration_in_days' => 30,
                'description' => 'Solusi khusus untuk perusahaan besar - Unlimited job posts, 50 lowongan unggulan, Dedicated account manager, Custom integration',
                'is_active' => true,
                'created_at' => now()->subMonths(12),
                'updated_at' => now()->subMonth(),
            ],
        ]);
    }
}
