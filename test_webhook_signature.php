<?php

/**
 * Test Script untuk Menghitung HMAC Signature Webhook
 * 
 * Gunakan script ini untuk memverifikasi signature computation
 * sebelum mengirim webhook dari gateway.
 */

// Webhook secret dari .env
$secret = 'YSH4zDP8xBs0FicLRNVGDYkcmHggEjj7';

// Contoh payload dari gateway
$payloads = [
    'payment.success' => [
        'event' => 'payment.success',
        'timestamp' => '2025-11-03T10:00:00Z',
        'data' => [
            'external_id' => 'PAY-TEST-123456',
            'amount' => 100000,
            'currency' => 'IDR',
            'status' => 'paid',
            'paid_at' => '2025-11-03T10:00:00Z',
        ]
    ],
    'payment.expired' => [
        'event' => 'payment.expired',
        'timestamp' => '2025-11-03T12:00:00Z',
        'data' => [
            'external_id' => 'PAY-TEST-123456',
            'status' => 'expired',
        ]
    ],
    'payment.cancelled' => [
        'event' => 'payment.cancelled',
        'timestamp' => '2025-11-03T14:00:00Z',
        'data' => [
            'external_id' => 'PAY-TEST-123456',
            'status' => 'cancelled',
        ]
    ],
];

echo "===========================================\n";
echo "WEBHOOK SIGNATURE COMPUTATION TEST\n";
echo "===========================================\n\n";

foreach ($payloads as $eventName => $payload) {
    // Convert to JSON (TANPA space atau pretty print)
    $jsonPayload = json_encode($payload, JSON_UNESCAPED_SLASHES);
    
    // Compute HMAC SHA256
    $signature = hash_hmac('sha256', $jsonPayload, $secret);
    
    echo "Event: {$eventName}\n";
    echo "-------------------------------------------\n";
    echo "Payload:\n{$jsonPayload}\n\n";
    echo "Signature: {$signature}\n";
    echo "\n";
    
    // Generate curl command
    $curlCommand = sprintf(
        'curl -X POST http://localhost/payment/webhook \\' . "\n" .
        '  -H "Content-Type: application/json" \\' . "\n" .
        '  -H "X-Webhook-Signature: %s" \\' . "\n" .
        '  -d \'%s\'',
        $signature,
        $jsonPayload
    );
    
    echo "cURL Command:\n{$curlCommand}\n";
    echo "\n===========================================\n\n";
}

// Test dengan payload custom
echo "CUSTOM PAYLOAD TEST\n";
echo "===========================================\n";
$customPayload = readline("Enter custom JSON payload (or press Enter to skip): ");

if (!empty($customPayload)) {
    $signature = hash_hmac('sha256', $customPayload, $secret);
    echo "\nComputed Signature: {$signature}\n";
    echo "\ncURL Command:\n";
    echo sprintf(
        'curl -X POST http://localhost/payment/webhook \\' . "\n" .
        '  -H "Content-Type: application/json" \\' . "\n" .
        '  -H "X-Webhook-Signature: %s" \\' . "\n" .
        '  -d \'%s\'',
        $signature,
        $customPayload
    );
    echo "\n\n";
}

echo "===========================================\n";
echo "NOTES:\n";
echo "- Signature dihitung dari JSON mentah (raw)\n";
echo "- Tidak boleh ada space atau pretty print\n";
echo "- Secret harus identik dengan .env\n";
echo "- Header: X-Webhook-Signature\n";
echo "- Algorithm: HMAC SHA256\n";
echo "===========================================\n";
