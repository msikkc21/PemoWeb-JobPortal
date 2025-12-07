import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function ByJob({ job, applications = [], totalApplications }) {
    return (
        <AuthenticatedLayout>
            <Head title={`Pelamar - ${job?.title || 'Lowongan'}`} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Pelamar untuk: {job?.title}</h1>
                            <p className="text-sm text-gray-600">Total pelamar: {totalApplications}</p>
                        </div>
                        <div>
                            <Link href={route('company.jobs.index')} className="text-indigo-600 hover:text-indigo-800">
                                &larr; Kembali ke Jobs
                            </Link>
                        </div>
                    </div>

                    <div className="bg-white shadow sm:rounded-lg">
                        <div className="overflow-x-auto rounded-lg">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Nama Pelamar
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Tanggal Lamar
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {applications.length > 0 ? (
                                        applications.map((app) => (
                                            <tr key={app.id}>
                                                <td className="px-6 py-4 text-sm text-gray-900">{app.job_seeker?.name || '-'}</td>
                                                <td className="px-6 py-4 text-sm text-gray-700">
                                                    {new Date(app.application_date).toLocaleDateString('id-ID')}
                                                </td>
                                                <td className="px-6 py-4 text-sm">
                                                    <span
                                                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                                                            app.status === 'submitted'
                                                                ? 'bg-yellow-100 text-yellow-800'
                                                                : app.status === 'in_process'
                                                                  ? 'bg-blue-100 text-blue-800'
                                                                  : app.status === 'accepted'
                                                                    ? 'bg-green-100 text-green-800'
                                                                    : app.status === 'shortlisted'
                                                                      ? 'bg-purple-100 text-purple-800'
                                                                      : 'bg-red-100 text-red-800'
                                                        }`}
                                                    >
                                                        {app.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right text-sm">
                                                    <div className="flex justify-end gap-2">
                                                        <Link
                                                            href={route('company.applicants.show', app.id)}
                                                            className="rounded border px-3 py-1 text-xs text-indigo-600 hover:bg-indigo-50"
                                                        >
                                                            Detail
                                                        </Link>
                                                        {['shortlisted', 'reviewed', 'submitted'].includes(app.status) ? (
                                                            <Link
                                                                href={route('company.applicants.interviews.create', app.id)}
                                                                className="rounded bg-indigo-600 px-3 py-1 text-xs text-white hover:bg-indigo-700"
                                                            >
                                                                Jadwalkan
                                                            </Link>
                                                        ) : (
                                                            <span className="cursor-not-allowed rounded bg-gray-300 px-3 py-1 text-xs text-white">
                                                                Jadwalkan
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                                                Belum ada pelamar untuk lowongan ini.
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
