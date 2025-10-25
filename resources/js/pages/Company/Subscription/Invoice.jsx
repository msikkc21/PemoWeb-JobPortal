import { Head, Link, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useEffect } from 'react';

export default function Invoice({ auth, subscription, payment }) {
    const { data, setData, post, processing } = useForm({ 
        external_id: payment?.external_id || ''
    });

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    // Tahap 1: Checkout - Create payment and get payment_url
    const handleCheckout = () => {
        if (!payment?.external_id) {
            alert('External ID tidak ditemukan');
            return;
        }

        post(route('company.subscription.payment.create'), {
            preserveScroll: true,
            onSuccess: () => {
                console.log('Checkout successful, page will reload');
            },
            onError: (errors) => {
                console.error('Checkout error:', errors);
                alert('Gagal membuat checkout. Silakan coba lagi.');
            },
        });
    };

    // Tahap 2: Bayar Sekarang - Open payment gateway in new tab
    const handleOpenPayment = () => {
        if (!payment?.payment_url) {
            alert('URL pembayaran tidak tersedia');
            return;
        }

        // Open payment gateway in new tab
        window.open(payment.payment_url, '_blank', 'noopener,noreferrer');
    };

    // Tahap 3: Cek Pembayaran - Check payment status
    const handleCheckPayment = () => {
        if (!payment?.external_id) {
            alert('External ID tidak ditemukan');
            return;
        }

        router.visit(route('company.subscription.payment.check', payment.external_id), {
            preserveScroll: true,
            onStart: () => {
                console.log('Checking payment status...');
            },
            onError: (errors) => {
                console.error('Payment check error:', errors);
            },
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Invoice Pembayaran" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex justify-between items-center">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">
                                    Invoice Pembayaran
                                </h1>
                                <p className="mt-2 text-gray-600">
                                    #{payment?.external_id || 'N/A'}
                                </p>
                            </div>
                            <Link
                                href={route('company.subscription.index')}
                                className="text-indigo-600 hover:text-indigo-900"
                            >
                                ← Kembali ke Riwayat
                            </Link>
                        </div>
                    </div>

                    {/* Status Alert */}
                    {payment?.status === 'pending' && (
                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-yellow-400 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-yellow-700">
                                        <strong>Menunggu Pembayaran</strong> - Silakan lakukan pembayaran untuk mengaktifkan paket langganan Anda.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {payment?.status === 'paid' && (
                        <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-green-700">
                                        <strong>Pembayaran Berhasil!</strong> Paket langganan Anda sudah aktif.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Invoice Card */}
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        {/* Header Section */}
                        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-2xl font-bold">INVOICE</h2>
                                    <p className="text-indigo-100 mt-1">Job Portal Premium</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-indigo-100">Tanggal</p>
                                    <p className="font-semibold">{formatDate(subscription?.created_at)}</p>
                                </div>
                            </div>
                        </div>

                        {/* Company Info */}
                        <div className="p-8 border-b">
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-500 uppercase">Dari:</h3>
                                    <p className="mt-2 text-gray-900 font-semibold">Job Portal Platform</p>
                                    <p className="text-gray-600 text-sm">Jakarta, Indonesia</p>
                                    <p className="text-gray-600 text-sm">support@jobportal.com</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-500 uppercase">Kepada:</h3>
                                    <p className="mt-2 text-gray-900 font-semibold">{subscription?.company?.company_name}</p>
                                    <p className="text-gray-600 text-sm">{subscription?.company?.company_email}</p>
                                    <p className="text-gray-600 text-sm">{subscription?.company?.phone}</p>
                                </div>
                            </div>
                        </div>

                        {/* Package Details */}
                        <div className="p-8 border-b">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Detail Paket</h3>
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left py-3 text-sm font-semibold text-gray-700">Deskripsi</th>
                                        <th className="text-center py-3 text-sm font-semibold text-gray-700">Durasi</th>
                                        <th className="text-right py-3 text-sm font-semibold text-gray-700">Harga</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="py-4">
                                            <p className="font-semibold text-gray-900">{subscription?.plan?.name}</p>
                                            <p className="text-sm text-gray-600">{subscription?.plan?.description}</p>
                                        </td>
                                        <td className="py-4 text-center text-gray-900">
                                            {subscription?.plan?.duration_in_days} Hari
                                        </td>
                                        <td className="py-4 text-right font-semibold text-gray-900">
                                            {formatCurrency(payment?.amount || 0)}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* Total */}
                        <div className="p-8 bg-gray-50">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-gray-600">Subtotal</span>
                                <span className="text-gray-900">{formatCurrency(payment?.amount || 0)}</span>
                            </div>
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-gray-600">Pajak (0%)</span>
                                <span className="text-gray-900">{formatCurrency(0)}</span>
                            </div>
                            <div className="border-t pt-4 flex justify-between items-center">
                                <span className="text-xl font-bold text-gray-900">Total</span>
                                <span className="text-2xl font-bold text-indigo-600">
                                    {formatCurrency(payment?.amount || 0)}
                                </span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="p-8 bg-gray-50 flex justify-between items-center">
                            <Link
                                href={route('company.subscription.index')}
                                className="text-gray-600 hover:text-gray-900"
                            >
                                ← Lihat Riwayat
                            </Link>
                            
                            <div className="flex gap-3">
                                {/* Tahap 1: Checkout - Only show if payment_url doesn't exist yet */}
                                {payment?.status === 'pending' && !payment?.payment_url && (
                                    <button
                                        onClick={handleCheckout}
                                        disabled={processing}
                                        className="inline-flex items-center px-6 py-3 bg-yellow-500 border border-transparent rounded-md font-semibold text-sm text-white uppercase tracking-widest hover:bg-yellow-600 focus:bg-yellow-600 active:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 transition ease-in-out duration-150 disabled:opacity-50"
                                    >
                                        <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                        {processing ? 'Memproses...' : 'Checkout'}
                                    </button>
                                )}

                                {/* Tahap 2: Bayar Sekarang - Show if payment_url exists and status is pending */}
                                {payment?.status === 'pending' && payment?.payment_url && (
                                    <button
                                        onClick={handleOpenPayment}
                                        className="inline-flex items-center px-6 py-3 bg-green-600 border border-transparent rounded-md font-semibold text-sm text-white uppercase tracking-widest hover:bg-green-700 focus:bg-green-700 active:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                    >
                                        <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                        Bayar Sekarang
                                    </button>
                                )}

                                {/* Tahap 3: Cek Pembayaran - Always show if payment_url exists */}
                                {payment?.payment_url && payment?.external_id && (
                                    <button
                                        onClick={handleCheckPayment}
                                        className="inline-flex items-center px-6 py-3 bg-blue-600 border border-transparent rounded-md font-semibold text-sm text-white uppercase tracking-widest hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                    >
                                        <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Cek Pembayaran
                                    </button>
                                )}

                                {/* Status Paid: Dashboard button */}
                                {payment?.status === 'paid' && (
                                    <Link
                                        href={route('company.dashboard')}
                                        className="inline-flex items-center px-6 py-3 bg-indigo-600 border border-transparent rounded-md font-semibold text-sm text-white uppercase tracking-widest hover:bg-indigo-700 focus:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                    >
                                        Kembali ke Dashboard
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Footer Note */}
                    <div className="mt-6 text-center text-sm text-gray-600">
                        <p>Jika ada pertanyaan, hubungi support@jobportal.com</p>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
