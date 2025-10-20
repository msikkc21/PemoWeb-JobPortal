<?php

namespace App\Http\Middleware;

use App\Models\CompanyPayment;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class EnsureCompanyPaymentCompleted
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // if (!Auth::check()) {
        //     return redirect()->route('login');
        // }

        // $user = Auth::user();
        // $roleName = $user->role?->name;

        // // Hanya cek untuk role "Perusahaan" / "Company"
        // $isCompany = in_array($roleName, ['Perusahaan', 'Company'], true);

        // if (!$isCompany) {
        //     return $next($request);
        // }

        // // Izinkan akses ke halaman payment sendiri agar tidak infinite redirect
        // $path = $request->path();
        // $isOnPaymentPage = $path === 'company/payment' || $path === 'company/payment/start';

        // if ($isOnPaymentPage) {
        //     return $next($request);
        // }

        // // Cek payment terakhir 
        // $payment = CompanyPayment::where('user_id', $user->id)
        //     ->orderByDesc('id')
        //     ->first();

        // // Jika belum ada payment atau status belum "paid", redirect paksa
        // if (!$payment || $payment->status !== 'paid') {
        //     return redirect()->to('/company/payment')
        //         ->with('warning', 'Silakan selesaikan pembayaran terlebih dahulu.');
        // }

        // return $next($request);

        if (!Auth::check()) {
            return redirect()->route('login');
        }

        $user = Auth::user();
        $isCompany = in_array($user->role?->name, ['Perusahaan', 'Company']);

        if (!$isCompany) {
            return $next($request);
        }

        $path = $request->path();
        $isOnPaymentPage = str_starts_with($path, 'company/payment');

        // ✅ Izinkan semua route /company/payment/*
        if ($isOnPaymentPage) {
            return $next($request);
        }

        // ❌ Jika belum ada payment atau belum paid → paksa ke payment
        $payment = CompanyPayment::where('user_id', $user->id)->orderByDesc('id')->first();

        if (!$payment || $payment->status !== 'paid') {
            return redirect()->to('/company/payment')->with('warning', 'Silakan selesaikan pembayaran terlebih dahulu.');
        }

        return $next($request);
    }
}
