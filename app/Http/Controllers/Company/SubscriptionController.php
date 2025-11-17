<?php

namespace App\Http\Controllers\Company;

use App\Http\Controllers\Controller;
use App\Models\Subscription;
use App\Models\SubscriptionPlan;
use App\Models\SubscriptionPayment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Carbon\Carbon;

class SubscriptionController extends Controller
{
    /**
     * Display subscription status and history (Point 7: Lihat Status Paket).
     */
    public function index()
    {
        $company = Auth::user()->company;

        // Get latest subscription
        $subscription = Subscription::with(['plan', 'payments'])
            ->where('company_id', $company->id)
            ->latest()
            ->first();

        // Get payment history (last 5)
        $paymentHistory = [];
        if ($subscription) {
            $paymentHistory = SubscriptionPayment::where('subscription_id', $subscription->id)
                ->orderBy('created_at', 'desc')
                ->take(5)
                ->get();
        }

        return Inertia::render('Company/Subscription/History', [
            'subscription' => $subscription,
            'plan' => $subscription?->plan,
            'paymentHistory' => $paymentHistory,
        ]);
    }

    /**
     * Show available subscription plans (Point 8: Pilih Paket Baru).
     */
    public function choose()
    {
        $plans = SubscriptionPlan::where('is_active', true)
            ->orderBy('price_amount', 'asc')
            ->get();

        return Inertia::render('Company/Subscription/PlanList', [
            'plans' => $plans,
        ]);
    }

    /**
     * Activate a new subscription (Point 8: Pilih Paket Baru).
     */
    public function activate(Request $request)
    {
        $validated = $request->validate([
            'plan_id' => 'required|exists:subscription_plans,id',
        ]);

        $company = Auth::user()->company;
        $plan = SubscriptionPlan::findOrFail($validated['plan_id']);

        // Check if company already has active or pending subscription
        $existingSubscription = Subscription::where('company_id', $company->id)
            ->whereIn('status', ['active', 'pending_payment'])
            ->first();

        if ($existingSubscription) {
            return redirect()
                ->back()
                ->with('error', 'Anda masih memiliki paket aktif atau menunggu pembayaran.');
        }

        DB::beginTransaction();
        try {
            $externalId = 'INV-' . strtoupper(uniqid());

            // Create subscription (starts_at and ends_at will be set when payment is confirmed)
            $subscription = Subscription::create([
                'company_id' => $company->id,
                'plan_id' => $plan->id,
                'status' => 'pending_payment',
                'starts_at' => now(), // Set initial timestamp
                'ends_at' => null, // Will be calculated after payment
                'renews_at' => null, // Will be calculated after payment
            ]);

            // Create payment record with external_id (belum ke gateway)
            SubscriptionPayment::create([
                'subscription_id' => $subscription->id,
                'amount' => $plan->price_amount,
                'payment_method' => 'bank_transfer',
                'status' => 'pending',
                'external_id' => $externalId,
                'payment_url' => null,
                'va_number' => null,
                'expired_at' => now()->addHours(24),
            ]);

            DB::commit();

            return redirect()
                ->route('company.subscription.invoice', $subscription->id)
                ->with('success', 'Paket berhasil dipilih. Silakan lanjut ke pembayaran.');

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Activate plan error', ['error' => $e->getMessage()]);
            return redirect()
                ->back()
                ->with('error', 'Gagal membuat langganan.');
        }
    }

    /**
     * Display invoice for subscription payment.
     */
    public function invoice($id)
    {
        $subscription = Subscription::with(['plan', 'company', 'payments'])
            ->findOrFail($id);

        // Check authorization
        if ($subscription->company_id !== Auth::user()->company->id) {
            abort(403, 'Unauthorized access to this invoice.');
        }

        // Get latest payment
        $payment = $subscription->payments()->latest()->first();

        // Generate virtual account number (simulated)
        $vaNumber = '8808' . str_pad($subscription->id, 10, '0', STR_PAD_LEFT);

        return Inertia::render('Company/Subscription/Invoice', [
            'subscription' => $subscription,
            'payment' => $payment,
            'vaNumber' => $vaNumber,
        ]);
    }

    /**
     * Create payment via payment gateway.
     * Returns JSON response for frontend to handle.
     */
    public function createPayment(Request $request)
    {
        $request->validate([
            'external_id' => 'required|string',
        ]);

        $company = Auth::user()->company;
        
        // Find payment by external_id
        $payment = SubscriptionPayment::with('subscription.plan')
            ->where('external_id', $request->external_id)
            ->firstOrFail();

        // Check authorization
        if ($payment->subscription->company_id !== $company->id) {
            abort(403, 'Unauthorized access.');
        }

        $plan = $payment->subscription->plan;

        try {
            // Call payment gateway API
            $response = Http::withHeaders([
                'X-API-Key' => config('services.payment.key'),
                'Accept' => 'application/json',
                'Content-Type' => 'application/json',
            ])->post(config('services.payment.base_url') . '/virtual-account/create', [
                'external_id' => $payment->external_id,
                'amount' => $plan->price_amount,
                'customer_name' => $company->company_name,
                'customer_email' => Auth::user()->email,
                'description' => 'Pembayaran Paket Langganan',
                'expired_duration' => 24,
                'metadata' => [
                    'subscription_id' => $payment->subscription->id,
                    'plan_id' => $plan->id,
                ],
            ]);

            if (!$response->successful()) {
                Log::error('Payment gateway error', [
                    'response' => $response->body(),
                    'status' => $response->status(),
                    'external_id' => $payment->external_id,
                ]);

                return back()->with('error', 'Gagal menghubungi gateway pembayaran.');
            }

            $data = $response->json()['data'] ?? [];
            $paymentUrl = $data['payment_url'] ?? null;

            // Update payment record
            $payment->update([
                'status' => 'pending',
                'va_number' => $data['va_number'] ?? null,
                'payment_url' => $paymentUrl,
                'expired_at' => isset($data['expired_at']) 
                    ? Carbon::parse($data['expired_at']) 
                    : now()->addHours(24),
            ]);

            // Update subscription status to pending_payment
            $payment->subscription->update([
                'status' => 'pending_payment',
            ]);

            // Return success redirect to reload invoice with new payment_url
            return redirect()
                ->route('company.subscription.invoice', $payment->subscription->id)
                ->with('success', 'Checkout berhasil! Silakan lanjutkan pembayaran.');

        } catch (\Exception $e) {
            Log::error('Payment creation error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'external_id' => $request->external_id,
            ]);

            return back()->with('error', 'Gagal membuat pembayaran. Silakan coba lagi.');
        }
    }

    /**
     * Continue to payment page.
     */
    public function continuePayment()
    {
        $company = Auth::user()->company;

        // Find pending payment that's not expired
        $payment = SubscriptionPayment::whereHas('subscription', function ($query) use ($company) {
                $query->where('company_id', $company->id);
            })
            ->where('status', 'pending')
            ->where(function ($query) {
                $query->whereNull('expired_at')
                    ->orWhere('expired_at', '>', now());
            })
            ->latest()
            ->first();

        if (!$payment) {
            return redirect()
                ->route('company.subscription.index')
                ->with('warning', 'Tidak ada tagihan pembayaran yang tersedia.');
        }

        // If payment URL exists, redirect to payment page
        if ($payment->payment_url) {
            return redirect()->away($payment->payment_url);
        }

        // Otherwise, redirect to invoice
        return redirect()
            ->route('company.subscription.invoice', $payment->subscription_id)
            ->with('info', 'Silakan lakukan pembayaran sesuai instruksi.');
    }

    /**
     * Check payment status via gateway API.
     */
    public function checkPayment($externalId)
    {
        $payment = SubscriptionPayment::with('subscription.plan')
            ->where('external_id', $externalId)
            ->firstOrFail();

        // Verify authorization
        if ($payment->subscription->company_id !== Auth::user()->company->id) {
            abort(403, 'Unauthorized access.');
        }

        // Check if already paid
        if ($payment->status === 'paid') {
            return redirect()
                ->route('company.subscription.invoice', $payment->subscription->id)
                ->with('info', 'Pembayaran sudah berhasil dikonfirmasi sebelumnya.');
        }

        try {
            // Call payment gateway to check status
            $response = Http::withHeaders([
                'X-API-Key' => config('services.payment.key'),
                'Accept' => 'application/json',
            ])->get(config('services.payment.base_url') . '/virtual-account/' . $payment->va_number . '/status');

            if (!$response->successful()) {
                Log::error('Payment check gateway error', [
                    'response' => $response->body(),
                    'status' => $response->status(),
                    'external_id' => $externalId,
                ]);

                return back()->with('error', 'Gagal memeriksa status pembayaran dari gateway.');
            }

            $data = $response->json()['data'] ?? [];
            $status = strtoupper($data['status'] ?? 'PENDING');
            
            if ($status === 'PAID') {
                DB::beginTransaction();
                try {
                    $now = now();
                    $plan = $payment->subscription->plan;
                    
                    // Calculate subscription dates
                    $startsAt = $now;
                    $endsAt = $now->copy()->addDays($plan->duration_in_days);
                    $renewsAt = $endsAt->copy()->subDays(3); // 3 days before expiry

                    // Update payment status
                    $payment->update([
                        'status' => 'paid',
                        'paid_at' => $now,
                    ]);
                    
                    // Update subscription with calculated dates
                    $payment->subscription->update([
                        'status' => 'active',
                        'payment_status' => 'paid',
                        'starts_at' => $startsAt,
                        'ends_at' => $endsAt,
                        'renews_at' => $renewsAt,
                    ]);

                    DB::commit();
                    
                    return Inertia::render('Company/Subscription/Success', [
                        'payment' => $payment->fresh(),
                        'subscription' => $payment->subscription->fresh(),
                    ]);

                } catch (\Exception $e) {
                    DB::rollBack();
                    Log::error('Payment update error', [
                        'error' => $e->getMessage(),
                        'trace' => $e->getTraceAsString(),
                        'external_id' => $externalId,
                    ]);
                    throw $e;
                }
            }

            // Payment not yet confirmed
            return back()->with('info', 'Pembayaran belum dikonfirmasi. Status saat ini: ' . $status);

        } catch (\Exception $e) {
            Log::error('Payment check error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'external_id' => $externalId,
            ]);

            return back()->with('error', 'Gagal memeriksa status pembayaran. Silakan coba lagi.');
        }
    }
}

