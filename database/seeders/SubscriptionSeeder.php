<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Subscription;
use App\Models\Company;
use App\Models\SubscriptionPlan;
use Carbon\Carbon;

class SubscriptionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $companies = Company::all();
        $plans = SubscriptionPlan::all();

        foreach ($companies as $index => $company) {
            // Variasi status subscription
            if ($index == 0) {
                // Company 1: expired subscription
                $plan = $plans->where('name', 'Basic')->first();
                $startDate = Carbon::now()->subDays(60);
                $endDate = Carbon::now()->subDays(5);
                
                Subscription::create([
                    'company_id' => $company->id,
                    'plan_id' => $plan->id,
                    'starts_at' => $startDate,
                    'ends_at' => $endDate,
                    'renews_at' => null,
                    'cancels_at' => null,
                    'status' => 'expired',
                    'created_at' => $startDate,
                    'updated_at' => $endDate,
                ]);
            } elseif ($index == 1) {
                // Company 2: pending payment
                $plan = $plans->where('name', 'Premium')->first();
                
                Subscription::create([
                    'company_id' => $company->id,
                    'plan_id' => $plan->id,
                    'starts_at' => null,
                    'ends_at' => null,
                    'renews_at' => null,
                    'cancels_at' => null,
                    'status' => 'pending_payment',
                    'created_at' => Carbon::now()->subDays(2),
                    'updated_at' => Carbon::now()->subDays(2),
                ]);
            } elseif ($index == 2) {
                // Company 3: akan renew dalam 3 hari
                $plan = $plans->where('name', 'Basic')->first();
                $startDate = Carbon::now()->subDays(27);
                $endDate = Carbon::now()->addDays(3);
                
                Subscription::create([
                    'company_id' => $company->id,
                    'plan_id' => $plan->id,
                    'starts_at' => $startDate,
                    'ends_at' => $endDate,
                    'renews_at' => $endDate,
                    'cancels_at' => null,
                    'status' => 'active',
                    'created_at' => $startDate,
                    'updated_at' => Carbon::now()->subDay(),
                ]);
            } elseif ($index == 3) {
                // Company 4: active premium
                $plan = $plans->where('name', 'Premium')->first();
                $startDate = Carbon::now()->subDays(15);
                $endDate = Carbon::now()->addDays(15);
                
                Subscription::create([
                    'company_id' => $company->id,
                    'plan_id' => $plan->id,
                    'starts_at' => $startDate,
                    'ends_at' => $endDate,
                    'renews_at' => $endDate,
                    'cancels_at' => null,
                    'status' => 'active',
                    'created_at' => $startDate,
                    'updated_at' => Carbon::now()->subDays(3),
                ]);
            } else {
                // Company 5: free plan
                $plan = $plans->where('name', 'Free')->first();
                $startDate = Carbon::now()->subDays(10);
                $endDate = Carbon::now()->addDays(20);
                
                Subscription::create([
                    'company_id' => $company->id,
                    'plan_id' => $plan->id,
                    'starts_at' => $startDate,
                    'ends_at' => $endDate,
                    'renews_at' => $endDate,
                    'cancels_at' => null,
                    'status' => 'active',
                    'created_at' => $startDate,
                    'updated_at' => Carbon::now()->subDays(2),
                ]);
            }
        }
    }
}
