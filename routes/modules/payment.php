<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Shared\PaymentWebhookController;

/*
================
PAYMENT ROUTES
================
Routes untuk payment gateway webhook
*/

Route::post('/payment/webhook', [PaymentWebhookController::class, 'handle'])
    ->name('payment.webhook');
