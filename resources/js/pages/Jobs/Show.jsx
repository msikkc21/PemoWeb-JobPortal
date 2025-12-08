import { Head, Link, usePage } from '@inertiajs/react';

export default function Show({ job }) {
    const { auth } = usePage().props;

    // Dashboard link based on role
    const role = auth?.user?.role?.name?.toLowerCase() || null;
    const dashboardHref =
        role === 'admin'
            ? '/admin/dashboard'
            : role === 'company'
                ? '/company/dashboard'
                : role === 'jobseeker'
                    ? '/jobseeker/dashboard'
                    : '/dashboard';

    const formatSalary = (min, max, currency = 'IDR') => {
        const formatter = new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        });

        if (min && max) {
            return `${formatter.format(min)} - ${formatter.format(max)}`;
        } else if (min) {
            return `Mulai ${formatter.format(min)}`;
        } else if (max) {
            return `Hingga ${formatter.format(max)}`;
        }
        return 'Gaji tidak ditampilkan';
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    const jobTypeLabels = {
        'full-time': 'Full Time',
        'part-time': 'Part Time',
        'contract': 'Kontrak',
        'freelance': 'Freelance',
        'internship': 'Magang',
    };

    return (
        <>
            <Head title={`${job.title} - ${job.company?.company_name || 'JobPortal'}`} />

            <div className="min-h-screen bg-gray-50">
                {/* Navbar - Matching Welcome.jsx style */}
                <header className="sticky top-0 z-20 border-b border-gray-100 bg-white/80 backdrop-blur">
                    <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                        <Link href="/" className="text-lg font-semibold text-gray-900 hover:text-gray-700">
                            <img src="/assets/Images/logo.png" alt="JobPortal" className="h-8 w-auto" />
                        </Link>
                        <div className="flex items-center gap-10">
                            <Link href="/" className="text-md text-gray-900 transition-all duration-200 hover:text-black hover:underline">
                                Homepage
                            </Link>
                            <Link href="/jobs" className="text-md text-gray-900 transition-all duration-200 hover:text-black hover:underline">
                                Jobs
                            </Link>
                            <Link href="/about" className="text-md text-gray-900 transition-all duration-200 hover:text-black hover:underline">
                                About Us
                            </Link>
                        </div>
                        <nav className="flex items-center gap-2 sm:gap-3">
                            {auth?.user ? (
                                <Link href={dashboardHref} className="rounded-md bg-gray-900 px-3 py-2 text-sm text-white transition hover:bg-gray-800">
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-50"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
                                    >
                                        Register
                                    </Link>
                                </>
                            )}
                        </nav>
                    </div>
                </header>

                {/* Breadcrumb */}
                <div className="bg-white border-b border-gray-100">
                    <div className="max-w-7xl mx-auto px-6 py-3">
                        <nav className="flex items-center gap-2 text-sm">
                            <Link href="/" className="text-gray-500 hover:text-gray-700">Home</Link>
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                            <Link href="/jobs" className="text-gray-500 hover:text-gray-700">Lowongan</Link>
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                            <span className="text-gray-900 font-medium truncate max-w-xs">{job.title}</span>
                        </nav>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Job Details */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Job Header */}
                            <div className="bg-white rounded-xl shadow-[0_14px_34px_rgba(0,0,0,0.06)] ring-1 ring-black/5 p-6">
                                <div className="flex items-start space-x-4">
                                    {job.company?.photo_path ? (
                                        <img
                                            src={`/storage/${job.company.photo_path}`}
                                            alt={job.company.company_name}
                                            className="w-16 h-16 rounded-lg object-cover"
                                        />
                                    ) : (
                                        <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                                            <span className="text-white font-bold text-2xl">
                                                {job.company?.company_name?.charAt(0) || '?'}
                                            </span>
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
                                        <p className="text-lg text-indigo-600 font-medium">{job.company?.company_name || 'Unknown Company'}</p>
                                        <div className="mt-2 flex flex-wrap gap-2">
                                            {job.job_type && (
                                                <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-sm font-medium rounded-full">
                                                    {jobTypeLabels[job.job_type] || job.job_type}
                                                </span>
                                            )}
                                            {job.job_level && (
                                                <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full">
                                                    {job.job_level}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                        <p className="text-sm text-gray-500">Lokasi</p>
                                        <p className="font-medium text-gray-900">{job.location || '-'}</p>
                                    </div>
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                        <p className="text-sm text-gray-500">Gaji</p>
                                        <p className="font-medium text-gray-900">
                                            {formatSalary(job.salary_min, job.salary_max, job.currency)}
                                        </p>
                                    </div>
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                        <p className="text-sm text-gray-500">Diposting</p>
                                        <p className="font-medium text-gray-900">{formatDate(job.posted_date || job.created_at)}</p>
                                    </div>
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                        <p className="text-sm text-gray-500">Batas Lamaran</p>
                                        <p className="font-medium text-gray-900">{formatDate(job.expiry_date) || 'Belum ditentukan'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="bg-white rounded-xl shadow-[0_14px_34px_rgba(0,0,0,0.06)] ring-1 ring-black/5 p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Deskripsi Pekerjaan</h2>
                                <div className="prose max-w-none text-gray-600">
                                    <p className="whitespace-pre-line">{job.description || 'Tidak ada deskripsi'}</p>
                                </div>
                            </div>

                            {/* Requirements */}
                            {job.requirements && (
                                <div className="bg-white rounded-xl shadow-[0_14px_34px_rgba(0,0,0,0.06)] ring-1 ring-black/5 p-6">
                                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Persyaratan</h2>
                                    <div className="prose max-w-none text-gray-600">
                                        <p className="whitespace-pre-line">{job.requirements}</p>
                                    </div>
                                </div>
                            )}

                            {/* Skills */}
                            {job.skills && job.skills.length > 0 && (
                                <div className="bg-white rounded-xl shadow-[0_14px_34px_rgba(0,0,0,0.06)] ring-1 ring-black/5 p-6">
                                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Skills yang Dibutuhkan</h2>
                                    <div className="flex flex-wrap gap-2">
                                        {job.skills.map((skill) => (
                                            <Link
                                                key={skill.id}
                                                href={`/jobs?search=${encodeURIComponent(skill.name)}`}
                                                className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium hover:bg-indigo-200 transition"
                                            >
                                                {skill.name}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-24 space-y-6">
                                {/* Apply Card */}
                                <div className="bg-white rounded-xl shadow-[0_14px_34px_rgba(0,0,0,0.06)] ring-1 ring-black/5 p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Tertarik dengan posisi ini?</h3>
                                    {auth?.user ? (
                                        <Link
                                            href="#"
                                            className="block w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-center rounded-lg hover:from-blue-700 hover:to-indigo-700 font-medium transition shadow-lg shadow-indigo-500/25"
                                        >
                                            Lamar Sekarang
                                        </Link>
                                    ) : (
                                        <>
                                            <Link
                                                href={route('login')}
                                                className="block w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-center rounded-lg hover:from-blue-700 hover:to-indigo-700 font-medium transition shadow-lg shadow-indigo-500/25"
                                            >
                                                Login untuk Melamar
                                            </Link>
                                            <p className="mt-3 text-sm text-gray-500 text-center">
                                                Belum punya akun?{' '}
                                                <Link href={route('register')} className="text-indigo-600 hover:text-indigo-700 font-medium">
                                                    Daftar sekarang
                                                </Link>
                                            </p>
                                        </>
                                    )}
                                </div>

                                {/* Company Card */}
                                <div className="bg-white rounded-xl shadow-[0_14px_34px_rgba(0,0,0,0.06)] ring-1 ring-black/5 p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Tentang Perusahaan</h3>
                                    <div className="flex items-center space-x-3 mb-4">
                                        {job.company?.photo_path ? (
                                            <img
                                                src={`/storage/${job.company.photo_path}`}
                                                alt={job.company.company_name}
                                                className="w-12 h-12 rounded-lg object-cover"
                                            />
                                        ) : (
                                            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                                                <span className="text-white font-bold text-lg">
                                                    {job.company?.company_name?.charAt(0) || '?'}
                                                </span>
                                            </div>
                                        )}
                                        <div>
                                            <p className="font-medium text-gray-900">{job.company?.company_name || 'Unknown'}</p>
                                            {job.company?.industry && (
                                                <p className="text-sm text-gray-500">{job.company.industry}</p>
                                            )}
                                        </div>
                                    </div>

                                    {job.company?.location && (
                                        <div className="flex items-start text-sm text-gray-600 mb-2">
                                            <svg className="w-4 h-4 mr-2 mt-0.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            </svg>
                                            {job.company.location}
                                        </div>
                                    )}

                                    {job.company?.website && (
                                        <div className="flex items-start text-sm text-gray-600 mb-2">
                                            <svg className="w-4 h-4 mr-2 mt-0.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                                            </svg>
                                            <a href={job.company.website} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-700">
                                                {job.company.website}
                                            </a>
                                        </div>
                                    )}

                                    {job.company?.description && (
                                        <p className="mt-4 text-sm text-gray-600 line-clamp-4">
                                            {job.company.description}
                                        </p>
                                    )}
                                </div>

                                {/* Share Card */}
                                <div className="bg-white rounded-xl shadow-[0_14px_34px_rgba(0,0,0,0.06)] ring-1 ring-black/5 p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Bagikan Lowongan</h3>
                                    <div className="flex gap-3">
                                        <button className="flex-1 py-2 px-3 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition text-sm">
                                            Salin Link
                                        </button>
                                        <button className="py-2 px-3 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition">
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <footer className="bg-gray-900 text-white py-8 mt-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <p className="text-gray-400">© 2025 JobPortal. All rights reserved.</p>
                    </div>
                </footer>
            </div>
        </>
    );
}
