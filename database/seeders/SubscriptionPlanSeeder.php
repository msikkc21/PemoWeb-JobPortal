<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SubscriptionPlanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\SubscriptionPlan::insert([
            [
                'name' => 'Basic',
                'price_amount' => 100000,
                'price_currency' => 'IDR',
                'duration_in_days' => 30,
                'description' => 'Basic plan with 5 job postings per month',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Pro',
                'price_amount' => 250000,
                'price_currency' => 'IDR',
                'duration_in_days' => 30,
                'description' => 'Pro plan with 15 job postings per month',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Enterprise',
                'price_amount' => 500000,
                'price_currency' => 'IDR',
                'duration_in_days' => 30,
                'description' => 'Enterprise plan with unlimited job postings',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
