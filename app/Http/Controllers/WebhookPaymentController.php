<?php

namespace App\Http\Controllers;

use App\Models\CompanyPayment;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Log;

class WebhookPaymentController extends Controller
{
    public function handle(Request $request)
    {
        // Pastikan tidak pernah redirect atau generate view — HARUS JSON ONLY
        $payload = $request->getContent();
        $signature = $request->header('X-Webhook-Signature');
        $secret = config('services.payment.webhook_secret', env('PAYMENT_WEBHOOK_SECRET'));

        // Log minimal untuk debug — AMAN (tidak log signature gateway)
        Log::info('Webhook received', [
            'raw_payload' => $payload,
            'signature_provided' => substr($signature ?? '', 0, 10) . '***',
        ]);

        // Verifikasi signature HMAC SHA256
        $expected = hash_hmac('sha256', $payload, $secret);

        if (!$signature || !hash_equals($expected, $signature)) {
            Log::warning('Invalid Webhook Signature', [
                'expected' => substr($expected, 0, 10) . '***',
            ]);
            // Tetap balas 200 agar gateway tidak retry terus
            return response()->json(['message' => 'Invalid signature but acknowledged'], 200);
        }

        // Decode JSON
        $json = json_decode($payload, true);
        if (!$json || !isset($json['event']) || !isset($json['data']['external_id'])) {
            return response()->json(['message' => 'Invalid payload format'], 200);
        }

        $event = $json['event'];
        $externalId = $json['data']['external_id'];

        // Ambil payment dari DB
        $payment = CompanyPayment::where('external_id', $externalId)->first();

        if (!$payment) {
            Log::warning('Payment not found by external_id', [
                'external_id' => $externalId,
            ]);
            return response()->json(['message' => 'Payment not found'], 200);
        }

        // Update status sesuai event
        if ($event === 'payment.success') {
            $payment->status = 'paid';
            $payment->expired_at = isset($json['data']['paid_at'])
                ? Carbon::parse($json['data']['paid_at'])
                : $payment->expired_at;
        } elseif ($event === 'payment.expired') {
            $payment->status = 'expired';
        } elseif ($event === 'payment.cancelled') {
            $payment->status = 'failed';
        }

        $payment->save();

        // ✅ HARUS selalu balas 200 ok — kalau 4xx/5xx gateway akan retry terus
        return response()->json(['message' => 'OK'], 200);
    }
}
