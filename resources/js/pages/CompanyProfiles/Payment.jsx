import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

export default function Payment({ auth, payment, flags, message, profile }) {
    const createForm = useForm({});
    const continueForm = useForm({});

    const handleCreatePayment = (e) => {
        e.preventDefault();
        createForm.post(route('company.payment.start'), {
            preserveScroll: true,
        });
    };

    const handleContinuePayment = (e) => {
        e.preventDefault();
        continueForm.post(route('company.payment.continue'), {
            preserveScroll: true,
        });
    };

    const getStatusBadge = (status) => {
        const badges = {
            pending: 'bg-yellow-100 text-yellow-800',
            paid: 'bg-green-100 text-green-800',
            expired: 'bg-gray-200 text-gray-700',
            failed: 'bg-red-200 text-red-700',
        };
        
        const labels = {
            pending: 'Menunggu Pembayaran',
            paid: 'Sudah Dibayar',
            expired: 'Kadaluarsa',
            failed: 'Gagal',
        };

        return (
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${badges[status] || 'bg-gray-100 text-gray-800'}`}>
                {labels[status] || status}
            </span>
        );
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleString('id-ID', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Pembayaran Perusahaan
                </h2>
            }
        >
            <Head title="Pembayaran Perusahaan" />

            <div className="py-6">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white shadow-sm sm:rounded-lg p-6">
                        
                        {/* Alert Message */}
                        {message && (
                            <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-400 text-blue-700">
                                <p className="text-sm">{message}</p>
                            </div>
                        )}

                        {/* Company Info */}
                        {profile && (
                            <div className="mb-6 pb-6 border-b border-gray-200">
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    Informasi Perusahaan
                                </h3>
                                <p className="text-gray-700">
                                    <span className="font-semibold">Nama Perusahaan:</span> {profile.company_name}
                                </p>
                                <p className="text-gray-700 mt-1">
                                    <span className="font-semibold">Status Persetujuan:</span>{' '}
                                    {profile.is_approved ? (
                                        <span className="text-green-600 font-medium">Disetujui</span>
                                    ) : (
                                        <span className="text-yellow-600 font-medium">Menunggu Persetujuan</span>
                                    )}
                                </p>
                            </div>
                        )}

                        {/* Payment Status Section */}
                        <div className="space-y-6">
                            <h3 className="text-lg font-medium text-gray-900">
                                Status Pembayaran
                            </h3>

                            {/* Case 1: No Payment */}
                            {payment === null && (
                                <div className="text-center py-8">
                                    <svg
                                        className="mx-auto h-12 w-12 text-gray-400"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                                        />
                                    </svg>
                                    <p className="mt-4 text-gray-600 text-lg">
                                        Belum ada tagihan pembayaran
                                    </p>
                                    <p className="mt-2 text-gray-500 text-sm">
                                        Buat pembayaran baru untuk mengaktifkan fitur premium
                                    </p>
                                    
                                    {flags?.canCreateNew && (
                                        <form onSubmit={handleCreatePayment} className="mt-6">
                                            <PrimaryButton
                                                type="submit"
                                                disabled={createForm.processing}
                                            >
                                                {createForm.processing ? 'Memproses...' : 'Buat Pembayaran'}
                                            </PrimaryButton>
                                        </form>
                                    )}
                                </div>
                            )}

                            {/* Case 2: Pending Payment */}
                            {payment && payment.status === 'pending' && flags?.canContinue && (
                                <div className="border border-yellow-200 rounded-lg p-6 bg-yellow-50">
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="text-lg font-semibold text-gray-900">
                                            Detail Pembayaran
                                        </h4>
                                        {getStatusBadge(payment.status)}
                                    </div>
                                    
                                    <div className="space-y-3 mb-6">
                                        <div className="flex justify-between py-2 border-b border-yellow-200">
                                            <span className="text-gray-600">ID Transaksi:</span>
                                            <span className="font-medium text-gray-900">{payment.external_id || '-'}</span>
                                        </div>
                                        
                                        {payment.va_number && (
                                            <div className="flex justify-between py-2 border-b border-yellow-200">
                                                <span className="text-gray-600">Nomor Virtual Account:</span>
                                                <span className="font-mono text-lg font-bold text-gray-900">
                                                    {payment.va_number}
                                                </span>
                                            </div>
                                        )}
                                        
                                        <div className="flex justify-between py-2 border-b border-yellow-200">
                                            <span className="text-gray-600">Batas Waktu:</span>
                                            <span className="font-medium text-red-600">
                                                {formatDate(payment.expired_at)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-md p-4 mb-4 border border-yellow-300">
                                        <p className="text-sm text-gray-700 mb-2">
                                            <span className="font-semibold">Cara Pembayaran:</span>
                                        </p>
                                        <ol className="list-decimal list-inside text-sm text-gray-600 space-y-1">
                                            <li>Salin nomor Virtual Account di atas</li>
                                            <li>Buka aplikasi mobile banking atau ATM</li>
                                            <li>Pilih menu transfer ke Virtual Account</li>
                                            <li>Masukkan nomor Virtual Account</li>
                                            <li>Konfirmasi dan selesaikan pembayaran</li>
                                        </ol>
                                    </div>

                                    <form onSubmit={handleContinuePayment} className="flex gap-3">
                                        <PrimaryButton
                                            type="submit"
                                            disabled={continueForm.processing}
                                        >
                                            {continueForm.processing ? 'Memproses...' : 'Cek Pembayaran'}
                                        </PrimaryButton>
                                        
                                        {payment.payment_url && (
                                            <a
                                                href={payment.payment_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-25 transition ease-in-out duration-150"
                                            >
                                                Buka Halaman Pembayaran
                                            </a>
                                        )}
                                    </form>
                                </div>
                            )}

                            {/* Case 3: Expired or Failed Payment */}
                            {payment && (payment.status === 'expired' || payment.status === 'failed') && (
                                <div className="text-center py-8 border border-gray-200 rounded-lg bg-gray-50">
                                    <div className="mb-4">
                                        {getStatusBadge(payment.status)}
                                    </div>
                                    
                                    <p className="text-gray-700 text-lg mb-2">
                                        Pembayaran {payment.status === 'expired' ? 'Kadaluarsa' : 'Gagal'}
                                    </p>
                                    
                                    <div className="text-sm text-gray-600 mb-6">
                                        <p>ID Transaksi: {payment.external_id || '-'}</p>
                                        {payment.expired_at && (
                                            <p className="mt-1">Kadaluarsa pada: {formatDate(payment.expired_at)}</p>
                                        )}
                                    </div>

                                    {flags?.canCreateNew && (
                                        <form onSubmit={handleCreatePayment}>
                                            <PrimaryButton
                                                type="submit"
                                                disabled={createForm.processing}
                                            >
                                                {createForm.processing ? 'Memproses...' : 'Buat Pembayaran Baru'}
                                            </PrimaryButton>
                                        </form>
                                    )}
                                </div>
                            )}

                            {/* Case 4: Paid Payment */}
                            {payment && payment.status === 'paid' && (
                                <div className="text-center py-8 border border-green-200 rounded-lg bg-green-50">
                                    <svg
                                        className="mx-auto h-16 w-16 text-green-500 mb-4"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                    
                                    <div className="mb-4">
                                        {getStatusBadge(payment.status)}
                                    </div>
                                    
                                    <p className="text-gray-900 text-xl font-semibold mb-2">
                                        Pembayaran Berhasil!
                                    </p>
                                    
                                    <p className="text-gray-600 mb-6">
                                        Terima kasih telah melakukan pembayaran. Akun Anda sudah aktif.
                                    </p>

                                    <div className="text-sm text-gray-600 mb-6 bg-white rounded-md p-4 border border-green-200">
                                        <p>ID Transaksi: {payment.external_id || '-'}</p>
                                        {payment.expired_at && (
                                            <p className="mt-1">Dibayar sebelum: {formatDate(payment.expired_at)}</p>
                                        )}
                                    </div>

                                    <a href={route('company.dashboard')}>
                                        <PrimaryButton>
                                            Kembali ke Dashboard
                                        </PrimaryButton>
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
