import { Head, Link, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Index({ applications }) {
    const { flash } = usePage().props;

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    const formatDateTime = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        }) + ' - ' + date.toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getStatusBadge = (status) => {
        const styles = {
            submitted: 'bg-blue-100 text-blue-800',
            reviewed: 'bg-cyan-100 text-cyan-800',
            shortlisted: 'bg-purple-100 text-purple-800',
            in_process: 'bg-yellow-100 text-yellow-800',
            interview: 'bg-indigo-100 text-indigo-800',
            interviewed: 'bg-violet-100 text-violet-800',
            accepted: 'bg-green-100 text-green-800',
            offered: 'bg-teal-100 text-teal-800',
            rejected: 'bg-red-100 text-red-800',
        };

        const labels = {
            submitted: 'Terkirim',
            reviewed: 'Ditinjau',
            shortlisted: 'Shortlist',
            in_process: 'Diproses',
            interviewed: 'Sudah Interview',
            accepted: 'Diterima',
            offered: 'Ditawari',
            rejected: 'Ditolak',
        };

        return (
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
                {labels[status] || status}
            </span>
        );
    };

    return (
        <AuthenticatedLayout>
            <Head title="Lamaran Saya" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-gray-900">Lamaran Saya</h1>
                        <p className="mt-2 text-gray-600">
                            Pantau status lamaran pekerjaan Anda
                        </p>
                    </div>

                    {/* Flash Messages */}
                    {flash?.success && (
                        <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-md">
                            {flash.success}
                        </div>
                    )}
                    {flash?.error && (
                        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
                            {flash.error}
                        </div>
                    )}

                    {/* Applications List */}
                    {applications && applications.length > 0 ? (
                        <div className="space-y-4">
                            {applications.map((app) => (
                                <div key={app.id} className="bg-white shadow-sm rounded-lg p-6">
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                        {/* Left: Job Info */}
                                        <div className="flex-1">
                                            <div className="flex items-start gap-3">
                                                <div className="flex-1">
                                                    <Link
                                                        href={`/jobseeker/jobs/${app.job?.id}`}
                                                        className="text-lg font-semibold text-indigo-600 hover:text-indigo-900"
                                                    >
                                                        {app.job?.title || 'N/A'}
                                                    </Link>
                                                    <p className="text-sm text-gray-600 mt-1">
                                                        {app.job?.company?.company_name || 'N/A'}
                                                    </p>
                                                    <p className="text-xs text-gray-400 mt-1">
                                                        Dilamar: {formatDate(app.application_date)}
                                                    </p>
                                                </div>
                                                <div className="flex-shrink-0">
                                                    {getStatusBadge(app.status)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Interview Info (if shortlisted and has interview data) */}
                                    {app.status === 'shortlisted' && app.interview && (
                                        <div className="mt-4 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                                            <div className="flex items-center gap-2 mb-2">
                                                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <span className="font-semibold text-indigo-800">Jadwal Interview</span>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                                <div>
                                                    <span className="text-gray-600">Waktu:</span>
                                                    <span className="ml-2 font-medium text-gray-900">
                                                        {formatDateTime(app.interview.schedule)}
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-600">Lokasi:</span>
                                                    <span className="ml-2 font-medium text-gray-900">
                                                        {app.interview.location?.startsWith('http') ? (
                                                            <a
                                                                href={app.interview.location}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-indigo-600 hover:underline"
                                                            >
                                                                {app.interview.location}
                                                            </a>
                                                        ) : (
                                                            app.interview.location || '-'
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                            <p className="mt-2 text-xs text-indigo-600">
                                                ✨ Pastikan Anda hadir tepat waktu. Semoga sukses!
                                            </p>
                                        </div>
                                    )}

                                    {/* Accepted Alert */}
                                    {app.status === 'accepted' && (
                                        <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                                            <div className="flex items-center gap-2 mb-2">
                                                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span className="font-semibold text-green-800">Selamat! Anda Diterima 🎉</span>
                                            </div>
                                            <p className="text-sm text-green-700">
                                                Lamaran Anda telah diterima oleh {app.job?.company?.company_name || 'perusahaan'}.
                                                Silakan tunggu informasi lebih lanjut dari perusahaan.
                                            </p>
                                        </div>
                                    )}

                                    {/* Offered Alert */}
                                    {app.status === 'offered' && (
                                        <div className="mt-4 p-4 bg-teal-50 rounded-lg border border-teal-200">
                                            <div className="flex items-center gap-2 mb-2">
                                                <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                                                </svg>
                                                <span className="font-semibold text-teal-800">Anda Mendapat Tawaran! 🎁</span>
                                            </div>
                                            <p className="text-sm text-teal-700">
                                                {app.job?.company?.company_name || 'Perusahaan'} telah memberikan tawaran kerja kepada Anda.
                                                Silakan periksa email atau hubungi perusahaan untuk detail lebih lanjut.
                                            </p>
                                        </div>
                                    )}

                                    {/* Interviewed Alert */}
                                    {app.status === 'interviewed' && (
                                        <div className="mt-4 p-4 bg-violet-50 rounded-lg border border-violet-200">
                                            <div className="flex items-center gap-2 mb-2">
                                                <svg className="w-5 h-5 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                </svg>
                                                <span className="font-semibold text-violet-800">Interview Selesai</span>
                                            </div>
                                            <p className="text-sm text-violet-700">
                                                Terima kasih telah mengikuti interview. Silakan tunggu keputusan dari {app.job?.company?.company_name || 'perusahaan'}.
                                            </p>
                                        </div>
                                    )}

                                    {/* Rejected Alert */}
                                    {app.status === 'rejected' && (
                                        <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-200">
                                            <div className="flex items-center gap-2 mb-2">
                                                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span className="font-semibold text-red-800">Lamaran Tidak Diterima</span>
                                            </div>
                                            <p className="text-sm text-red-700">
                                                Mohon maaf, lamaran Anda tidak sesuai dengan kriteria yang dicari.
                                                Jangan berkecil hati, tetap semangat mencari peluang lainnya! 💪
                                            </p>
                                        </div>
                                    )}

                                    {/* Actions */}
                                    <div className="mt-4 flex gap-3">
                                        <Link
                                            href={`/jobseeker/jobs/${app.job?.id}`}
                                            className="text-sm text-indigo-600 hover:text-indigo-900 font-medium"
                                        >
                                            Lihat Detail Job →
                                        </Link>
                                        {app.interview && (
                                            <Link
                                                href="/jobseeker/interviews"
                                                className="text-sm text-purple-600 hover:text-purple-900 font-medium"
                                            >
                                                Lihat Semua Interview →
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <h3 className="mt-2 text-sm font-medium text-gray-900">Belum ada lamaran</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                Mulai melamar pekerjaan untuk melihat statusnya di sini.
                            </p>
                            <div className="mt-6">
                                <Link
                                    href="/jobseeker/jobs"
                                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                                >
                                    <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    Browse Lowongan
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
