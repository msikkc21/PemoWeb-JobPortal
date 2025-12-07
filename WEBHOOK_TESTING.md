# 🧪 Webhook Payment Gateway - Testing Guide

## 📋 Ringkasan Perbaikan

### ✅ Perubahan yang Dilakukan:

1. **Signature Verification**
   - ✅ Menggunakan `file_get_contents('php://input')` untuk membaca body mentah
   - ✅ Signature header: `X-Webhook-Signature`
   - ✅ Hash algorithm: HMAC SHA256
   - ✅ Menggunakan `hash_equals()` untuk perbandingan aman

2. **Response Handling**
   - ✅ Semua response **selalu 200 OK**
   - ✅ Tidak ada `abort(400)` atau response error
   - ✅ Invalid signature → log warning + return 200
   - ✅ Exception → log error + return 200

3. **Database Transaction**
   - ✅ Semua update menggunakan `DB::transaction()`
   - ✅ Update `SubscriptionPayment` dan `Subscription` dalam satu transaksi
   - ✅ Rollback otomatis jika ada error

4. **Event Handling**
   - ✅ `payment.success` → set status `paid`, `paid_at`, dan aktivasi subscription (`starts_at`, `ends_at`, `renews_at`)
   - ✅ `payment.expired` → set status `expired` di payment dan subscription
   - ✅ `payment.cancelled` → set status `failed` di payment

5. **Logging**
   - ✅ Tag: `[payment.webhook]` untuk filter mudah
   - ✅ Log level: `info` (success), `warning` (invalid), `error` (exception)
   - ✅ Log signature match untuk debugging
   - ✅ Log external_id, event, dan payment_id

---

## 🧪 Testing Checklist

### Test Case 1: Payment Success ✅

**Request:**
```bash
curl -X POST http://localhost/payment/webhook \
  -H "Content-Type: application/json" \
  -H "X-Webhook-Signature: <computed_hmac>" \
  -d '{
    "event": "payment.success",
    "timestamp": "2025-11-03T10:00:00Z",
    "data": {
      "external_id": "PAY-123456",
      "amount": 100000,
      "currency": "IDR",
      "status": "paid",
      "paid_at": "2025-11-03T10:00:00Z"
    }
  }'
```

**Expected Response:**
```json
{
  "message": "Webhook processed"
}
```
**Status Code:** `200 OK`

**Expected Database Changes:**
- `subscription_payments.status` → `paid`
- `subscription_payments.paid_at` → current timestamp
- `subscriptions.status` → `active`
- `subscriptions.starts_at` → current timestamp
- `subscriptions.ends_at` → current + plan duration
- `subscriptions.renews_at` → ends_at - 7 days

**Expected Log:**
```
[payment.webhook] Payment successful
```

---

### Test Case 2: Payment Expired ✅

**Request:**
```bash
curl -X POST http://localhost/payment/webhook \
  -H "Content-Type: application/json" \
  -H "X-Webhook-Signature: <computed_hmac>" \
  -d '{
    "event": "payment.expired",
    "timestamp": "2025-11-03T12:00:00Z",
    "data": {
      "external_id": "PAY-123456",
      "status": "expired"
    }
  }'
```

**Expected Response:**
```json
{
  "message": "Webhook processed"
}
```
**Status Code:** `200 OK`

**Expected Database Changes:**
- `subscription_payments.status` → `expired`
- `subscriptions.status` → `expired`

**Expected Log:**
```
[payment.webhook] Payment expired
```

---

### Test Case 3: Payment Cancelled ✅

**Request:**
```bash
curl -X POST http://localhost/payment/webhook \
  -H "Content-Type: application/json" \
  -H "X-Webhook-Signature: <computed_hmac>" \
  -d '{
    "event": "payment.cancelled",
    "timestamp": "2025-11-03T14:00:00Z",
    "data": {
      "external_id": "PAY-123456",
      "status": "cancelled"
    }
  }'
```

**Expected Response:**
```json
{
  "message": "Webhook processed"
}
```
**Status Code:** `200 OK`

**Expected Database Changes:**
- `subscription_payments.status` → `failed`
- `subscriptions` → tidak berubah

**Expected Log:**
```
[payment.webhook] Payment cancelled
```

---

### Test Case 4: Invalid Signature ⚠️

**Request:**
```bash
curl -X POST http://localhost/payment/webhook \
  -H "Content-Type: application/json" \
  -H "X-Webhook-Signature: invalid_signature_here" \
  -d '{
    "event": "payment.success",
    "timestamp": "2025-11-03T10:00:00Z",
    "data": {
      "external_id": "PAY-123456"
    }
  }'
```

**Expected Response:**
```json
{
  "message": "Invalid Signature Acknowledged"
}
```
**Status Code:** `200 OK` ✅

**Expected Database Changes:**
- Tidak ada perubahan

**Expected Log:**
```
[payment.webhook] Invalid webhook signature
```

---

### Test Case 5: Invalid JSON Payload ⚠️

**Request:**
```bash
curl -X POST http://localhost/payment/webhook \
  -H "Content-Type: application/json" \
  -H "X-Webhook-Signature: <computed_hmac>" \
  -d 'invalid json here'
```

**Expected Response:**
```json
{
  "message": "Invalid JSON"
}
```
**Status Code:** `200 OK` ✅

**Expected Database Changes:**
- Tidak ada perubahan

**Expected Log:**
```
[payment.webhook] Invalid JSON payload
```

---

### Test Case 6: Payment Not Found ⚠️

**Request:**
```bash
curl -X POST http://localhost/payment/webhook \
  -H "Content-Type: application/json" \
  -H "X-Webhook-Signature: <computed_hmac>" \
  -d '{
    "event": "payment.success",
    "timestamp": "2025-11-03T10:00:00Z",
    "data": {
      "external_id": "PAY-NOTEXIST"
    }
  }'
```

**Expected Response:**
```json
{
  "message": "Payment not found"
}
```
**Status Code:** `200 OK` ✅

**Expected Database Changes:**
- Tidak ada perubahan

**Expected Log:**
```
[payment.webhook] Payment not found
```

---

## 🔧 Cara Menghitung HMAC Signature

### PHP:
```php
$payload = '{"event":"payment.success","timestamp":"2025-11-03T10:00:00Z","data":{"external_id":"PAY-123456"}}';
$secret = 'YSH4zDP8xBs0FicLRNVGDYkcmHggEjj7';
$signature = hash_hmac('sha256', $payload, $secret);
echo $signature;
```

### JavaScript/Node.js:
```javascript
const crypto = require('crypto');
const payload = '{"event":"payment.success","timestamp":"2025-11-03T10:00:00Z","data":{"external_id":"PAY-123456"}}';
const secret = 'YSH4zDP8xBs0FicLRNVGDYkcmHggEjj7';
const signature = crypto.createHmac('sha256', secret).update(payload).digest('hex');
console.log(signature);
```

### Python:
```python
import hmac
import hashlib

payload = '{"event":"payment.success","timestamp":"2025-11-03T10:00:00Z","data":{"external_id":"PAY-123456"}}'
secret = 'YSH4zDP8xBs0FicLRNVGDYkcmHggEjj7'
signature = hmac.new(secret.encode(), payload.encode(), hashlib.sha256).hexdigest()
print(signature)
```

---

## 📊 Monitoring Log

### Melihat Log Webhook:
```bash
# Windows (PowerShell)
Get-Content storage\logs\laravel.log -Tail 50 | Select-String "payment.webhook"

# Linux/Mac
tail -f storage/logs/laravel.log | grep "payment.webhook"
```

### Filter Log Level:
```bash
# Warning only
grep "\[payment.webhook\].*WARNING" storage/logs/laravel.log

# Error only
grep "\[payment.webhook\].*ERROR" storage/logs/laravel.log

# Info only
grep "\[payment.webhook\].*INFO" storage/logs/laravel.log
```

---

## 🔍 Debugging Tips

### 1. Verifikasi Secret Key
Pastikan secret di `.env` sama dengan dashboard gateway:
```bash
# .env
PAYMENT_WEBHOOK_SECRET="YSH4zDP8xBs0FicLRNVGDYkcmHggEjj7"
```

### 2. Test Signature Locally
```php
// routes/web.php (temporary test route)
Route::get('/test-signature', function () {
    $payload = '{"event":"payment.success","data":{"external_id":"TEST"}}';
    $secret = config('services.payment.webhook_secret');
    $signature = hash_hmac('sha256', $payload, $secret);
    
    return response()->json([
        'payload' => $payload,
        'secret' => $secret,
        'signature' => $signature,
    ]);
});
```

### 3. Check Database State
```sql
-- Lihat semua payment yang pending
SELECT * FROM subscription_payments WHERE status = 'pending';

-- Lihat subscription yang belum aktif
SELECT * FROM subscriptions WHERE status != 'active';

-- Lihat payment dengan external_id tertentu
SELECT * FROM subscription_payments WHERE external_id = 'PAY-123456';
```

---

## ✅ Acceptance Criteria

- [x] Webhook tidak lagi mengembalikan HTTP 400
- [x] Signature verification menggunakan HMAC SHA256
- [x] Semua response webhook adalah 200 OK
- [x] Database transaction untuk konsistensi data
- [x] `payment.success` mengaktifkan subscription dengan durasi yang benar
- [x] `payment.expired` mengubah status menjadi expired
- [x] `payment.cancelled` mengubah status payment menjadi failed
- [x] Logging lengkap dengan tag `[payment.webhook]`
- [x] Error handling yang robust (try-catch)
- [x] Invalid signature tidak menyebabkan retry

---

## 🚀 Deployment Checklist

- [ ] Verifikasi `PAYMENT_WEBHOOK_SECRET` di production `.env`
- [ ] Test webhook dari dashboard gateway (sandbox mode)
- [ ] Monitor log untuk signature mismatch
- [ ] Verifikasi database update setelah payment success
- [ ] Setup alert untuk webhook error (optional)
- [ ] Dokumentasi webhook URL untuk tim gateway

---

## 📞 Support

Jika ada masalah:
1. Cek log di `storage/logs/laravel.log`
2. Filter dengan tag `[payment.webhook]`
3. Verifikasi signature computation
4. Pastikan database tidak error (check migrations)

---

**Last Updated:** November 3, 2025  
**Version:** 1.0  
**Status:** ✅ Production Ready
