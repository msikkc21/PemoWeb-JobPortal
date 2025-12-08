import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { useDebounce } from 'use-debounce';

export default function ApplicantsList({ applications = [], totalApplications, filters, job }) {
    const { flash, errors } = usePage().props;
    const [searchTerm, setSearchTerm] = useState(filters?.search || '');
    const [statusFilter, setStatusFilter] = useState(filters?.status || '');
    const [debouncedSearchTerm] = useDebounce(searchTerm, 300);
    const [alert, setAlert] = useState(null);
    const isInitialMount = useRef(true);

    // Show flash messages
    useEffect(() => {
        if (flash?.success) {
            setAlert({ type: 'success', message: flash.success });
            setTimeout(() => setAlert(null), 5000);
        }
        if (flash?.error) {
            setAlert({ type: 'error', message: flash.error });
            setTimeout(() => setAlert(null), 5000);
        }
        if (errors && Object.keys(errors).length > 0) {
            const errorMsg = Object.values(errors).flat().join(', ');
            setAlert({ type: 'error', message: errorMsg });
            setTimeout(() => setAlert(null), 5000);
        }
    }, [flash, errors]);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        const query = {};
        if (debouncedSearchTerm) query.search = debouncedSearchTerm;
        if (statusFilter) query.status = statusFilter;

        // Use job-specific URL if job context exists
        const url = job ? `/company/jobs/${job.id}/applicants` : '/company/applicants';

        router.get(url, query, {
            preserveState: true,
            replace: true,
        });
    }, [debouncedSearchTerm, statusFilter]);

    const handleStatusChange = (appId, newStatus, currentStatus) => {
        if (newStatus === currentStatus) return;

        if (!confirm(`Ubah status lamaran menjadi "${newStatus}"?`)) {
            return;
        }

        setAlert({ type: 'info', message: 'Mengubah status...' });

        router.post(`/company/applicants/${appId}/status`, { status: newStatus }, {
            preserveScroll: true,
            onSuccess: () => {
                setAlert({ type: 'success', message: 'Status berhasil diubah!' });
            },
            onError: (errors) => {
                const errorMsg = Object.values(errors).flat().join(', ');
                setAlert({ type: 'error', message: `Gagal: ${errorMsg}` });
            },
        });
    };

    const getStatusBadge = (status) => {
        const styles = {
            submitted: 'bg-yellow-100 text-yellow-800',
            reviewed: 'bg-blue-100 text-blue-800',
            shortlisted: 'bg-purple-100 text-purple-800',
            in_process: 'bg-blue-100 text-blue-800',
            interviewed: 'bg-violet-100 text-violet-800',
            accepted: 'bg-green-100 text-green-800',
            offered: 'bg-teal-100 text-teal-800',
            rejected: 'bg-red-100 text-red-800',
        };
        return styles[status] || 'bg-gray-100 text-gray-800';
    };

    const statusOptions = [
        { value: 'submitted', label: 'Submitted' },
        { value: 'in_process', label: 'In Process' },
        { value: 'shortlisted', label: 'Shortlisted (Undangan Interview)' },
        { value: 'interviewed', label: 'Sudah Interview' },
        { value: 'offered', label: 'Offered' },
        { value: 'accepted', label: 'Accepted' },
        { value: 'rejected', label: 'Rejected' },
    ];

    // Only these statuses can schedule interview
    const canScheduleInterview = (status) => ['reviewed', 'shortlisted', 'submitted'].includes(status);

    return (
        <AuthenticatedLayout>
            <Head title="Daftar Pelamar" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Alert Component */}
                    {alert && (
                        <div className={`mb-4 p-4 rounded-md ${alert.type === 'success' ? 'bg-green-100 border border-green-400 text-green-700' :
                            alert.type === 'error' ? 'bg-red-100 border border-red-400 text-red-700' :
                                'bg-blue-100 border border-blue-400 text-blue-700'
                            }`}>
                            <div className="flex justify-between items-center">
                                <span>{alert.message}</span>
                                <button onClick={() => setAlert(null)} className="ml-4 text-lg font-bold">&times;</button>
                            </div>
                        </div>
                    )}

                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                {job ? `Pelamar: ${job.title}` : 'Daftar Pelamar'}
                            </h1>
                            <p className="mt-2 text-gray-600">
                                {job ? (
                                    <Link href="/company/applicants" className="text-indigo-600 hover:underline">
                                        ← Kembali ke Semua Pelamar
                                    </Link>
                                ) : (
                                    'Review berkas pelamar yang telah melamar!'
                                )}
                            </p>
                        </div>
                        <div className="overflow-hidden bg-white sm:rounded-lg">
                            <div className="p-4">
                                <div className="flex items-center gap-4">
                                    <div className="flex-shrink-0 rounded-md bg-blue-500 p-3">
                                        <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-gray-900">{totalApplications}</p>
                                        <p className="text-sm font-medium text-gray-500">Total Pelamar</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="my-8 flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <input
                                type="text"
                                placeholder="Cari pelamar berdasarkan nama..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full rounded-lg border border-gray-300 p-3 ps-4 text-sm text-gray-900"
                            />
                        </div>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="rounded-lg border border-gray-300 p-3 text-sm"
                        >
                            <option value="">Semua Status</option>
                            {statusOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Table */}
                    <div className="bg-white shadow sm:rounded-lg">
                        <div className="overflow-x-auto rounded-lg">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gradient-to-r from-indigo-500 to-purple-600">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-white">Nama Pelamar</th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-white">Tanggal Lamar</th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-white">Lowongan</th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-white">Status</th>
                                        <th className="px-6 py-3 text-center text-sm font-semibold text-white">Ubah Status</th>
                                        <th className="px-6 py-3 text-right text-sm font-semibold text-white">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {applications.length > 0 ? (
                                        applications.map((app) => (
                                            <tr key={app.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {app.job_seeker?.name || '-'}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-700">
                                                    {app.application_date ? new Date(app.application_date).toLocaleDateString('id-ID') : '-'}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-700">
                                                    {app.job?.title || '-'}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${getStatusBadge(app.status)}`}>
                                                        {app.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <select
                                                        value={app.status}
                                                        onChange={(e) => handleStatusChange(app.id, e.target.value, app.status)}
                                                        className="rounded border text-sm px-2 py-1"
                                                    >
                                                        {statusOptions.map(opt => (
                                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                        ))}
                                                    </select>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Link
                                                            href={`/company/applicants/${app.id}`}
                                                            className="text-indigo-600 rounded border px-3 py-1 text-sm hover:bg-indigo-50"
                                                        >
                                                            Lihat
                                                        </Link>
                                                        {canScheduleInterview(app.status) ? (
                                                            <Link
                                                                href={`/company/applicants/${app.id}/interviews/create`}
                                                                className="rounded bg-indigo-600 px-3 py-1 text-sm text-white hover:bg-indigo-700"
                                                            >
                                                                Jadwalkan
                                                            </Link>
                                                        ) : (
                                                            <span className="cursor-not-allowed rounded bg-gray-300 px-3 py-1 text-sm text-white">
                                                                Jadwalkan
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="px-4 py-6 text-center text-gray-500">
                                                Belum ada pelamar
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
