import { Head, Link, usePage } from '@inertiajs/react';

export default function Show({ job }) {
    const { auth } = usePage().props;

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
                {/* Header */}
                <header className="bg-white shadow">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <Link href="/" className="text-2xl font-bold text-indigo-600">
                                    JobPortal
                                </Link>
                            </div>
                            <div className="flex items-center space-x-4">
                                <Link
                                    href={route('jobs.index')}
                                    className="text-gray-700 hover:text-indigo-600"
                                >
                                    ← Kembali ke Daftar
                                </Link>
                                {auth?.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="text-gray-700 hover:text-indigo-600"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <Link
                                        href={route('login')}
                                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                                    >
                                        Login
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Job Details */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Job Header */}
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <div className="flex items-start space-x-4">
                                    {job.company?.photo_path ? (
                                        <img
                                            src={`/storage/${job.company.photo_path}`}
                                            alt={job.company.company_name}
                                            className="w-16 h-16 rounded-lg object-cover"
                                        />
                                    ) : (
                                        <div className="w-16 h-16 rounded-lg bg-indigo-100 flex items-center justify-center">
                                            <span className="text-indigo-600 font-bold text-2xl">
                                                {job.company?.company_name?.charAt(0) || '?'}
                                            </span>
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
                                        <p className="text-lg text-indigo-600">{job.company?.company_name || 'Unknown Company'}</p>
                                        <div className="mt-2 flex flex-wrap gap-2">
                                            {job.job_type && (
                                                <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-sm rounded-full">
                                                    {jobTypeLabels[job.job_type] || job.job_type}
                                                </span>
                                            )}
                                            {job.job_level && (
                                                <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                                                    {job.job_level}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Lokasi</p>
                                        <p className="font-medium text-gray-900">{job.location || '-'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Gaji</p>
                                        <p className="font-medium text-gray-900">
                                            {formatSalary(job.salary_min, job.salary_max, job.currency)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Diposting</p>
                                        <p className="font-medium text-gray-900">{formatDate(job.posted_date || job.created_at)}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Batas Lamaran</p>
                                        <p className="font-medium text-gray-900">{formatDate(job.expiry_date) || 'Belum ditentukan'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Deskripsi Pekerjaan</h2>
                                <div className="prose max-w-none text-gray-600">
                                    <p className="whitespace-pre-line">{job.description || 'Tidak ada deskripsi'}</p>
                                </div>
                            </div>

                            {/* Requirements */}
                            {job.requirements && (
                                <div className="bg-white rounded-lg shadow-sm p-6">
                                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Persyaratan</h2>
                                    <div className="prose max-w-none text-gray-600">
                                        <p className="whitespace-pre-line">{job.requirements}</p>
                                    </div>
                                </div>
                            )}

                            {/* Skills */}
                            {job.skills && job.skills.length > 0 && (
                                <div className="bg-white rounded-lg shadow-sm p-6">
                                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Skills yang Dibutuhkan</h2>
                                    <div className="flex flex-wrap gap-2">
                                        {job.skills.map((skill) => (
                                            <span
                                                key={skill.id}
                                                className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium"
                                            >
                                                {skill.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-8 space-y-6">
                                {/* Apply Card */}
                                <div className="bg-white rounded-lg shadow-sm p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Tertarik dengan posisi ini?</h3>
                                    {auth?.user ? (
                                        <Link
                                            href="#"
                                            className="block w-full py-3 px-4 bg-indigo-600 text-white text-center rounded-md hover:bg-indigo-700 font-medium transition"
                                        >
                                            Lamar Sekarang
                                        </Link>
                                    ) : (
                                        <>
                                            <Link
                                                href={route('login')}
                                                className="block w-full py-3 px-4 bg-indigo-600 text-white text-center rounded-md hover:bg-indigo-700 font-medium transition"
                                            >
                                                Login untuk Melamar
                                            </Link>
                                            <p className="mt-3 text-sm text-gray-500 text-center">
                                                Belum punya akun?{' '}
                                                <Link href={route('register')} className="text-indigo-600 hover:text-indigo-700">
                                                    Daftar sekarang
                                                </Link>
                                            </p>
                                        </>
                                    )}
                                </div>

                                {/* Company Card */}
                                <div className="bg-white rounded-lg shadow-sm p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Tentang Perusahaan</h3>
                                    <div className="flex items-center space-x-3 mb-4">
                                        {job.company?.photo_path ? (
                                            <img
                                                src={`/storage/${job.company.photo_path}`}
                                                alt={job.company.company_name}
                                                className="w-12 h-12 rounded-lg object-cover"
                                            />
                                        ) : (
                                            <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center">
                                                <span className="text-indigo-600 font-bold text-lg">
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
                                            <svg className="w-4 h-4 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            </svg>
                                            {job.company.location}
                                        </div>
                                    )}

                                    {job.company?.website && (
                                        <div className="flex items-start text-sm text-gray-600 mb-2">
                                            <svg className="w-4 h-4 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
