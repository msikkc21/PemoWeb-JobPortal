import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

/**
 * Route Integration:
 * 
 * Add this to routes/web.php:
 * Route::get('/admin/jobs', function () {
 *     return Inertia::render('Admin/Jobs/Index', [
 *         'auth' => [
 *             'user' => Auth::user(),
 *         ],
 *     ]);
 * })->middleware(['auth', 'verified'])->name('admin.jobs.index');
 * 
 * NOTE: This is a view-only page using mock data, no API calls are made.
 */

export default function JobsIndex({ auth, jobs = null, meta = null, filters = {} }) {
    // Mock data for development (will be replaced by real data from the backend)
    const mockJobs = [
        {
            id_lowongan: 1,
            judul: 'Frontend Developer',
            perusahaan: 'PT Teknologi Indonesia',
            lokasi: 'Jakarta Selatan',
            gaji: '10,000,000 - 15,000,000',
            status: 'dibuka',
            approve: false, // pending
            tanggal_posting: '2025-09-01',
            created_at: '2025-09-01'
        },
        {
            id_lowongan: 2,
            judul: 'Backend Developer',
            perusahaan: 'PT Solusi Digital',
            lokasi: 'Jakarta Pusat',
            gaji: '12,000,000 - 18,000,000',
            status: 'dibuka',
            approve: true, // approved
            tanggal_posting: '2025-09-02',
            created_at: '2025-09-02'
        },
        {
            id_lowongan: 3,
            judul: 'UI/UX Designer',
            perusahaan: 'PT Kreasi Media',
            lokasi: 'Bandung',
            gaji: '8,000,000 - 12,000,000',
            status: 'ditutup',
            approve: true, // closed
            tanggal_posting: '2025-09-03',
            created_at: '2025-09-03'
        },
        {
            id_lowongan: 4,
            judul: 'Data Analyst',
            perusahaan: 'PT Data Insight',
            lokasi: 'Surabaya',
            gaji: null, // no salary listed
            status: 'dibuka',
            approve: null, // rejected
            tanggal_posting: '2025-09-04',
            created_at: '2025-09-04'
        },
        {
            id_lowongan: 5,
            judul: 'Product Manager',
            perusahaan: 'PT Inovasi Maju',
            lokasi: 'Jakarta Utara',
            gaji: '15,000,000 - 25,000,000',
            status: 'dibuka',
            approve: true, // approved
            tanggal_posting: '2025-09-05',
            created_at: '2025-09-05'
        },
        {
            id_lowongan: 6,
            judul: 'DevOps Engineer',
            perusahaan: 'PT Cloud Solutions',
            lokasi: 'Remote',
            gaji: '18,000,000 - 25,000,000',
            status: 'dibuka',
            approve: true, // approved
            tanggal_posting: '2025-09-06',
            created_at: '2025-09-06'
        },
        {
            id_lowongan: 7,
            judul: 'Mobile Developer',
            perusahaan: 'PT Mobile Tech',
            lokasi: 'Yogyakarta',
            gaji: '10,000,000 - 15,000,000',
            status: 'dibuka',
            approve: false, // pending
            tanggal_posting: '2025-09-07',
            created_at: '2025-09-07'
        },
        {
            id_lowongan: 8,
            judul: 'QA Engineer',
            perusahaan: 'PT Quality System',
            lokasi: 'Jakarta Selatan',
            gaji: '8,000,000 - 12,000,000',
            status: 'ditutup',
            approve: true, // closed
            tanggal_posting: '2025-09-08',
            created_at: '2025-09-08'
        },
    ];

    const mockMeta = {
        page: 1,
        perPage: 10,
        total: mockJobs.length
    };

    // Use provided data or fallback to mock data
    const displayJobs = jobs || mockJobs;
    const displayMeta = meta || mockMeta;

    // Filter state
    const [searchQuery, setSearchQuery] = useState(filters.q || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || 'all');
    const [perusahaanFilter, setPerusahaanFilter] = useState(filters.perusahaan || '');

    // Handle search and filter
    const handleSearch = (e) => {
        e.preventDefault();
        console.log({ q: searchQuery, status: statusFilter, perusahaan: perusahaanFilter });
        // In a real application, this would trigger a request to the server
    };

    // Reset filters
    const handleReset = () => {
        setSearchQuery('');
        setStatusFilter('all');
        setPerusahaanFilter('');
        console.log('Filters reset');
    };

    // Handle pagination
    const handlePrevPage = () => {
        console.log('prev');
        // In a real application, this would navigate to the previous page
    };

    const handleNextPage = () => {
        console.log('next');
        // In a real application, this would navigate to the next page
    };

    // Handle job actions
    const handleDeactivateJob = (id, judul) => {
        if (window.confirm(`Apakah Anda yakin ingin menonaktifkan lowongan "${judul}"?`)) {
            console.log({ action: 'deactivate', id_lowongan: id });
            // In a real application, this would send a request to the server
        }
    };

    const handleDeleteJob = (id, judul) => {
        if (window.confirm(`Apakah Anda yakin ingin menghapus lowongan "${judul}"?\nTindakan ini tidak dapat dibatalkan.`)) {
            console.log({ action: 'delete', id_lowongan: id });
            // In a real application, this would send a request to the server
        }
    };

    // Helper function to render status badge
    const renderStatusBadge = (job) => {
        let badgeClass = '';
        let statusText = '';
        
        if (job.approve === false) {
            badgeClass = 'bg-yellow-100 text-yellow-800';
            statusText = 'Pending';
        } else if (job.approve === null) {
            badgeClass = 'bg-red-100 text-red-800';
            statusText = 'Rejected';
        } else if (job.status === 'ditutup') {
            badgeClass = 'bg-gray-100 text-gray-800';
            statusText = 'Closed';
        } else if (job.approve === true) {
            badgeClass = 'bg-green-100 text-green-800';
            statusText = 'Approved';
        } else {
            badgeClass = 'bg-blue-100 text-blue-800';
            statusText = job.status;
        }
        
        return (
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${badgeClass}`}>
                {statusText}
            </span>
        );
    };

    // Calculate total pages for pagination
    const totalPages = Math.ceil(displayMeta.total / displayMeta.perPage);

    // Admin access guard
    if (auth?.user?.role_id !== 1) {
        return (
            <AuthenticatedLayout
                header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Access Restricted</h2>}
            >
                <Head title="Admin - All Jobs" />
                <div className="py-12">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 text-gray-900">
                                Akses terbatas (Admin saja)
                            </div>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">Admin - Semua Lowongan</h2>
                    <div>
                        <Link
                            href={route('admin.jobs.pending')}
                            className="bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500 focus:ring-offset-2 focus:outline-none focus:ring-2 rounded-md px-4 py-2 text-sm font-medium text-white"
                        >
                            Pending Review ({displayJobs.filter(job => job.approve === false).length})
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="Admin - All Jobs" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {/* Search and Filters */}
                            <div className="mb-6">
                                <form onSubmit={handleSearch} className="grid gap-4 md:grid-cols-4">
                                    <div>
                                        <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                                            Cari Judul
                                        </label>
                                        <input
                                            type="text"
                                            id="search"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                            aria-label="Search by job title"
                                        />
                                    </div>
                                    
                                    <div>
                                        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                                            Status
                                        </label>
                                        <select
                                            id="status"
                                            value={statusFilter}
                                            onChange={(e) => setStatusFilter(e.target.value)}
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                            aria-label="Filter by status"
                                        >
                                            <option value="all">Semua Status</option>
                                            <option value="pending">Pending</option>
                                            <option value="approved">Approved</option>
                                            <option value="rejected">Rejected</option>
                                            <option value="closed">Closed</option>
                                        </select>
                                    </div>
                                    
                                    <div>
                                        <label htmlFor="perusahaan" className="block text-sm font-medium text-gray-700 mb-1">
                                            Perusahaan
                                        </label>
                                        <input
                                            type="text"
                                            id="perusahaan"
                                            value={perusahaanFilter}
                                            onChange={(e) => setPerusahaanFilter(e.target.value)}
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                            aria-label="Filter by company"
                                        />
                                    </div>
                                    
                                    <div className="flex items-end space-x-2">
                                        <button 
                                            type="submit"
                                            className="bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none focus:ring-2 rounded-md px-4 py-2 text-sm font-medium text-white"
                                        >
                                            Cari
                                        </button>
                                        <button 
                                            type="button"
                                            onClick={handleReset}
                                            className="bg-gray-200 hover:bg-gray-300 focus:ring-gray-500 focus:ring-offset-2 focus:outline-none focus:ring-2 rounded-md px-4 py-2 text-sm font-medium text-gray-700"
                                        >
                                            Reset
                                        </button>
                                    </div>
                                </form>
                            </div>
                            
                            {/* Jobs Table */}
                            {displayJobs.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200 border">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    No
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Judul
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Perusahaan
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Lokasi
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Gaji
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Status
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Dibuat
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Aksi
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {displayJobs.map((job, index) => (
                                                <tr key={job.id_lowongan}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {(displayMeta.page - 1) * displayMeta.perPage + index + 1}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        {job.judul}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {job.perusahaan}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {job.lokasi || '-'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {job.gaji || '-'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                        {renderStatusBadge(job)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {job.created_at}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                        <div className="flex space-x-2">
                                                            <Link
                                                                href={route('admin.jobs.show', { id: job.id_lowongan })}
                                                                className="bg-blue-500 hover:bg-blue-600 px-2 py-1 rounded text-xs font-medium text-white"
                                                                aria-label={`Lihat detail lowongan ${job.judul}`}
                                                            >
                                                                Detail
                                                            </Link>
                                                            
                                                            {job.approve === true && job.status === 'dibuka' && (
                                                                <button
                                                                    onClick={() => handleDeactivateJob(job.id_lowongan, job.judul)}
                                                                    className="bg-gray-500 hover:bg-gray-600 px-2 py-1 rounded text-xs font-medium text-white"
                                                                    aria-label={`Nonaktifkan lowongan ${job.judul}`}
                                                                >
                                                                    Nonaktifkan
                                                                </button>
                                                            )}
                                                            
                                                            <button
                                                                onClick={() => handleDeleteJob(job.id_lowongan, job.judul)}
                                                                className="bg-red-500 hover:bg-red-600 px-2 py-1 rounded text-xs font-medium text-white"
                                                                aria-label={`Hapus lowongan ${job.judul}`}
                                                            >
                                                                Hapus
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-lg font-medium text-gray-700">Tidak ada data lowongan</p>
                                    <p className="text-sm text-gray-500">Coba ubah filter atau cek kembali nanti.</p>
                                </div>
                            )}
                            
                            {/* Pagination */}
                            {displayJobs.length > 0 && (
                                <div className="flex items-center justify-between mt-4">
                                    <div>
                                        <p className="text-sm text-gray-700">
                                            Menampilkan {displayMeta.page} dari {totalPages} halaman
                                        </p>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={handlePrevPage}
                                            disabled={displayMeta.page <= 1}
                                            className={`px-4 py-2 text-sm font-medium rounded-md
                                                ${displayMeta.page <= 1
                                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}
                                            `}
                                        >
                                            Previous
                                        </button>
                                        <button
                                            onClick={handleNextPage}
                                            disabled={displayMeta.page >= totalPages}
                                            className={`px-4 py-2 text-sm font-medium rounded-md
                                                ${displayMeta.page >= totalPages
                                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}
                                            `}
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
