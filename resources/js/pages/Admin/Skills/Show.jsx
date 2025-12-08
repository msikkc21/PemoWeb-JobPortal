import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Show({ auth, skill }) {
    const handleDelete = () => {
        if (confirm(`Apakah Anda yakin ingin menghapus skill "${skill.name}"?`)) {
            router.delete(`/admin/skills/${skill.id}`);
        }
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={`Detail Skill: ${skill.name} - Admin`} />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6">
                        <Link
                            href="/admin/skills"
                            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Kembali ke Daftar Skill
                        </Link>
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">{skill.name}</h1>
                                <p className="mt-1 text-gray-600">
                                    {skill.description || 'Tidak ada deskripsi'}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <Link
                                    href={`/admin/skills/${skill.id}/edit`}
                                    className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    Edit
                                </Link>
                                <button
                                    onClick={handleDelete}
                                    className="inline-flex items-center px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    Hapus
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                                    <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div className="ml-5">
                                    <p className="text-sm font-medium text-gray-500">Digunakan di Lowongan</p>
                                    <p className="text-3xl font-semibold text-gray-900">{skill.jobs_count || 0}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                                    <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                </div>
                                <div className="ml-5">
                                    <p className="text-sm font-medium text-gray-500">Dimiliki Job Seeker</p>
                                    <p className="text-3xl font-semibold text-gray-900">{skill.job_seekers_count || 0}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Jobs using this skill */}
                    {skill.jobs && skill.jobs.length > 0 && (
                        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Lowongan Terbaru dengan Skill Ini</h2>
                            <div className="space-y-3">
                                {skill.jobs.map((job) => (
                                    <div key={job.id} className="flex justify-between items-center border-b pb-3">
                                        <div>
                                            <p className="font-medium text-gray-900">{job.title}</p>
                                            <p className="text-sm text-gray-600">{job.company?.company_name || 'N/A'}</p>
                                        </div>
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${job.status === 'active'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-gray-100 text-gray-800'
                                            }`}>
                                            {job.status === 'active' ? 'Aktif' : job.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Recent Job Seekers with this skill */}
                    {skill.job_seekers && skill.job_seekers.length > 0 && (
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Job Seeker dengan Skill Ini</h2>
                            <div className="space-y-3">
                                {skill.job_seekers.map((seeker) => (
                                    <div key={seeker.id} className="flex justify-between items-center border-b pb-3">
                                        <div>
                                            <p className="font-medium text-gray-900">{seeker.name}</p>
                                            <p className="text-sm text-gray-600">{seeker.education || 'N/A'}</p>
                                        </div>
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${seeker.pivot?.level === 'expert'
                                                ? 'bg-purple-100 text-purple-800'
                                                : seeker.pivot?.level === 'intermediate'
                                                    ? 'bg-blue-100 text-blue-800'
                                                    : 'bg-gray-100 text-gray-800'
                                            }`}>
                                            {seeker.pivot?.level === 'expert' ? 'Ahli' :
                                                seeker.pivot?.level === 'intermediate' ? 'Menengah' : 'Pemula'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Empty state if no related data */}
                    {(!skill.jobs || skill.jobs.length === 0) && (!skill.job_seekers || skill.job_seekers.length === 0) && (
                        <div className="bg-white rounded-lg shadow-sm p-6 text-center text-gray-500">
                            Skill ini belum digunakan oleh lowongan atau job seeker manapun.
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
