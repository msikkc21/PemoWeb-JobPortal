import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Success({ payment }) {
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

    return (
        <AuthenticatedLayout>
            <Head title="Pembayaran Berhasil" />

            <div className="py-12">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        {/* Success Icon & Message */}
                        <div className="flex flex-col items-center justify-center p-12 text-center">
                            <div className="mb-6 relative">
                                <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-75"></div>
                                <svg 
                                    className="relative h-24 w-24 text-green-500" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                >
                                    <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        strokeWidth="2" 
                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                                    />
                                </svg>
                            </div>

                            <h1 className="text-3xl font-bold text-green-700 mb-4">
                                🎉 Pembayaran Berhasil!
                            </h1>
                            
                            <p className="text-gray-600 mb-8 max-w-md">
                                Terima kasih! Pembayaran Anda telah dikonfirmasi dan paket langganan Anda sudah aktif.
                            </p>

                            {/* Payment Details */}
                            <div className="w-full bg-gray-50 rounded-lg p-6 mb-8">
                                <div className="grid grid-cols-2 gap-4 text-left">
                                    <div>
                                        <p className="text-sm text-gray-500">ID Pembayaran</p>
                                        <p className="font-semibold text-gray-900">{payment?.external_id}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Jumlah</p>
                                        <p className="font-semibold text-gray-900">
                                            {formatCurrency(payment?.amount || 0)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Metode</p>
                                        <p className="font-semibold text-gray-900 capitalize">
                                            {payment?.payment_method?.replace('_', ' ') || 'Bank Transfer'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Tanggal</p>
                                        <p className="font-semibold text-gray-900">
                                            {formatDate(payment?.paid_at || payment?.created_at)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-4">
                                <Link
                                    href={route('company.dashboard')}
                                    className="inline-flex items-center px-6 py-3 bg-indigo-600 border border-transparent rounded-md font-semibold text-sm text-white uppercase tracking-widest hover:bg-indigo-700 focus:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                >
                                    <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                    </svg>
                                    Ke Dashboard
                                </Link>

                                <Link
                                    href={route('company.subscription.index')}
                                    className="inline-flex items-center px-6 py-3 bg-white border border-gray-300 rounded-md font-semibold text-sm text-gray-700 uppercase tracking-widest hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                >
                                    <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    Lihat Riwayat
                                </Link>
                            </div>

                            {/* Next Steps */}
                            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg text-left w-full">
                                <h3 className="font-semibold text-blue-900 mb-2">Langkah Selanjutnya:</h3>
                                <ul className="text-sm text-blue-800 space-y-1">
                                    <li className="flex items-start">
                                        <svg className="h-5 w-5 mr-2 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                        </svg>
                                        Mulai posting lowongan kerja Anda
                                    </li>
                                    <li className="flex items-start">
                                        <svg className="h-5 w-5 mr-2 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                        </svg>
                                        Kelola profil perusahaan untuk menarik kandidat terbaik
                                    </li>
                                    <li className="flex items-start">
                                        <svg className="h-5 w-5 mr-2 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                        </svg>
                                        Tinjau dan kelola lamaran yang masuk
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Footer Note */}
                    <div className="mt-6 text-center text-sm text-gray-600">
                        <p>Email konfirmasi telah dikirim ke alamat email Anda.</p>
                        <p className="mt-1">Jika ada pertanyaan, hubungi support@jobportal.com</p>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
