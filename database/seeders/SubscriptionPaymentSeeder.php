<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\SubscriptionPayment;
use App\Models\Subscription;
use Carbon\Carbon;

class SubscriptionPaymentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $subscriptions = Subscription::with('plan')->get();

        foreach ($subscriptions as $index => $subscription) {
            if ($index == 0) {
                // Expired subscription - payment was completed before
                SubscriptionPayment::create([
                    'subscription_id' => $subscription->id,
                    'amount' => $subscription->plan->price_amount,
                    'currency' => 'IDR',
                    'status' => 'paid',
                    'payment_method' => 'bank_transfer',
                    'external_id' => 'TRX-' . strtoupper(uniqid()),
                    'va_number' => '8808' . rand(10000000, 99999999),
                    'payment_url' => null,
                    'expired_at' => Carbon::now()->addDays(1),
                    'paid_at' => Carbon::now()->subDays(60),
                    'created_at' => Carbon::now()->subDays(60),
                    'updated_at' => Carbon::now()->subDays(60),
                ]);
            } elseif ($index == 1) {
                // Pending payment
                SubscriptionPayment::create([
                    'subscription_id' => $subscription->id,
                    'amount' => $subscription->plan->price_amount,
                    'currency' => 'IDR',
                    'status' => 'pending',
                    'payment_method' => 'bank_transfer',
                    'external_id' => 'TRX-' . strtoupper(uniqid()),
                    'va_number' => '8808' . rand(10000000, 99999999),
                    'payment_url' => 'https://payment.gateway.com/' . strtoupper(substr(md5(uniqid()), 0, 16)),
                    'expired_at' => Carbon::now()->addDay(),
                    'paid_at' => null,
                    'created_at' => Carbon::now()->subDays(2),
                    'updated_at' => Carbon::now()->subDays(2),
                ]);
            } elseif ($index == 2) {
                // Active - ada 1 payment failed sebelumnya, kemudian berhasil
                SubscriptionPayment::create([
                    'subscription_id' => $subscription->id,
                    'amount' => $subscription->plan->price_amount,
                    'currency' => 'IDR',
                    'status' => 'failed',
                    'payment_method' => 'credit_card',
                    'external_id' => 'TRX-' . strtoupper(uniqid()),
                    'va_number' => null,
                    'payment_url' => null,
                    'expired_at' => Carbon::now()->subDays(28),
                    'paid_at' => null,
                    'created_at' => Carbon::now()->subDays(28),
                    'updated_at' => Carbon::now()->subDays(28),
                ]);

                SubscriptionPayment::create([
                    'subscription_id' => $subscription->id,
                    'amount' => $subscription->plan->price_amount,
                    'currency' => 'IDR',
                    'status' => 'paid',
                    'payment_method' => 'bank_transfer',
                    'external_id' => 'TRX-' . strtoupper(uniqid()),
                    'va_number' => '8808' . rand(10000000, 99999999),
                    'payment_url' => null,
                    'expired_at' => Carbon::now()->addDay(),
                    'paid_at' => Carbon::now()->subDays(27),
                    'created_at' => Carbon::now()->subDays(27),
                    'updated_at' => Carbon::now()->subDays(27),
                ]);
            } elseif ($index == 3) {
                // Active Premium
                SubscriptionPayment::create([
                    'subscription_id' => $subscription->id,
                    'amount' => $subscription->plan->price_amount,
                    'currency' => 'IDR',
                    'status' => 'paid',
                    'payment_method' => 'e_wallet',
                    'external_id' => 'TRX-' . strtoupper(uniqid()),
                    'va_number' => null,
                    'payment_url' => null,
                    'expired_at' => Carbon::now()->addDays(2),
                    'paid_at' => Carbon::now()->subDays(15),
                    'created_at' => Carbon::now()->subDays(15),
                    'updated_at' => Carbon::now()->subDays(15),
                ]);
            } else {
                // Free plan - no payment required, skip
            }
        }
    }
}
