<?php

namespace App\Http\Controllers\Shared;

use App\Http\Controllers\Controller;
use App\Models\Subscription;
use App\Models\SubscriptionPayment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PaymentWebhookController extends Controller
{
    /**
     * Handle incoming webhook from payment gateway.
     */
    public function handle(Request $request)
    {
        // Get raw payload and signature
        $payload = $request->getContent();
        $signature = $request->header('X-Webhook-Signature');

        // Validate signature
        $expectedSignature = hash_hmac('sha256', $payload, config('services.payment.webhook_secret'));

        if (!hash_equals($expectedSignature, $signature ?? '')) {
            Log::warning('Invalid webhook signature', [
                'expected' => $expectedSignature,
                'received' => $signature,
                'ip' => $request->ip(),
            ]);

            // Return 200 to acknowledge but log the invalid signature
            return response()->json(['message' => 'Invalid signature but acknowledged'], 200);
        }

        // Decode JSON payload
        $data = json_decode($payload, true);

        if (!$data) {
            Log::warning('Invalid webhook payload - unable to decode JSON', [
                'payload' => $payload,
            ]);

            return response()->json(['message' => 'Invalid payload'], 200);
        }

        $event = $data['event'] ?? null;
        $externalId = $data['data']['external_id'] ?? null;

        if (!$event || !$externalId) {
            Log::warning('Webhook missing required fields', [
                'event' => $event,
                'external_id' => $externalId,
            ]);

            return response()->json(['message' => 'Missing required fields'], 200);
        }

        // Find payment record
        $payment = SubscriptionPayment::where('external_id', $externalId)->first();

        if (!$payment) {
            Log::warning('Payment not found for external_id', [
                'external_id' => $externalId,
                'event' => $event,
            ]);

            return response()->json(['message' => 'Payment not found'], 200);
        }

        // Handle different webhook events
        try {
            switch ($event) {
                case 'payment.success':
                    $this->handlePaymentSuccess($payment, $data);
                    break;

                case 'payment.expired':
                    $this->handlePaymentExpired($payment, $data);
                    break;

                case 'payment.cancelled':
                    $this->handlePaymentCancelled($payment, $data);
                    break;

                default:
                    Log::info('Unhandled webhook event', [
                        'event' => $event,
                        'external_id' => $externalId,
                    ]);
                    break;
            }

            return response()->json(['message' => 'OK'], 200);

        } catch (\Exception $e) {
            Log::error('Error processing webhook', [
                'event' => $event,
                'external_id' => $externalId,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            // Still return 200 to prevent gateway retries
            return response()->json(['message' => 'Error but acknowledged'], 200);
        }
    }

    /**
     * Handle successful payment.
     */
    private function handlePaymentSuccess(SubscriptionPayment $payment, array $data)
    {
        // Update payment status
        $payment->update([
            'status' => 'paid',
            'paid_at' => now(),
        ]);

        // Update subscription status to active
        $subscription = $payment->subscription;
        $subscription->update([
            'status' => 'active',
            'payment_status' => 'paid',
        ]);

        Log::info('Payment successful', [
            'payment_id' => $payment->id,
            'subscription_id' => $subscription->id,
            'external_id' => $payment->external_id,
        ]);
    }

    /**
     * Handle expired payment.
     */
    private function handlePaymentExpired(SubscriptionPayment $payment, array $data)
    {
        // Update payment status
        $payment->update([
            'status' => 'expired',
        ]);

        // Update subscription status to expired
        $subscription = $payment->subscription;
        $subscription->update([
            'status' => 'expired',
            'payment_status' => 'expired',
        ]);

        Log::info('Payment expired', [
            'payment_id' => $payment->id,
            'subscription_id' => $subscription->id,
            'external_id' => $payment->external_id,
        ]);
    }

    /**
     * Handle cancelled payment.
     */
    private function handlePaymentCancelled(SubscriptionPayment $payment, array $data)
    {
        // Update payment status
        $payment->update([
            'status' => 'failed',
        ]);

        Log::info('Payment cancelled', [
            'payment_id' => $payment->id,
            'subscription_id' => $payment->subscription_id,
            'external_id' => $payment->external_id,
        ]);
    }
}
