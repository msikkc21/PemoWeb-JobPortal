import { Head, Link, useForm, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useState } from 'react';

export default function Review({ job }) {
    const [showRejectModal, setShowRejectModal] = useState(false);
    const { flash } = usePage().props;

    const approveForm = useForm({});
    const rejectForm = useForm({
        rejection_reason: '',
    });

    const handleApprove = (e) => {
        e.preventDefault();
        approveForm.post(route('admin.jobs.approve', job.id));
    };

    const handleReject = (e) => {
        e.preventDefault();
        rejectForm.post(route('admin.jobs.reject', job.id), {
            onSuccess: () => setShowRejectModal(false),
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Review: ${job.title}`} />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    {/* Back Button */}
                    <div className="mb-6">
                        <Link
                            href={route('admin.jobs.pending')}
                            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
                        >
                            <svg className="h-5 w-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                            </svg>
                            Kembali ke Daftar
                        </Link>
                    </div>

                    {/* Job Detail Card */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        {/* Header */}
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center">
                                    {job.company?.photo_path ? (
                                        <img
                                            src={`/storage/${job.company.photo_path}`}
                                            alt={job.company.company_name}
                                            className="h-16 w-16 rounded-lg object-cover mr-4"
                                        />
                                    ) : (
                                        <div className="h-16 w-16 rounded-lg bg-indigo-100 flex items-center justify-center mr-4">
                                            <span className="text-indigo-600 font-bold text-xl">
                                                {job.company?.company_name?.charAt(0) || '?'}
                                            </span>
                                        </div>
                                    )}
                                    <div>
                                        <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
                                        <p className="text-lg text-indigo-600">{job.company?.company_name || 'Unknown Company'}</p>
                                        {job.location && (
                                            <p className="text-sm text-gray-500 flex items-center mt-1">
                                                <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                {job.location}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                                    Menunggu Review
                                </span>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-6">
                            {/* Description */}
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900 mb-3">Deskripsi Pekerjaan</h2>
                                <div className="prose max-w-none text-gray-600">
                                    <p className="whitespace-pre-line">{job.description || 'Tidak ada deskripsi'}</p>
                                </div>
                            </div>

                            {/* Requirements */}
                            {job.requirements && (
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900 mb-3">Persyaratan</h2>
                                    <div className="prose max-w-none text-gray-600">
                                        <p className="whitespace-pre-line">{job.requirements}</p>
                                    </div>
                                </div>
                            )}

                            {/* Skills */}
                            {job.skills && job.skills.length > 0 && (
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900 mb-3">Skills yang Dibutuhkan</h2>
                                    <div className="flex flex-wrap gap-2">
                                        {job.skills.map((skill) => (
                                            <span
                                                key={skill.id}
                                                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
                                            >
                                                {skill.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Company Info */}
                            {job.company?.description && (
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900 mb-3">Tentang Perusahaan</h2>
                                    <div className="prose max-w-none text-gray-600">
                                        <p className="whitespace-pre-line">{job.company.description}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Control Panel */}
                        <div className="p-6 bg-gray-50 border-t border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Panel Kontrol</h3>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <form onSubmit={handleApprove} className="flex-1">
                                    <button
                                        type="submit"
                                        disabled={approveForm.processing}
                                        className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                        {approveForm.processing ? 'Memproses...' : 'Approve'}
                                    </button>
                                </form>
                                <button
                                    type="button"
                                    onClick={() => setShowRejectModal(true)}
                                    className="flex-1 inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                >
                                    <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    Reject
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Reject Modal */}
            {showRejectModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        {/* Background overlay */}
                        <div
                            className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                            onClick={() => setShowRejectModal(false)}
                        ></div>

                        {/* Modal panel */}
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <form onSubmit={handleReject}>
                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <div className="sm:flex sm:items-start">
                                        <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                            <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                            </svg>
                                        </div>
                                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                                                Tolak Lowongan
                                            </h3>
                                            <div className="mt-4">
                                                <label htmlFor="rejection_reason" className="block text-sm font-medium text-gray-700 mb-2">
                                                    Alasan Penolakan <span className="text-red-500">*</span>
                                                </label>
                                                <textarea
                                                    id="rejection_reason"
                                                    rows={4}
                                                    className={`w-full rounded-md shadow-sm ${rejectForm.errors.rejection_reason
                                                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                                                        : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                                                        }`}
                                                    placeholder="Jelaskan alasan penolakan lowongan ini..."
                                                    value={rejectForm.data.rejection_reason}
                                                    onChange={(e) => rejectForm.setData('rejection_reason', e.target.value)}
                                                />
                                                {rejectForm.errors.rejection_reason && (
                                                    <p className="mt-2 text-sm text-red-600">{rejectForm.errors.rejection_reason}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                    <button
                                        type="submit"
                                        disabled={rejectForm.processing}
                                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                                    >
                                        {rejectForm.processing ? 'Memproses...' : 'Tolak Lowongan'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowRejectModal(false)}
                                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                    >
                                        Batal
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
