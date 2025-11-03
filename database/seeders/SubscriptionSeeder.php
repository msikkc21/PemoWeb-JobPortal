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

        if ($companies->isEmpty() || $plans->isEmpty()) {
            $this->command->info('No companies or plans found — skipping SubscriptionSeeder.');
            return;
        }

        foreach ($companies as $index => $company) {
            try {
                // default safe values
                $plan = $plans->first();
                $startDate = Carbon::now();
                $endDate = (clone $startDate)->addMonth();
                $status = 'active';

                // variasi berdasarkan index
                if ($index === 0) {
                    $plan = $plans->where('name', 'Basic')->first() ?? $plan;
                    $startDate = Carbon::now()->subDays(60);
                    $endDate = Carbon::now()->subDays(5);
                    $status = 'expired';
                } elseif ($index === 1) {
                    $plan = $plans->where('name', 'Premium')->first() ?? $plan;
                    $startDate = Carbon::now();
                    $endDate = Carbon::now()->addMonth();
                    $status = 'pending_payment';
                } elseif ($index === 2) {
                    $plan = $plans->where('name', 'Basic')->first() ?? $plan;
                    $startDate = Carbon::now()->subDays(27);
                    $endDate = Carbon::now()->addDays(3);
                    $status = 'active';
                } elseif ($index === 3) {
                    $plan = $plans->where('name', 'Premium')->first() ?? $plan;
                    $startDate = Carbon::now()->subDays(15);
                    $endDate = Carbon::now()->addDays(15);
                    $status = 'active';
                } else {
                    $plan = $plans->where('name', 'Free')->first() ?? $plan;
                    $startDate = Carbon::now()->subDays(10);
                    $endDate = Carbon::now()->addDays(20);
                    $status = 'active';
                }

                // jika plan tidak ditemukan, skip dengan pesan
                if (empty($plan) || empty($plan->id)) {
                    $this->command->warn("No plan found for company_id={$company->id}, skipping subscription.");
                    continue;
                }

                Subscription::firstOrCreate(
                    ['company_id' => $company->id, 'plan_id' => $plan->id],
                    [
                        'company_id' => $company->id,
                        'plan_id'    => $plan->id,
                        'starts_at'  => $startDate,
                        'ends_at'    => $endDate,
                        'renews_at'  => $endDate,
                        'cancels_at' => null,
                        'status'     => $status,
                        'created_at' => $startDate,
                        'updated_at' => Carbon::now(),
                    ]
                );

                $this->command->info("Seeded subscription for company_id={$company->id} status={$status}.");

            } catch (\Throwable $e) {
                $this->command->error("Failed seeding subscription for company_id={$company->id}: " . $e->getMessage());
                continue;
            }
        }
    }
}