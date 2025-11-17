import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function DashboardAdmin({ auth, statistics, recentUsers, recentJobs }) {
    return (
        <AuthenticatedLayout>
            <Head title="Dashboard Admin" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Welcome Section */}
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-gray-900">
                            Dashboard Admin
                        </h1>
                        <p className="mt-2 text-gray-600">
                            Selamat datang, {auth.user.name}!
                        </p>
                    </div>

                    {/* User Statistics */}
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold text-gray-700 mb-3">Statistik Pengguna</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                <div className="p-6">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                                            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                            </svg>
                                        </div>
                                        <div className="ml-5 w-0 flex-1">
                                            <dl>
                                                <dt className="text-sm font-medium text-gray-500 truncate">
                                                    Total Pengguna
                                                </dt>
                                                <dd className="text-3xl font-semibold text-gray-900">
                                                    {statistics.totalUsers}
                                                </dd>
                                            </dl>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                <div className="p-6">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                                            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                            </svg>
                                        </div>
                                        <div className="ml-5 w-0 flex-1">
                                            <dl>
                                                <dt className="text-sm font-medium text-gray-500 truncate">
                                                    Total Perusahaan
                                                </dt>
                                                <dd className="text-3xl font-semibold text-gray-900">
                                                    {statistics.totalCompanies}
                                                </dd>
                                            </dl>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                <div className="p-6">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                                            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </div>
                                        <div className="ml-5 w-0 flex-1">
                                            <dl>
                                                <dt className="text-sm font-medium text-gray-500 truncate">
                                                    Total Job Seeker
                                                </dt>
                                                <dd className="text-3xl font-semibold text-gray-900">
                                                    {statistics.totalJobSeekers}
                                                </dd>
                                            </dl>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Job Statistics */}
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold text-gray-700 mb-3">Statistik Lowongan</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                <div className="p-6">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                                            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <div className="ml-5 w-0 flex-1">
                                            <dl>
                                                <dt className="text-sm font-medium text-gray-500 truncate">
                                                    Total Lowongan
                                                </dt>
                                                <dd className="text-3xl font-semibold text-gray-900">
                                                    {statistics.totalJobs}
                                                </dd>
                                            </dl>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                <div className="p-6">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 bg-emerald-500 rounded-md p-3">
                                            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div className="ml-5 w-0 flex-1">
                                            <dl>
                                                <dt className="text-sm font-medium text-gray-500 truncate">
                                                    Lowongan Aktif
                                                </dt>
                                                <dd className="text-3xl font-semibold text-gray-900">
                                                    {statistics.activeJobs}
                                                </dd>
                                            </dl>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                <div className="p-6">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 bg-gray-500 rounded-md p-3">
                                            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </div>
                                        <div className="ml-5 w-0 flex-1">
                                            <dl>
                                                <dt className="text-sm font-medium text-gray-500 truncate">
                                                    Lowongan Ditutup
                                                </dt>
                                                <dd className="text-3xl font-semibold text-gray-900">
                                                    {statistics.closedJobs}
                                                </dd>
                                            </dl>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Application Statistics */}
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold text-gray-700 mb-3">Statistik Lamaran</h2>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                <div className="p-6">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 bg-cyan-500 rounded-md p-3">
                                            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </div>
                                        <div className="ml-5 w-0 flex-1">
                                            <dl>
                                                <dt className="text-sm font-medium text-gray-500 truncate">
                                                    Total Lamaran
                                                </dt>
                                                <dd className="text-3xl font-semibold text-gray-900">
                                                    {statistics.totalApplications}
                                                </dd>
                                            </dl>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                <div className="p-6">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                                            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div className="ml-5 w-0 flex-1">
                                            <dl>
                                                <dt className="text-sm font-medium text-gray-500 truncate">
                                                    Menunggu
                                                </dt>
                                                <dd className="text-3xl font-semibold text-gray-900">
                                                    {statistics.pendingApplications}
                                                </dd>
                                            </dl>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                <div className="p-6">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                                            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <div className="ml-5 w-0 flex-1">
                                            <dl>
                                                <dt className="text-sm font-medium text-gray-500 truncate">
                                                    Diterima
                                                </dt>
                                                <dd className="text-3xl font-semibold text-gray-900">
                                                    {statistics.acceptedApplications}
                                                </dd>
                                            </dl>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                <div className="p-6">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 bg-red-500 rounded-md p-3">
                                            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </div>
                                        <div className="ml-5 w-0 flex-1">
                                            <dl>
                                                <dt className="text-sm font-medium text-gray-500 truncate">
                                                    Ditolak
                                                </dt>
                                                <dd className="text-3xl font-semibold text-gray-900">
                                                    {statistics.rejectedApplications}
                                                </dd>
                                            </dl>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Data */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Recent Users */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                    Pengguna Terbaru
                                </h2>
                                <div className="space-y-4">
                                    {recentUsers && recentUsers.length > 0 ? (
                                        recentUsers.map((user) => (
                                            <div key={user.id} className="flex items-center justify-between border-b pb-3">
                                                <div>
                                                    <p className="font-medium text-gray-900">{user.name}</p>
                                                    <p className="text-sm text-gray-600">{user.email}</p>
                                                </div>
                                                <div className="text-right">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                                        {user.role?.name || 'N/A'}
                                                    </span>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {new Date(user.created_at).toLocaleDateString('id-ID')}
                                                    </p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-500 text-center py-4">Tidak ada data pengguna</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Recent Jobs */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                    Lowongan Terbaru
                                </h2>
                                <div className="space-y-4">
                                    {recentJobs && recentJobs.length > 0 ? (
                                        recentJobs.map((job) => (
                                            <div key={job.id} className="flex items-center justify-between border-b pb-3">
                                                <div>
                                                    <p className="font-medium text-gray-900">{job.title}</p>
                                                    <p className="text-sm text-gray-600">{job.company?.company_name || 'N/A'}</p>
                                                </div>
                                                <div className="text-right">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                                                        ${job.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                                        {job.status === 'active' ? 'Aktif' : 'Ditutup'}
                                                    </span>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {new Date(job.created_at).toLocaleDateString('id-ID')}
                                                    </p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-500 text-center py-4">Tidak ada data lowongan</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="mt-6 bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                Aksi Cepat
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <Link
                                    href="#"
                                    className="flex items-center p-4 border border-gray-300 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition"
                                >
                                    <svg className="h-8 w-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                    <span className="ml-3 font-medium text-gray-900">Kelola Pengguna</span>
                                </Link>
                                <Link
                                    href="#"
                                    className="flex items-center p-4 border border-gray-300 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition"
                                >
                                    <svg className="h-8 w-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                    <span className="ml-3 font-medium text-gray-900">Kelola Perusahaan</span>
                                </Link>
                                <Link
                                    href="#"
                                    className="flex items-center p-4 border border-gray-300 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition"
                                >
                                    <svg className="h-8 w-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    <span className="ml-3 font-medium text-gray-900">Kelola Lowongan</span>
                                </Link>
                                <Link
                                    href="#"
                                    className="flex items-center p-4 border border-gray-300 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition"
                                >
                                    <svg className="h-8 w-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                    <span className="ml-3 font-medium text-gray-900">Lihat Laporan</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
