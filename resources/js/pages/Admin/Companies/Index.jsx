import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, Link } from '@inertiajs/react';

/**
 * Route Integration:
 * 
 * Add this to routes/web.php:
 * Route::get('/admin/companies', function () {
 *     return Inertia::render('Admin/Companies/Index', [
 *         'auth' => [
 *             'user' => Auth::user(),
 *         ],
 *     ]);
 * })->middleware(['auth', 'verified'])->name('admin.companies.index');
 * 
 * NOTE: This is a view-only page using mock data, no API calls are made.
 */

export default function CompaniesIndex({ auth, companies = null, meta = null, filters = {} }) {
    const { user } = auth || usePage().props.auth || {};
    
    // Mock data for development (will be replaced by real data from the backend)
    const mockCompanies = [
        { 
            id: 1, 
            nama_perusahaan: 'Tech Solutions Inc', 
            industri: 'Information Technology', 
            email_perusahaan: 'hr@techsolutions.com', 
            lokasi: 'Jakarta',
            status: 'approved',  
            dibuat_pada: '2025-09-01' 
        },
        { 
            id: 2, 
            nama_perusahaan: 'Global Finance Group', 
            industri: 'Financial Services', 
            email_perusahaan: 'careers@gfgroup.com', 
            lokasi: 'Surabaya',
            status: 'pending',  
            dibuat_pada: '2025-09-05' 
        },
        { 
            id: 3, 
            nama_perusahaan: 'GreenLife Organics', 
            industri: 'Agriculture', 
            email_perusahaan: 'jobs@greenlife.id', 
            lokasi: 'Bandung',
            status: 'pending',  
            dibuat_pada: '2025-09-10' 
        },
        { 
            id: 4, 
            nama_perusahaan: 'Modern Healthcare', 
            industri: 'Healthcare', 
            email_perusahaan: 'hiring@modernhealth.co.id', 
            lokasi: 'Yogyakarta',
            status: 'rejected',  
            dibuat_pada: '2025-09-12' 
        },
        { 
            id: 5, 
            nama_perusahaan: 'Construction Experts', 
            industri: 'Construction', 
            email_perusahaan: 'info@constructionexperts.com', 
            lokasi: 'Jakarta',
            status: 'approved',  
            dibuat_pada: '2025-09-15' 
        },
        { 
            id: 6, 
            nama_perusahaan: 'Retail Giants', 
            industri: 'Retail', 
            email_perusahaan: 'careers@retailgiants.com', 
            lokasi: 'Medan',
            status: 'inactive',  
            dibuat_pada: '2025-09-18' 
        },
        { 
            id: 7, 
            nama_perusahaan: 'Education First', 
            industri: 'Education', 
            email_perusahaan: 'jobs@educationfirst.edu', 
            lokasi: 'Bandung',
            status: 'approved',  
            dibuat_pada: '2025-09-20' 
        },
        { 
            id: 8, 
            nama_perusahaan: 'Logistics Pro', 
            industri: 'Logistics', 
            email_perusahaan: 'hr@logisticspro.co.id', 
            lokasi: 'Surabaya',
            status: 'approved',  
            dibuat_pada: '2025-09-22' 
        },
    ];

    const mockMeta = {
        page: 1,
        perPage: 10,
        total: mockCompanies.length
    };

    // Use provided data or fallback to mock data
    const displayCompanies = companies || mockCompanies;
    const displayMeta = meta || mockMeta;

    // Filter state
    const [searchQuery, setSearchQuery] = useState(filters.q || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || 'all');
    const [industriFilter, setIndustriFilter] = useState(filters.industri || 'all');

    // Handle search and filter
    const handleSearch = (e) => {
        e.preventDefault();
        console.log({ q: searchQuery, status: statusFilter, industri: industriFilter });
        // In a real application, this would trigger a request to the server
    };

    // Reset filters
    const handleReset = () => {
        setSearchQuery('');
        setStatusFilter('all');
        setIndustriFilter('all');
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

    // Handle company actions
    const handleToggleStatus = (id, currentStatus, name) => {
        const action = currentStatus === 'inactive' ? 'activate' : 'deactivate';
        const confirmMessage = `Are you sure you want to ${action} company ${name}?`;
        
        if (window.confirm(confirmMessage)) {
            console.log({ action, id_company: id });
            // In a real application, this would send a request to the server
        }
    };

    const handleApproveCompany = (id, name) => {
        const confirmMessage = `Are you sure you want to approve company ${name}?`;
        
        if (window.confirm(confirmMessage)) {
            console.log({ action: 'approve', id_company: id });
            // In a real application, this would send a request to the server
        }
    };

    const handleRejectCompany = (id, name) => {
        const confirmMessage = `Are you sure you want to reject company ${name}?`;
        
        if (window.confirm(confirmMessage)) {
            console.log({ action: 'reject', id_company: id });
            // In a real application, this would send a request to the server
        }
    };

    // Helper function to render status badge
    const renderStatusBadge = (status) => {
        let badgeClass = '';
        let statusText = '';
        
        switch (status) {
            case 'approved':
                badgeClass = 'bg-green-100 text-green-800';
                statusText = 'Approved';
                break;
            case 'pending':
                badgeClass = 'bg-yellow-100 text-yellow-800';
                statusText = 'Pending';
                break;
            case 'rejected':
                badgeClass = 'bg-red-100 text-red-800';
                statusText = 'Rejected';
                break;
            case 'inactive':
                badgeClass = 'bg-gray-100 text-gray-800';
                statusText = 'Inactive';
                break;
            default:
                badgeClass = 'bg-blue-100 text-blue-800';
                statusText = status;
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
    if (user?.role_id !== 1) {
        return (
            <AuthenticatedLayout
                header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Access Restricted</h2>}
            >
                <Head title="Admin - Companies" />
                <div className="py-12">
                    <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
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
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">Admin - Companies</h2>
                    <div>
                        <Link
                            href={route('admin.companies.pending')}
                            className="rounded-md bg-yellow-600 px-4 py-2 text-sm font-medium text-white hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
                        >
                            Pending Review
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="Admin - Companies" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {/* Search and Filters */}
                            <div className="mb-6">
                                <form onSubmit={handleSearch} className="grid gap-4 md:grid-cols-4">
                                    <div>
                                        <label htmlFor="search" className="mb-1 block text-sm font-medium text-gray-700">
                                            Cari Nama / Email
                                        </label>
                                        <input
                                            type="text"
                                            id="search"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                            aria-label="Search by name or email"
                                        />
                                    </div>
                                    
                                    <div>
                                        <label htmlFor="status" className="mb-1 block text-sm font-medium text-gray-700">
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
                                            <option value="approved">Approved</option>
                                            <option value="pending">Pending</option>
                                            <option value="rejected">Rejected</option>
                                            <option value="inactive">Inactive</option>
                                        </select>
                                    </div>
                                    
                                    <div>
                                        <label htmlFor="industri" className="mb-1 block text-sm font-medium text-gray-700">
                                            Industri
                                        </label>
                                        <select
                                            id="industri"
                                            value={industriFilter}
                                            onChange={(e) => setIndustriFilter(e.target.value)}
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                            aria-label="Filter by industry"
                                        >
                                            <option value="all">Semua Industri</option>
                                            <option value="Information Technology">Information Technology</option>
                                            <option value="Financial Services">Financial Services</option>
                                            <option value="Healthcare">Healthcare</option>
                                            <option value="Agriculture">Agriculture</option>
                                            <option value="Manufacturing">Manufacturing</option>
                                            <option value="Construction">Construction</option>
                                            <option value="Retail">Retail</option>
                                            <option value="Education">Education</option>
                                        </select>
                                    </div>
                                    
                                    <div className="flex items-end space-x-2">
                                        <button 
                                            type="submit"
                                            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                        >
                                            Cari
                                        </button>
                                        <button 
                                            type="button"
                                            onClick={handleReset}
                                            className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                                        >
                                            Reset
                                        </button>
                                    </div>
                                </form>
                            </div>
                            
                            {/* Companies Table */}
                            {displayCompanies.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200 border">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                    No
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                    Nama Perusahaan
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                    Industri
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                    Email
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                    Lokasi
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                    Status
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                    Dibuat
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                    Aksi
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 bg-white">
                                            {displayCompanies.map((company, index) => (
                                                <tr key={company.id}>
                                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                        {(displayMeta.page - 1) * displayMeta.perPage + index + 1}
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                                                        {company.nama_perusahaan}
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                        {company.industri || '-'}
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                        {company.email_perusahaan || '-'}
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                        {company.lokasi || '-'}
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                                                        {renderStatusBadge(company.status)}
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                        {company.dibuat_pada}
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                                                        <div className="flex space-x-2">
                                                            <Link
                                                                href={route('admin.companies.show', { id: company.id })}
                                                                className="rounded bg-blue-500 px-2 py-1 text-xs font-medium text-white hover:bg-blue-600"
                                                                aria-label={`Lihat detail perusahaan ${company.nama_perusahaan}`}
                                                            >
                                                                Detail
                                                            </Link>
                                                            
                                                            {company.status === 'pending' && (
                                                                <>
                                                                    <button
                                                                        onClick={() => handleApproveCompany(company.id, company.nama_perusahaan)}
                                                                        className="rounded bg-green-500 px-2 py-1 text-xs font-medium text-white hover:bg-green-600"
                                                                        aria-label={`Approve perusahaan ${company.nama_perusahaan}`}
                                                                    >
                                                                        Approve
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleRejectCompany(company.id, company.nama_perusahaan)}
                                                                        className="rounded bg-red-500 px-2 py-1 text-xs font-medium text-white hover:bg-red-600"
                                                                        aria-label={`Tolak perusahaan ${company.nama_perusahaan}`}
                                                                    >
                                                                        Tolak
                                                                    </button>
                                                                </>
                                                            )}

                                                            {company.status !== 'pending' && (
                                                                <button
                                                                    onClick={() => handleToggleStatus(company.id, company.status, company.nama_perusahaan)}
                                                                    className={`rounded px-2 py-1 text-xs font-medium text-white hover:opacity-80
                                                                        ${company.status === 'inactive' ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-500 hover:bg-gray-600'}
                                                                    `}
                                                                    aria-label={`${company.status === 'inactive' ? 'Aktifkan' : 'Nonaktifkan'} perusahaan ${company.nama_perusahaan}`}
                                                                >
                                                                    {company.status === 'inactive' ? 'Aktifkan' : 'Nonaktifkan'}
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="py-8 text-center">
                                    <p className="text-lg font-medium text-gray-700">Tidak ada data perusahaan.</p>
                                    <p className="text-sm text-gray-500">Coba ubah filter atau cek kembali nanti.</p>
                                </div>
                            )}
                            
                            {/* Pagination */}
                            {displayCompanies.length > 0 && (
                                <div className="mt-4 flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-700">
                                            Halaman {displayMeta.page} dari {totalPages}
                                        </p>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={handlePrevPage}
                                            disabled={displayMeta.page <= 1}
                                            className={`rounded-md px-4 py-2 text-sm font-medium
                                                ${displayMeta.page <= 1
                                                    ? 'cursor-not-allowed bg-gray-100 text-gray-400'
                                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}
                                            `}
                                        >
                                            Prev
                                        </button>
                                        <button
                                            onClick={handleNextPage}
                                            disabled={displayMeta.page >= totalPages}
                                            className={`rounded-md px-4 py-2 text-sm font-medium
                                                ${displayMeta.page >= totalPages
                                                    ? 'cursor-not-allowed bg-gray-100 text-gray-400'
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
