import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function History({ auth, subscription, plan, paymentHistory }) {
    const { post, processing } = useForm();
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
        });
    };

    const getStatusBadge = (status) => {
        const badges = {
            active: 'bg-green-100 text-green-800',
            pending_payment: 'bg-yellow-100 text-yellow-800',
            expired: 'bg-red-100 text-red-800',
            cancelled: 'bg-gray-100 text-gray-800',
        };
        
        const labels = {
            active: 'Aktif',
            pending_payment: 'Menunggu Pembayaran',
            expired: 'Kadaluarsa',
            cancelled: 'Dibatalkan',
        };

        return (
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${badges[status] || 'bg-gray-100 text-gray-800'}`}>
                {labels[status] || status}
            </span>
        );
    };

    const getPaymentStatusBadge = (status) => {
        const badges = {
            pending: 'bg-yellow-100 text-yellow-800',
            paid: 'bg-green-100 text-green-800',
            failed: 'bg-red-100 text-red-800',
        };
        
        const labels = {
            pending: 'Pending',
            paid: 'Lunas',
            failed: 'Gagal',
        };

        return (
            <span className={`px-2 py-1 rounded text-xs font-semibold ${badges[status] || 'bg-gray-100 text-gray-800'}`}>
                {labels[status] || status}
            </span>
        );
    };

    return (
        <AuthenticatedLayout>
            <Head title="Status Paket Langganan" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">
                            Status Paket Langganan
                        </h1>
                        <p className="mt-2 text-gray-600">
                            Kelola langganan dan riwayat pembayaran Anda
                        </p>
                    </div>

                    {/* Current Subscription Card */}
                    {subscription ? (
                        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
                            <div className="p-6 bg-gradient-to-r from-indigo-500 to-purple-600">
                                <div className="flex justify-between items-start">
                                    <div className="text-white">
                                        <h2 className="text-2xl font-bold">{plan?.name || 'Paket Langganan'}</h2>
                                        <p className="text-indigo-100 mt-1">
                                            {plan?.description || 'Paket langganan Anda'}
                                        </p>
                                    </div>
                                    <div>
                                        {getStatusBadge(subscription.status)}
                                    </div>
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                                    {/* Price */}
                                    <div>
                                        <p className="text-sm text-gray-500">Harga Paket</p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {formatCurrency(plan?.price_amount || 0)}
                                        </p>
                                    </div>

                                    {/* Duration */}
                                    <div>
                                        <p className="text-sm text-gray-500">Durasi</p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {plan?.duration_in_days || 0} Hari
                                        </p>
                                    </div>

                                    {/* Start Date */}
                                    <div>
                                        <p className="text-sm text-gray-500">Tanggal Mulai</p>
                                        <p className="text-lg font-semibold text-gray-900">
                                            {subscription.starts_at ? formatDate(subscription.starts_at) : '-'}
                                        </p>
                                    </div>

                                    {/* End Date */}
                                    <div>
                                        <p className="text-sm text-gray-500">Tanggal Berakhir</p>
                                        <p className="text-lg font-semibold text-gray-900">
                                            {subscription.ends_at ? formatDate(subscription.ends_at) : '-'}
                                        </p>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-4 pt-4 border-t">
                                    {subscription.status === 'pending_payment' && (
                                        <>
                                            <Link
                                                href={route('company.subscription.invoice', subscription.id)}
                                                className="inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-700 focus:bg-green-700 active:bg-green-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                            >
                                                <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                                </svg>
                                                Lanjut Pembayaran
                                            </Link>
                                            <Link
                                                href={route('company.subscription.invoice', subscription.id)}
                                                className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 focus:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                            >
                                                <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                                Lihat Invoice
                                            </Link>
                                        </>
                                    )}

                                    {subscription.status === 'expired' && (
                                        <Link
                                            href={route('company.subscription.choose')}
                                            className="inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-700 focus:bg-green-700 active:bg-green-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                        >
                                            <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                            </svg>
                                            Pilih Paket Baru
                                        </Link>
                                    )}

                                    {subscription.status === 'active' && (
                                        <div className="flex items-center text-green-600">
                                            <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span className="font-semibold">Paket Anda Aktif</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg shadow-md p-8 text-center mb-8">
                            <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                            </svg>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                Belum Ada Paket Langganan
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Anda belum memiliki paket langganan aktif. Pilih paket untuk mulai posting lowongan!
                            </p>
                            <Link
                                href={route('company.subscription.choose')}
                                className="inline-flex items-center px-6 py-3 bg-indigo-600 border border-transparent rounded-md font-semibold text-sm text-white uppercase tracking-widest hover:bg-indigo-700 focus:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                            >
                                <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Pilih Paket Langganan
                            </Link>
                        </div>
                    )}

                    {/* Payment History */}
                    {paymentHistory && paymentHistory.length > 0 && (
                        <div className="bg-white rounded-lg shadow-md overflow-hidden">
                            <div className="p-6 border-b border-gray-200">
                                <h2 className="text-xl font-bold text-gray-900">
                                    Riwayat Pembayaran
                                </h2>
                                <p className="text-sm text-gray-600 mt-1">
                                    5 Pembayaran Terakhir
                                </p>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Transaction ID
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Jumlah
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Metode
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Tanggal
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {paymentHistory.map((payment) => (
                                            <tr key={payment.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {payment.transaction_id}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {formatCurrency(payment.amount)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 capitalize">
                                                    {payment.payment_method?.replace('_', ' ')}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    {getPaymentStatusBadge(payment.status)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                    {payment.payment_date 
                                                        ? formatDate(payment.payment_date)
                                                        : formatDate(payment.created_at)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Info Box */}
                    {!subscription && (
                        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
                            <div className="flex">
                                <svg className="h-6 w-6 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div>
                                    <h3 className="text-lg font-semibold text-blue-900 mb-2">
                                        Mengapa Berlangganan?
                                    </h3>
                                    <ul className="text-blue-800 space-y-1 text-sm">
                                        <li>• Posting lowongan kerja tanpa batas</li>
                                        <li>• Kelola pelamar dengan mudah</li>
                                        <li>• Akses fitur premium lainnya</li>
                                        <li>• Tingkatkan jangkauan rekrutmen Anda</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
