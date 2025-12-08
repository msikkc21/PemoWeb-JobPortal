import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function DashboardAdmin({ auth, statistics = {}, recentUsers = [], recentJobs = [], recentApplications = [] }) {
    // Default values for statistics
    const stats = {
        totalUsers: statistics.totalUsers ?? 0,
        totalCompanies: statistics.totalCompanies ?? 0,
        totalJobSeekers: statistics.totalJobSeekers ?? 0,
        totalJobs: statistics.totalJobs ?? 0,
        activeJobs: statistics.activeJobs ?? 0,
        pendingJobs: statistics.pendingJobs ?? 0,
        closedJobs: statistics.closedJobs ?? 0,
        totalApplications: statistics.totalApplications ?? 0,
        submittedApplications: statistics.submittedApplications ?? 0,
        inProcessApplications: statistics.inProcessApplications ?? 0,
        shortlistedApplications: statistics.shortlistedApplications ?? 0,
        interviewedApplications: statistics.interviewedApplications ?? 0,
        offeredApplications: statistics.offeredApplications ?? 0,
        acceptedApplications: statistics.acceptedApplications ?? 0,
        rejectedApplications: statistics.rejectedApplications ?? 0,
        totalInterviews: statistics.totalInterviews ?? 0,
        scheduledInterviews: statistics.scheduledInterviews ?? 0,
        completedInterviews: statistics.completedInterviews ?? 0,
        newUsersThisWeek: statistics.newUsersThisWeek ?? 0,
        newJobsThisWeek: statistics.newJobsThisWeek ?? 0,
        newApplicationsThisWeek: statistics.newApplicationsThisWeek ?? 0,
    };

    const getStatusBadge = (status) => {
        const styles = {
            submitted: 'bg-blue-100 text-blue-800',
            in_process: 'bg-yellow-100 text-yellow-800',
            shortlisted: 'bg-purple-100 text-purple-800',
            interviewed: 'bg-indigo-100 text-indigo-800',
            offered: 'bg-teal-100 text-teal-800',
            accepted: 'bg-green-100 text-green-800',
            rejected: 'bg-red-100 text-red-800',
        };
        const labels = {
            submitted: 'Submitted',
            in_process: 'In Process',
            shortlisted: 'Shortlisted',
            interviewed: 'Interviewed',
            offered: 'Offered',
            accepted: 'Diterima',
            rejected: 'Ditolak',
        };
        return (
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
                {labels[status] || status}
            </span>
        );
    };

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

                    {/* Weekly Stats Highlight */}
                    <div className="mb-6 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white">
                        <h2 className="text-lg font-medium mb-4">Aktivitas Minggu Ini</h2>
                        <div className="grid grid-cols-3 gap-6">
                            <div className="text-center">
                                <p className="text-4xl font-bold">{stats.newUsersThisWeek}</p>
                                <p className="text-indigo-100 text-sm">Pengguna Baru</p>
                            </div>
                            <div className="text-center">
                                <p className="text-4xl font-bold">{stats.newJobsThisWeek}</p>
                                <p className="text-indigo-100 text-sm">Lowongan Baru</p>
                            </div>
                            <div className="text-center">
                                <p className="text-4xl font-bold">{stats.newApplicationsThisWeek}</p>
                                <p className="text-indigo-100 text-sm">Lamaran Baru</p>
                            </div>
                        </div>
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
                                                <dt className="text-sm font-medium text-gray-500 truncate">Total Pengguna</dt>
                                                <dd className="text-3xl font-semibold text-gray-900">{stats.totalUsers}</dd>
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
                                                <dt className="text-sm font-medium text-gray-500 truncate">Total Perusahaan</dt>
                                                <dd className="text-3xl font-semibold text-gray-900">{stats.totalCompanies}</dd>
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
                                                <dt className="text-sm font-medium text-gray-500 truncate">Total Job Seeker</dt>
                                                <dd className="text-3xl font-semibold text-gray-900">{stats.totalJobSeekers}</dd>
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
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
                                                <dt className="text-sm font-medium text-gray-500 truncate">Total Lowongan</dt>
                                                <dd className="text-3xl font-semibold text-gray-900">{stats.totalJobs}</dd>
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
                                                <dt className="text-sm font-medium text-gray-500 truncate">Lowongan Aktif</dt>
                                                <dd className="text-3xl font-semibold text-gray-900">{stats.activeJobs}</dd>
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
                                                <dt className="text-sm font-medium text-gray-500 truncate">Pending Review</dt>
                                                <dd className="text-3xl font-semibold text-gray-900">{stats.pendingJobs}</dd>
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
                                                <dt className="text-sm font-medium text-gray-500 truncate">Lowongan Ditutup</dt>
                                                <dd className="text-3xl font-semibold text-gray-900">{stats.closedJobs}</dd>
                                            </dl>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Application & Interview Statistics */}
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold text-gray-700 mb-3">Statistik Lamaran & Interview</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                                <p className="text-2xl font-bold text-gray-900">{stats.totalApplications}</p>
                                <p className="text-xs text-gray-500">Total Lamaran</p>
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                                <p className="text-2xl font-bold text-blue-600">{stats.submittedApplications}</p>
                                <p className="text-xs text-gray-500">Submitted</p>
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                                <p className="text-2xl font-bold text-yellow-600">{stats.inProcessApplications}</p>
                                <p className="text-xs text-gray-500">In Process</p>
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                                <p className="text-2xl font-bold text-purple-600">{stats.shortlistedApplications}</p>
                                <p className="text-xs text-gray-500">Shortlisted</p>
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                                <p className="text-2xl font-bold text-indigo-600">{stats.interviewedApplications}</p>
                                <p className="text-xs text-gray-500">Interviewed</p>
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                                <p className="text-2xl font-bold text-teal-600">{stats.offeredApplications}</p>
                                <p className="text-xs text-gray-500">Offered</p>
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                                <p className="text-2xl font-bold text-green-600">{stats.acceptedApplications}</p>
                                <p className="text-xs text-gray-500">Diterima</p>
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                                <p className="text-2xl font-bold text-red-600">{stats.rejectedApplications}</p>
                                <p className="text-xs text-gray-500">Ditolak</p>
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                                <p className="text-2xl font-bold text-cyan-600">{stats.totalInterviews}</p>
                                <p className="text-xs text-gray-500">Total Interview</p>
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                                <p className="text-2xl font-bold text-amber-600">{stats.scheduledInterviews}</p>
                                <p className="text-xs text-gray-500">Terjadwal</p>
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                                <p className="text-2xl font-bold text-emerald-600">{stats.completedInterviews}</p>
                                <p className="text-xs text-gray-500">Selesai</p>
                            </div>
                        </div>
                    </div>

                    {/* Recent Data */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Recent Users */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-semibold text-gray-900">Pengguna Terbaru</h2>
                                    <Link href="/admin/users" className="text-sm text-indigo-600 hover:text-indigo-800">Lihat semua</Link>
                                </div>
                                <div className="space-y-3">
                                    {recentUsers && recentUsers.length > 0 ? (
                                        recentUsers.map((user) => (
                                            <div key={user.id} className="flex items-center justify-between border-b pb-3">
                                                <div>
                                                    <p className="font-medium text-gray-900 text-sm">{user.name}</p>
                                                    <p className="text-xs text-gray-600">{user.email}</p>
                                                </div>
                                                <div className="text-right">
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                                        {user.role?.name || 'N/A'}
                                                    </span>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {new Date(user.created_at).toLocaleDateString('id-ID')}
                                                    </p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-500 text-center py-4">Tidak ada data</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Recent Jobs */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-semibold text-gray-900">Lowongan Terbaru</h2>
                                    <Link href="/admin/jobs" className="text-sm text-indigo-600 hover:text-indigo-800">Lihat semua</Link>
                                </div>
                                <div className="space-y-3">
                                    {recentJobs && recentJobs.length > 0 ? (
                                        recentJobs.map((job) => (
                                            <div key={job.id} className="flex items-center justify-between border-b pb-3">
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-gray-900 text-sm truncate">{job.title}</p>
                                                    <p className="text-xs text-gray-600 truncate">{job.company?.company_name || 'N/A'}</p>
                                                </div>
                                                <div className="text-right ml-2">
                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium 
                                                        ${job.status === 'active' ? 'bg-green-100 text-green-800' :
                                                            job.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                                                        {job.status === 'active' ? 'Aktif' : job.status === 'pending' ? 'Pending' : 'Ditutup'}
                                                    </span>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {new Date(job.created_at).toLocaleDateString('id-ID')}
                                                    </p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-500 text-center py-4">Tidak ada data</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Recent Applications */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-semibold text-gray-900">Lamaran Terbaru</h2>
                                </div>
                                <div className="space-y-3">
                                    {recentApplications && recentApplications.length > 0 ? (
                                        recentApplications.map((app) => (
                                            <div key={app.id} className="flex items-center justify-between border-b pb-3">
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-gray-900 text-sm truncate">{app.job_seeker?.name || 'N/A'}</p>
                                                    <p className="text-xs text-gray-600 truncate">{app.job?.title || 'N/A'}</p>
                                                </div>
                                                <div className="text-right ml-2">
                                                    {getStatusBadge(app.status)}
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {new Date(app.created_at).toLocaleDateString('id-ID')}
                                                    </p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-500 text-center py-4">Tidak ada data</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="mt-6 bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Aksi Cepat</h2>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <Link
                                    href="/admin/users"
                                    className="flex items-center p-4 border border-gray-300 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition"
                                >
                                    <svg className="h-8 w-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                    <span className="ml-3 font-medium text-gray-900">Kelola Pengguna</span>
                                </Link>
                                <Link
                                    href="/admin/companies"
                                    className="flex items-center p-4 border border-gray-300 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition"
                                >
                                    <svg className="h-8 w-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                    <span className="ml-3 font-medium text-gray-900">Kelola Perusahaan</span>
                                </Link>
                                <Link
                                    href="/admin/jobs"
                                    className="flex items-center p-4 border border-gray-300 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition"
                                >
                                    <svg className="h-8 w-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    <span className="ml-3 font-medium text-gray-900">Kelola Lowongan</span>
                                </Link>
                                <Link
                                    href="/admin/skills"
                                    className="flex items-center p-4 border border-gray-300 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition"
                                >
                                    <svg className="h-8 w-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                    </svg>
                                    <span className="ml-3 font-medium text-gray-900">Kelola Skills</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
