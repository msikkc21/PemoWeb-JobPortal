<?php

namespace App\Http\Controllers;

use App\Models\CompanyPayment;
use App\Models\CompanyProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use Inertia\Inertia;

class CompanyPaymentController extends Controller
{
    /**
     * Ringkasan pembayaran:
     * - Jika ada payment 'pending' tapi expired -> tandai expired dan tampilkan opsi "Buat Pembayaran Baru".
     * - Jika ada payment 'pending' dan belum expired -> tampilkan tombol "Lanjutkan Pembayaran" (tanpa auto-redirect).
     * - Jika tidak ada payment -> tampilkan tombol "Buat Pembayaran".
     */
    public function index()
    {
        $user = Auth::user();

        // (Opsional) ambil profil bila perlu ditampilkan di view
        $profile = CompanyProfile::where('user_id', $user->id)->first();

        // Payment terbaru apa pun statusnya
        $payment = CompanyPayment::where('user_id', $user->id)
            ->orderByDesc('id')
            ->first();

        // Normalisasi jika pending tapi sudah expired
        if ($payment && $payment->status === 'pending' && $payment->expired_at && Carbon::parse($payment->expired_at)->isPast()) {
            $payment->status = 'expired';
            $payment->save();
        }

        // Flag untuk UI
        $canContinue = $payment
            && $payment->status === 'pending'
            && $payment->payment_url
            && $payment->expired_at
            && Carbon::parse($payment->expired_at)->isFuture();

        $canCreateNew = !$payment || in_array($payment->status, ['expired', 'failed'], true);

        return Inertia::render('CompanyProfiles/Payment', [
            'profile' => $profile ? [
                'company_name' => $profile->company_name,
                'is_approved'  => (bool) $profile->is_approved,
            ] : null,
            'payment' => $payment ? [
                'status'       => $payment->status,
                'payment_url'  => $payment->payment_url,
                'external_id'  => $payment->external_id,
                'va_number'    => $payment->va_number,
                'expired_at'   => $payment->expired_at ? Carbon::parse($payment->expired_at)->toDateTimeString() : null,
            ] : null,
            'flags' => [
                'canContinue'  => $canContinue,
                'canCreateNew' => $canCreateNew,
            ],
            'message' => session('warning') ?: session('success') ?: session('info'),
        ]);
    }

    /**
     * Buat/ulang pembayaran:
     * - Jika masih ada pending & belum expired -> jangan buat baru (minta user klik "Lanjutkan Pembayaran").
     * - Jika tidak ada atau expired/failed -> panggil API create VA dan simpan.
     * - Kembali ke halaman /company/payment (tanpa auto-redirect ke payment_url).
     */
    public function startPayment(Request $request)
    {
        $user = Auth::user();

        // Cek payment aktif yang masih valid
        $active = CompanyPayment::where('user_id', $user->id)
            ->where('status', 'pending')
            ->orderByDesc('id')
            ->first();

        if ($active && $active->payment_url && $active->expired_at && Carbon::parse($active->expired_at)->isFuture()) {
            return redirect()->route('company.payment')
                ->with('info', 'Masih ada tagihan yang belum dibayar. Silakan lanjutkan pembayaran.');
        }

        // Siapkan record baru (atau reuse pending yang sudah expired)
        $payment = CompanyPayment::firstOrNew([
            'user_id' => $user->id,
            'status'  => 'pending',
        ]);

        if (empty($payment->external_id)) {
            $payment->external_id = 'INV-' . now()->format('YmdHis') . '-' . Str::upper(Str::random(6));
        }

        $expiredAt = now()->addDay(); // fallback jika API tidak memberi expired_at

        // Konfigurasi endpoint & API key
        $baseUrl = rtrim(config('services.payment.base_url', env('PAYMENT_BASE_URL', '')), '/');
        $apiKey  = config('services.payment.key', env('PAYMENT_API_KEY', ''));

        if (empty($baseUrl) || empty($apiKey)) {
            return back()->with('warning', 'Konfigurasi payment belum tersedia. Set PAYMENT_BASE_URL dan PAYMENT_API_KEY.');
        }

        try {
            // CONTOH payload — sesuaikan dengan dokumentasi PDF yang kamu miliki
            $payload = [
                'external_id'     => $payment->external_id,           // tetap statis
                'amount'          => 150000,                  // nominal tetap
                'customer_name'   => $user->name,              // statis
                'customer_email'  => $user->email,      // statis
                'description'     => 'Pembayaran Perusahaan', // statis
                'expired_duration' => 24, // jam
                'metadata' => [
                    'order_id'   => 'PembayaranPerusahaan' . now()->format('YmdHis'),                  // statis
                    'product'    => 'Pembayaran Perusahaan'         // statis
                ],
            ];

            // Coba dengan trailing slash dulu
            $url = $baseUrl . '/virtual-account/create/';

            // Debug request sebelum dikirim
            // dd('URL:', $url, 'Payload:', $payload, 'API Key:', $apiKey);

            $response = Http::withHeaders([
                'X-API-Key' => $apiKey,
                'Content-Type' => 'application/json',
            ])
                ->post("https://payment-dummy.doovera.com/api/v1/virtual-account/create", $payload);

            // Debug lengkap
            // dd([
            //     'url' => $url,
            //     'status' => $response->status(),
            //     'successful' => $response->successful(),
            //     'redirect' => $response->redirect(),
            //     'location' => $response->header('Location'),
            //     'body' => $response->body(),
            //     'json' => $response->json(),
            // ]);

            // Debug response - uncomment untuk cek response
            // dd([
            //     'url' => $url,
            //     'status' => $response->status(),
            //     'successful' => $response->successful(),
            //     'headers' => $response->headers(),
            //     'body' => $response->body(),
            //     'json' => $response->json(),
            // ]);

            if (!$response->successful()) {
                // simpan status failed untuk audit ringan
                $payment->status = 'failed';
                $payment->save();

                return redirect()->route('company.payment')
                    ->with('warning', 'Gagal membuat invoice. (' . $response->status() . ')');
            }

            $json = $response->json();

            // Ambil dari `data`
            $data = $json['data'] ?? [];

            // Mapping sesuai respons
            $payment->payment_url = $data['payment_url'] ?? $payment->payment_url;
            $payment->va_number   = $data['va_number']   ?? $payment->va_number;
            $payment->external_id = $data['external_id'] ?? $payment->external_id;
            $payment->status      = $data['status']      ?? 'pending';
            $payment->expired_at  = isset($data['expired_at'])
                ? Carbon::parse($data['expired_at'])
                : $expiredAt;

            // Jika API langsung balas "paid" (jarang), masuk ke dashboard
            if ($payment->status === 'paid') {
                $payment->save();
                return redirect()->route('company.dashboard')->with('success', 'Pembayaran berhasil. Selamat datang di dashboard!');
            }

            $payment->save();

            return redirect()->route('company.payment')
                ->with('success', 'Invoice berhasil dibuat. Silakan lanjutkan pembayaran.');
        } catch (\Throwable $e) {
            // tandai failed untuk audit
            $payment->status = 'failed';
            $payment->save();

            report($e);

            dd($e->getMessage());

            return redirect()->route('company.payment')
                ->with('warning', 'Terjadi kesalahan saat menghubungi layanan pembayaran.');
        }
    }

    /**
     * Lanjutkan ke payment_url untuk tagihan pending yang masih valid.
     * Tidak membuat payment baru; tidak auto-redirect tanpa klik.
     */
    public function continueExisting(Request $request)
    {
        $user = Auth::user();

        $payment = CompanyPayment::where('user_id', $user->id)
            ->where('status', 'pending')
            ->orderByDesc('id')
            ->first();

        if (!$payment) {
            return redirect()->route('company.payment')
                ->with('error', 'Tagihan tidak ditemukan.');
        }

        // Cek kadaluarsa
        if ($payment->expired_at && Carbon::parse($payment->expired_at)->isPast()) {
            $payment->status = 'expired';
            $payment->save();

            return redirect()->route('company.payment')
                ->with('warning', 'Tagihan sudah kadaluarsa. Silakan buat pembayaran baru.');
        }

        if (!$payment->payment_url) {
            return redirect()->route('company.payment')
                ->with('error', 'Link pembayaran tidak tersedia. Silakan buat ulang pembayaran.');
        }

        return redirect()->away($payment->payment_url);
    }
}
