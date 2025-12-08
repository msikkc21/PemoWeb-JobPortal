import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ jobs, filters }) {
    const { auth } = usePage().props;
    const [search, setSearch] = useState(filters?.search || '');
    const [location, setLocation] = useState(filters?.location || '');
    const [jobType, setJobType] = useState(filters?.job_type || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('jobs.index'), {
            search,
            location,
            job_type: jobType,
        }, { preserveState: true });
    };

    const clearFilters = () => {
        setSearch('');
        setLocation('');
        setJobType('');
        router.get(route('jobs.index'));
    };

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

    const timeAgo = (dateString) => {
        if (!dateString) return 'Baru saja';
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Hari ini';
        if (diffDays === 1) return 'Kemarin';
        if (diffDays < 7) return `${diffDays} hari lalu`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} minggu lalu`;
        return `${Math.floor(diffDays / 30)} bulan lalu`;
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
            <Head title="Lowongan Kerja" />

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
                                {auth?.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="text-gray-700 hover:text-indigo-600"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={route('login')}
                                            className="text-gray-700 hover:text-indigo-600"
                                        >
                                            Login
                                        </Link>
                                        <Link
                                            href={route('register')}
                                            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                                        >
                                            Daftar
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Hero Section */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h1 className="text-4xl font-bold mb-4">Temukan Pekerjaan Impianmu</h1>
                        <p className="text-xl text-indigo-100 mb-8">
                            Ribuan lowongan kerja dari perusahaan terbaik menunggumu
                        </p>

                        {/* Search Form */}
                        <form onSubmit={handleSearch} className="bg-white rounded-lg p-4 shadow-lg">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="md:col-span-2">
                                    <input
                                        type="text"
                                        placeholder="Cari posisi atau kata kunci..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                                    />
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Lokasi..."
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                                    />
                                </div>
                                <div>
                                    <button
                                        type="submit"
                                        className="w-full px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-medium"
                                    >
                                        Cari Lowongan
                                    </button>
                                </div>
                            </div>
                            <div className="mt-4 flex flex-wrap gap-2 items-center">
                                <span className="text-gray-600 text-sm">Tipe:</span>
                                {['full-time', 'part-time', 'contract', 'internship'].map((type) => (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() => setJobType(jobType === type ? '' : type)}
                                        className={`px-3 py-1 text-sm rounded-full border transition ${jobType === type
                                                ? 'bg-indigo-600 text-white border-indigo-600'
                                                : 'bg-white text-gray-600 border-gray-300 hover:border-indigo-300'
                                            }`}
                                    >
                                        {jobTypeLabels[type] || type}
                                    </button>
                                ))}
                                {(search || location || jobType) && (
                                    <button
                                        type="button"
                                        onClick={clearFilters}
                                        className="px-3 py-1 text-sm text-red-600 hover:text-red-700"
                                    >
                                        Reset Filter
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>

                {/* Jobs Grid */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">
                            {jobs.total} Lowongan Ditemukan
                        </h2>
                    </div>

                    {jobs.data && jobs.data.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {jobs.data.map((job) => (
                                <Link
                                    key={job.id}
                                    href={route('jobs.show', job.id)}
                                    className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100"
                                >
                                    <div className="flex items-start space-x-4">
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
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-lg font-semibold text-gray-900 truncate">
                                                {job.title}
                                            </h3>
                                            <p className="text-indigo-600 text-sm">
                                                {job.company?.company_name || 'Unknown Company'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-4 space-y-2">
                                        {job.location && (
                                            <div className="flex items-center text-gray-500 text-sm">
                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                {job.location}
                                            </div>
                                        )}
                                        <div className="flex items-center text-gray-500 text-sm">
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            {formatSalary(job.salary_min, job.salary_max, job.currency)}
                                        </div>
                                    </div>

                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {job.job_type && (
                                            <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full">
                                                {jobTypeLabels[job.job_type] || job.job_type}
                                            </span>
                                        )}
                                        {job.job_level && (
                                            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                                                {job.job_level}
                                            </span>
                                        )}
                                    </div>

                                    <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                                        <span className="text-gray-400 text-sm">
                                            {timeAgo(job.posted_date || job.created_at)}
                                        </span>
                                        <span className="text-indigo-600 text-sm font-medium">
                                            Lihat Detail →
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <h3 className="mt-2 text-sm font-medium text-gray-900">Tidak ada lowongan</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                Coba ubah filter pencarian Anda
                            </p>
                        </div>
                    )}

                    {/* Pagination */}
                    {jobs.links && jobs.links.length > 3 && (
                        <div className="mt-8 flex justify-center">
                            <nav className="flex space-x-2">
                                {jobs.links.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.url || '#'}
                                        className={`px-4 py-2 text-sm rounded-md ${link.active
                                                ? 'bg-indigo-600 text-white'
                                                : link.url
                                                    ? 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </nav>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <footer className="bg-gray-900 text-white py-8">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <p className="text-gray-400">© 2025 JobPortal. All rights reserved.</p>
                    </div>
                </footer>
            </div>
        </>
    );
}
