<?php

namespace App\Http\Controllers\Shared;

use App\Http\Controllers\Controller;
use App\Models\Subscription;
use App\Models\SubscriptionPayment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PaymentWebhookController extends Controller
{
    /**
     * Handle incoming webhook from payment gateway.
     */
    public function handle(Request $request)
    {
        // Get raw payload using php://input to ensure we get the exact body sent by gateway
        $payload = file_get_contents('php://input');
        
        // Get signature from header
        $signature = $request->header('X-Webhook-Signature');

        // Get webhook secret from config
        $webhookSecret = config('services.payment.webhook_secret');

        // Validate signature using HMAC SHA256
        $expectedSignature = hash_hmac('sha256', $payload, $webhookSecret);

        // Log for debugging (only computed signature, not secret)
        Log::channel('stack')->info('[payment.webhook] Received webhook', [
            'signature_received' => $signature,
            'signature_computed' => $expectedSignature,
            'signature_match' => hash_equals($expectedSignature, $signature ?? ''),
            'ip' => $request->ip(),
        ]);

        if (!hash_equals($expectedSignature, $signature ?? '')) {
            Log::channel('stack')->warning('[payment.webhook] Invalid webhook signature', [
                'expected' => $expectedSignature,
                'received' => $signature,
                'payload_length' => strlen($payload),
                'ip' => $request->ip(),
            ]);

            // Return 200 to acknowledge and prevent retry
            return response()->json(['message' => 'Invalid Signature Acknowledged'], 200);
        }

        // Decode JSON payload
        $data = json_decode($payload, true);

        if (!$data || json_last_error() !== JSON_ERROR_NONE) {
            Log::channel('stack')->warning('[payment.webhook] Invalid JSON payload', [
                'json_error' => json_last_error_msg(),
                'payload_preview' => substr($payload, 0, 200),
            ]);

            return response()->json(['message' => 'Invalid JSON'], 200);
        }

        $event = $data['event'] ?? null;
        $externalId = $data['data']['external_id'] ?? null;

        if (!$event || !$externalId) {
            Log::channel('stack')->warning('[payment.webhook] Missing required fields', [
                'event' => $event,
                'external_id' => $externalId,
                'payload' => $data,
            ]);

            return response()->json(['message' => 'Missing required fields'], 200);
        }

        // Find payment record
        $payment = SubscriptionPayment::where('external_id', $externalId)->first();

        if (!$payment) {
            Log::channel('stack')->warning('[payment.webhook] Payment not found', [
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
                    Log::channel('stack')->info('[payment.webhook] Unhandled event', [
                        'event' => $event,
                        'external_id' => $externalId,
                    ]);
                    break;
            }

            return response()->json(['message' => 'Webhook processed'], 200);

        } catch (\Exception $e) {
            Log::channel('stack')->error('[payment.webhook] Error processing webhook', [
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
        DB::transaction(function () use ($payment) {
            // Update payment status
            $payment->update([
                'status' => 'paid',
                'paid_at' => now(),
            ]);

            // Get subscription and plan
            $subscription = $payment->subscription;
            $plan = $subscription->plan;

            // Calculate subscription period
            $startsAt = now();
            $endsAt = now()->addDays($plan->duration_days);
            $renewsAt = $endsAt->copy()->subDays(7); // Renew notification 7 days before end

            // Activate subscription
            $subscription->update([
                'status' => 'active',
                'starts_at' => $startsAt,
                'ends_at' => $endsAt,
                'renews_at' => $renewsAt,
            ]);

            Log::channel('stack')->info('[payment.webhook] Payment successful', [
                'payment_id' => $payment->id,
                'subscription_id' => $subscription->id,
                'external_id' => $payment->external_id,
                'starts_at' => $startsAt,
                'ends_at' => $endsAt,
            ]);
        });
    }

    /**
     * Handle expired payment.
     */
    private function handlePaymentExpired(SubscriptionPayment $payment, array $data)
    {
        DB::transaction(function () use ($payment) {
            // Update payment status
            $payment->update([
                'status' => 'expired',
            ]);

            // Update subscription status to expired
            $subscription = $payment->subscription;
            $subscription->update([
                'status' => 'expired',
            ]);

            Log::channel('stack')->info('[payment.webhook] Payment expired', [
                'payment_id' => $payment->id,
                'subscription_id' => $subscription->id,
                'external_id' => $payment->external_id,
            ]);
        });
    }

    /**
     * Handle cancelled payment.
     */
    private function handlePaymentCancelled(SubscriptionPayment $payment, array $data)
    {
        DB::transaction(function () use ($payment) {
            // Update payment status to failed
            $payment->update([
                'status' => 'failed',
            ]);

            Log::channel('stack')->info('[payment.webhook] Payment cancelled', [
                'payment_id' => $payment->id,
                'subscription_id' => $payment->subscription_id,
                'external_id' => $payment->external_id,
            ]);
        });
    }
}
