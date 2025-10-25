<?php

namespace App\Http\Controllers\Company;

use App\Http\Controllers\Controller;
use App\Models\Subscription;
use App\Models\SubscriptionPlan;
use App\Models\SubscriptionPayment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
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
                ->with('error', 'Anda masih memiliki paket aktif atau menunggu pembayaran. Selesaikan terlebih dahulu sebelum memilih paket baru.');
        }

        DB::beginTransaction();
        try {
            // Calculate dates
            $startDate = Carbon::now();
            $endDate = $startDate->copy()->addDays($plan->duration_in_days);

            // Create subscription
            $subscription = Subscription::create([
                'company_id' => $company->id,
                'plan_id' => $plan->id,
                'status' => 'pending_payment',
                'start_date' => $startDate,
                'end_date' => $endDate,
                'payment_status' => 'pending',
            ]);

            // Create initial payment record
            $payment = SubscriptionPayment::create([
                'subscription_id' => $subscription->id,
                'amount' => $plan->price_amount,
                'payment_method' => 'bank_transfer', // Default
                'status' => 'pending',
                'transaction_id' => 'TRX-' . strtoupper(uniqid()),
                'payment_date' => null,
            ]);

            DB::commit();

            return redirect()
                ->route('company.subscription.invoice', $subscription->id)
                ->with('success', 'Paket berhasil dipilih! Silakan lakukan pembayaran.');

        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()
                ->back()
                ->with('error', 'Terjadi kesalahan saat memproses paket. Silakan coba lagi.');
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
}
