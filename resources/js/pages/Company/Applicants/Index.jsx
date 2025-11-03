import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { useDebounce } from 'use-debounce';

export default function ApplicantsList({ applications = [], totalApplications, filters }) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [debouncedSearchTerm] = useDebounce(searchTerm, 300);
    const isInitialMount = useRef(true);

    useEffect(() => {
        // Mencegah request ulang saat halaman pertama kali dimuat
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        // Mempersiapkan parameter untuk dikirim ke server
        const query = {};
        if (debouncedSearchTerm) {
            query.search = debouncedSearchTerm;
        }

        // Mengambil data baru dari server saat filter berubah
        router.get(route('company.applicants.index'), query, {
            preserveState: true,
            replace: true,
        });
    }, [debouncedSearchTerm]);

    return (
        <AuthenticatedLayout>
            <Head title="Daftar Pelamar" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Welcome Section */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Daftar Pelamar</h1>
                            <p className="mt-2 text-gray-600">Review berkas pelamar yang telah melamar!</p>
                        </div>
                        <div className="overflow-hidden bg-white sm:rounded-lg">
                            <div className="p-4">
                                <div className="flex items-center gap-4">
                                    <div className="flex-shrink-0 rounded-md bg-blue-500 p-3">
                                        <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                            />
                                        </svg>
                                    </div>
                                    <div>
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500">Total Pelamar</dt>
                                            <dd className="text-3xl font-semibold text-gray-900">{totalApplications}</dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="my-8 flex flex-col gap-4">
                        <div className="relative flex-1">
                            <input
                                type="text"
                                placeholder="Cari pelamar berdasarkan nama..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="focus:ring-primary focus:border-primary w-full rounded-lg border border-gray-300 p-3 ps-4 text-sm text-gray-900"
                            />
                            <div className="absolute inset-y-0 end-0 flex items-center pe-5">
                                <svg
                                    className="h-5 w-5 text-gray-400"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white shadow sm:rounded-lg">
                        <div className="overflow-x-auto rounded-lg">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gradient-to-r from-indigo-500 to-purple-600">
                                    <tr>
                                        <th className="px-8 py-4 text-left text-sm font-semibold text-white">Nama Pelamar</th>
                                        <th className="px-8 py-4 text-left text-sm font-semibold text-white">Tanggal Lamar</th>
                                        <th className="px-8 py-4 text-left text-sm font-semibold text-white">Lowongan</th>
                                        <th className="px-8 py-4 text-left text-sm font-semibold text-white">Status</th>
                                        <th className="textsms px-8 py-4 text-right font-semibold text-white">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {applications.length > 0 ? (
                                        applications.map((app) => (
                                            <tr key={app.id}>
                                                <td className="px-8 py-4">
                                                    <div className="text-sm font-medium text-gray-900">{app.job_seeker.name}</div>
                                                </td>
                                                <td className="px-8 py-4 text-sm text-gray-700">
                                                    {new Date(app.application_date).toLocaleDateString('id-ID')}
                                                </td>
                                                <td className="px-8 py-4 text-sm text-gray-700">{app.job.title}</td>
                                                <td className="px-8 py-4">
                                                    <span
                                                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                                                            app.status === 'submitted'
                                                                ? 'bg-yellow-100 text-yellow-800'
                                                                : app.status === 'in_process'
                                                                  ? 'bg-blue-100 text-blue-800'
                                                                  : app.status === 'accepted'
                                                                    ? 'bg-green-100 text-green-800'
                                                                    : 'bg-red-100 text-red-800'
                                                        }`}
                                                    >
                                                        {app.status}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-4 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Link
                                                            href={route('company.applicants.show', app.id)}
                                                            className="text-primary rounded border px-3 py-1 text-sm"
                                                        >
                                                            Lihat
                                                        </Link>

                                                        <Link
                                                            href={`/`}
                                                            disabled={app.status !== 'submitted'}
                                                            className={`rounded px-3 py-1 text-sm text-white ${app.status === 'submitted' ? 'bg-indigo-600 hover:bg-indigo-700' : 'cursor-not-allowed bg-gray-300'}`}
                                                        >
                                                            Review
                                                        </Link>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="px-4 py-6 text-center text-gray-500">
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
