import { Head, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Index({ interviews = [] }) {
    const { flash } = usePage().props;

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        }) + ' - ' + date.toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getStatusBadge = (status) => {
        const styles = {
            scheduled: 'bg-blue-100 text-blue-800',
            rescheduled: 'bg-orange-100 text-orange-800',
            completed: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800',
        };

        const labels = {
            scheduled: 'Dijadwalkan',
            rescheduled: 'Dijadwal Ulang',
            completed: 'Selesai',
            cancelled: 'Dibatalkan',
        };

        return (
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
                {labels[status] || status}
            </span>
        );
    };

    const isUrl = (str) => {
        try {
            new URL(str);
            return true;
        } catch {
            return false;
        }
    };

    const upcomingInterviews = interviews.filter(i => ['scheduled', 'rescheduled'].includes(i.status));
    const pastInterviews = interviews.filter(i => ['completed', 'cancelled'].includes(i.status));

    return (
        <AuthenticatedLayout>
            <Head title="Jadwal Interview" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-gray-900">Jadwal Interview</h1>
                        <p className="mt-2 text-gray-600">
                            Lihat jadwal interview Anda dengan perusahaan
                        </p>
                    </div>

                    {/* Flash Messages */}
                    {flash?.success && (
                        <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-md">
                            {flash.success}
                        </div>
                    )}

                    {interviews.length === 0 ? (
                        /* Empty State */
                        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <h3 className="mt-2 text-sm font-medium text-gray-900">Belum ada jadwal interview</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                Jadwal interview akan muncul di sini setelah perusahaan menjadwalkannya.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {/* Upcoming Interviews */}
                            {upcomingInterviews.length > 0 && (
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                        Interview Mendatang ({upcomingInterviews.length})
                                    </h2>
                                    <div className="grid gap-4 md:grid-cols-2">
                                        {upcomingInterviews.map((interview) => (
                                            <div key={interview.id} className="bg-white rounded-lg shadow-sm border-l-4 border-blue-500 p-6">
                                                <div className="flex justify-between items-start mb-3">
                                                    <div>
                                                        <h3 className="text-lg font-semibold text-gray-900">
                                                            {interview.job?.title || 'Posisi tidak tersedia'}
                                                        </h3>
                                                        <p className="text-sm text-gray-600">
                                                            {interview.company?.name || 'Perusahaan tidak tersedia'}
                                                        </p>
                                                    </div>
                                                    {getStatusBadge(interview.status)}
                                                </div>

                                                <div className="space-y-2 text-sm">
                                                    <div className="flex items-center text-gray-700">
                                                        <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                        <span className="font-medium">{formatDate(interview.schedule)}</span>
                                                    </div>

                                                    <div className="flex items-start text-gray-700">
                                                        <svg className="w-4 h-4 mr-2 mt-0.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        </svg>
                                                        {isUrl(interview.location) ? (
                                                            <a
                                                                href={interview.location}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-blue-600 hover:underline"
                                                            >
                                                                {interview.location}
                                                            </a>
                                                        ) : (
                                                            <span>{interview.location || 'Lokasi tidak tersedia'}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Past Interviews */}
                            {pastInterviews.length > 0 && (
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                        Interview Sebelumnya ({pastInterviews.length})
                                    </h2>
                                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Posisi</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Perusahaan</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {pastInterviews.map((interview) => (
                                                    <tr key={interview.id} className="hover:bg-gray-50">
                                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                                            {interview.job?.title || '-'}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-gray-500">
                                                            {interview.company?.name || '-'}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-gray-500">
                                                            {formatDate(interview.schedule)}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            {getStatusBadge(interview.status)}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
