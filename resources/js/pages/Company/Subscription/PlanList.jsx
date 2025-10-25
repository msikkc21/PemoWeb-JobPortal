import { Head, useForm, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useState } from 'react';
import PrimaryButton from '@/Components/PrimaryButton';

export default function PlanList({ auth, plans }) {
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const { post, processing } = useForm();

    const handleChoosePlan = (plan) => {
        setSelectedPlan(plan);
        setShowModal(true);
    };

    const handleConfirm = () => {
        if (selectedPlan) {
            post(route('company.subscription.activate', { plan_id: selectedPlan.id }), {
                onSuccess: () => {
                    setShowModal(false);
                },
            });
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <AuthenticatedLayout>
            <Head title="Pilih Paket Langganan" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex justify-between items-center">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">
                                    Pilih Paket Langganan
                                </h1>
                                <p className="mt-2 text-gray-600">
                                    Tingkatkan bisnis Anda dengan memilih paket yang sesuai
                                </p>
                            </div>
                            <Link
                                href={route('company.subscription.index')}
                                className="text-indigo-600 hover:text-indigo-900"
                            >
                                ← Kembali ke Status Paket
                            </Link>
                        </div>
                    </div>

                    {/* Plans Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {plans && plans.length > 0 ? (
                            plans.map((plan) => (
                                <div
                                    key={plan.id}
                                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
                                >
                                    <div className="p-6">
                                        {/* Plan Header */}
                                        <div className="text-center mb-6">
                                            <h3 className="text-2xl font-bold text-gray-900">
                                                {plan.name}
                                            </h3>
                                            <div className="mt-4">
                                                <span className="text-4xl font-bold text-indigo-600">
                                                    {formatCurrency(plan.price_amount)}
                                                </span>
                                                <span className="text-gray-600 ml-2">
                                                    / {plan.duration_in_days} hari
                                                </span>
                                            </div>
                                        </div>

                                        {/* Plan Description */}
                                        <div className="mb-6">
                                            <p className="text-gray-600 text-center">
                                                {plan.description || 'Paket langganan premium'}
                                            </p>
                                        </div>

                                        {/* Plan Features */}
                                        <div className="mb-6 space-y-3">
                                            <div className="flex items-center text-gray-700">
                                                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span>Posting lowongan unlimited</span>
                                            </div>
                                            <div className="flex items-center text-gray-700">
                                                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span>Kelola pelamar</span>
                                            </div>
                                            <div className="flex items-center text-gray-700">
                                                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span>Akses fitur premium</span>
                                            </div>
                                            <div className="flex items-center text-gray-700">
                                                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span>Durasi {plan.duration_in_days} hari</span>
                                            </div>
                                        </div>

                                        {/* Choose Button */}
                                        <button
                                            onClick={() => handleChoosePlan(plan)}
                                            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
                                        >
                                            Pilih Paket Ini
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-12">
                                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                </svg>
                                <p className="mt-4 text-gray-500">Tidak ada paket tersedia saat ini</p>
                            </div>
                        )}
                    </div>

                    {/* Info Box */}
                    <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
                        <div className="flex">
                            <svg className="h-6 w-6 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div>
                                <h3 className="text-lg font-semibold text-blue-900 mb-2">
                                    Informasi Penting
                                </h3>
                                <ul className="text-blue-800 space-y-1 text-sm">
                                    <li>• Paket akan aktif setelah pembayaran dikonfirmasi</li>
                                    <li>• Anda tidak dapat memilih paket baru jika masih memiliki paket aktif atau pending</li>
                                    <li>• Pembayaran dapat dilakukan melalui transfer bank</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Confirmation Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100">
                                <svg className="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div className="mt-4 text-center">
                                <h3 className="text-lg leading-6 font-medium text-gray-900">
                                    Konfirmasi Pilihan Paket
                                </h3>
                                <div className="mt-4 px-7 py-3">
                                    <p className="text-sm text-gray-500">
                                        Anda akan memilih paket <strong>{selectedPlan?.name}</strong> dengan harga{' '}
                                        <strong>{formatCurrency(selectedPlan?.price_amount)}</strong> untuk{' '}
                                        <strong>{selectedPlan?.duration_in_days} hari</strong>.
                                    </p>
                                    <p className="text-sm text-gray-500 mt-2">
                                        Lanjutkan ke pembayaran?
                                    </p>
                                </div>
                                <div className="items-center gap-2 mt-5 flex justify-center">
                                    <button
                                        onClick={() => setShowModal(false)}
                                        disabled={processing}
                                        className="px-4 py-2 bg-gray-300 text-gray-800 text-base font-medium rounded-md shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        onClick={handleConfirm}
                                        disabled={processing}
                                        className="px-4 py-2 bg-indigo-600 text-white text-base font-medium rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    >
                                        {processing ? 'Memproses...' : 'Ya, Lanjutkan'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
