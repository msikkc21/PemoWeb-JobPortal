<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SubscriptionPaymentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $subscriptions = \App\Models\Subscription::all();

        foreach ($subscriptions as $subscription) {
            $plan = \App\Models\SubscriptionPlan::find($subscription->plan_id);
            $startsAt = \Carbon\Carbon::parse($subscription->starts_at);
            
            \App\Models\SubscriptionPayment::create([
                'subscription_id' => $subscription->id,
                'amount' => $plan->price_amount,
                'currency' => 'IDR',
                'status' => 'paid',
                'payment_method' => fake()->randomElement(['bank_transfer', 'e_wallet', 'credit_card']),
                'external_id' => 'EXT-' . strtoupper(fake()->bothify('???###')),
                'va_number' => fake()->numerify('88########'),
                'payment_url' => fake()->url(),
                'expired_at' => $startsAt->copy()->addHours(24),
                'paid_at' => $startsAt,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
