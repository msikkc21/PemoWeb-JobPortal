import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState, useEffect, useRef, useCallback } from 'react';

export default function Index({ jobs, filters }) {
    const { auth } = usePage().props;
    const [search, setSearch] = useState(filters?.search || '');
    const [location, setLocation] = useState(filters?.location || '');
    const [jobType, setJobType] = useState(filters?.job_type || '');
    const [isSearching, setIsSearching] = useState(false);
    const debounceTimer = useRef(null);

    // Function to perform search
    const performSearch = useCallback((searchVal, locationVal, jobTypeVal) => {
        setIsSearching(true);
        const params = {};
        if (searchVal) params.search = searchVal;
        if (locationVal) params.location = locationVal;
        if (jobTypeVal) params.job_type = jobTypeVal;

        router.get('/jobs', params, {
            preserveState: true,
            replace: true,
            onFinish: () => setIsSearching(false),
        });
    }, []);

    // Debounced search on input change
    useEffect(() => {
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }

        debounceTimer.current = setTimeout(() => {
            performSearch(search, location, jobType);
        }, 500);

        return () => {
            if (debounceTimer.current) {
                clearTimeout(debounceTimer.current);
            }
        };
    }, [search, location]);

    // Handle form submit (for explicit search)
    const handleSubmit = (e) => {
        e.preventDefault();
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }
        performSearch(search, location, jobType);
    };

    const handleJobTypeFilter = (type) => {
        const newType = jobType === type ? '' : type;
        setJobType(newType);

        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }
        performSearch(search, location, newType);
    };

    const clearFilters = () => {
        setSearch('');
        setLocation('');
        setJobType('');
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }
        router.get('/jobs', {}, {
            preserveState: true,
            replace: true,
        });
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

    return (
        <>
            <Head title="Lowongan Kerja - JobPortal" />

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
                            <Link href="/jobs" className="text-md font-semibold text-indigo-600 transition-all duration-200">
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

                {/* Hero Section - Matching Welcome style */}
                <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-16">
                    <div className="absolute inset-0 -z-10 bg-gradient-to-b from-blue-600/80 to-indigo-600" />
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h1 className="text-4xl font-bold mb-4">Temukan Pekerjaan Impianmu</h1>
                        <p className="text-xl text-blue-100 mb-8">
                            Ribuan lowongan kerja dari perusahaan terbaik menunggumu
                        </p>

                        {/* Search Form */}
                        <form onSubmit={handleSubmit} className="bg-white rounded-xl p-4 shadow-[0_14px_34px_rgba(0,0,0,0.08)] ring-1 ring-black/5">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="md:col-span-2 relative">
                                    <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    <input
                                        type="text"
                                        placeholder="Cari posisi atau kata kunci..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                                    />
                                    {isSearching && (
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                            <svg className="animate-spin w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                        </div>
                                    )}
                                </div>
                                <div className="relative">
                                    <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <input
                                        type="text"
                                        placeholder="Lokasi..."
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                                    />
                                </div>
                                <div>
                                    <button
                                        type="submit"
                                        className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition flex items-center justify-center gap-2"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                        Cari
                                    </button>
                                </div>
                            </div>
                            <div className="mt-4 flex flex-wrap gap-2 items-center">
                                <span className="text-gray-600 text-sm">Tipe:</span>
                                {['full-time', 'part-time', 'contract', 'internship'].map((type) => (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() => handleJobTypeFilter(type)}
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
                                        className="px-3 py-1 text-sm text-red-600 hover:text-red-700 flex items-center gap-1"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                        Reset Filter
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </section>

                {/* Jobs Grid */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">
                            {jobs.total} Lowongan Ditemukan
                        </h2>
                        {(search || location || jobType) && (
                            <div className="text-sm text-gray-500">
                                Filter aktif:
                                {search && <span className="ml-1 px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded">{search}</span>}
                                {location && <span className="ml-1 px-2 py-0.5 bg-green-100 text-green-700 rounded">{location}</span>}
                                {jobType && <span className="ml-1 px-2 py-0.5 bg-purple-100 text-purple-700 rounded">{jobTypeLabels[jobType]}</span>}
                            </div>
                        )}
                    </div>

                    {jobs.data && jobs.data.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {jobs.data.map((job) => (
                                <Link
                                    key={job.id}
                                    href={`/jobs/${job.id}`}
                                    className="bg-white rounded-xl shadow-[0_14px_34px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] transition-shadow p-6 border border-gray-100 ring-1 ring-black/5"
                                >
                                    <div className="flex items-start space-x-4">
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
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-lg font-semibold text-gray-900 truncate">
                                                {job.title}
                                            </h3>
                                            <p className="text-indigo-600 text-sm font-medium">
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
                                            <span className="px-2.5 py-1 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-full">
                                                {jobTypeLabels[job.job_type] || job.job_type}
                                            </span>
                                        )}
                                        {job.job_level && (
                                            <span className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                                                {job.job_level}
                                            </span>
                                        )}
                                    </div>

                                    <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                                        <span className="text-gray-400 text-sm">
                                            {timeAgo(job.posted_date || job.created_at)}
                                        </span>
                                        <span className="text-indigo-600 text-sm font-medium group-hover:translate-x-1 transition">
                                            Lihat Detail →
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <h3 className="mt-2 text-sm font-medium text-gray-900">Tidak ada lowongan</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                {search || location || jobType
                                    ? 'Coba ubah filter pencarian Anda'
                                    : 'Belum ada lowongan yang tersedia'}
                            </p>
                            {(search || location || jobType) && (
                                <button
                                    onClick={clearFilters}
                                    className="mt-4 px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-700"
                                >
                                    Reset semua filter
                                </button>
                            )}
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
                                        className={`px-4 py-2 text-sm rounded-lg transition ${link.active
                                            ? 'bg-indigo-600 text-white'
                                            : link.url
                                                ? 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
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
