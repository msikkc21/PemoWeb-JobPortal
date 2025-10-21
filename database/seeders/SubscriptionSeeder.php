<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SubscriptionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $companies = \App\Models\Company::all();
        $plans = \App\Models\SubscriptionPlan::all();

        foreach ($companies as $company) {
            $plan = $plans->random();
            $startsAt = now()->subDays(rand(5, 20));
            
            \App\Models\Subscription::create([
                'company_id' => $company->id,
                'plan_id' => $plan->id,
                'starts_at' => $startsAt,
                'ends_at' => $startsAt->copy()->addDays($plan->duration_in_days),
                'renews_at' => $startsAt->copy()->addDays($plan->duration_in_days),
                'cancels_at' => null,
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
