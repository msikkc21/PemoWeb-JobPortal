import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, Link } from '@inertiajs/react';

/**
 * Route Integration:
 * 
 * Add this to routes/web.php:
 * Route::get('/admin/companies/{id}', function ($id) {
 *     return Inertia::render('Admin/Companies/Show', [
 *         'auth' => [
 *             'user' => Auth::user(),
 *         ],
 *         'id' => (int) $id
 *     ]);
 * })->middleware(['auth', 'verified'])->name('admin.companies.show');
 * 
 * NOTE: This is a view-only page using mock data, no API calls are made.
 */

export default function CompanyShow({ auth, company = null, jobs = null, id = null }) {
    const { user } = auth || usePage().props.auth || {};
    
    // Mock data for development (will be replaced by real data from the backend)
    const mockCompany = {
        id: id || 1,
        nama_perusahaan: 'Tech Solutions Inc',
        industri: 'Information Technology',
        deskripsi: 'Tech Solutions Inc adalah perusahaan teknologi informasi yang berfokus pada pengembangan solusi perangkat lunak inovatif untuk berbagai industri. Didirikan pada tahun 2010, perusahaan kami telah menjadi pemimpin dalam teknologi cloud, kecerdasan buatan, dan keamanan siber.',
        website: 'https://techsolutions-example.com',
        email_perusahaan: 'hr@techsolutions.com',
        telepon: '021-55667788',
        alamat: 'Jl. Teknologi Raya No. 123, Jakarta Selatan',
        lokasi: 'Jakarta',
        jumlah_karyawan: 250,
        tahun_dibentuk: 2010,
        status: 'pending',
        dibuat_pada: '2025-09-01'
    };

    const mockJobs = [
        { 
            id_lowongan: 1, 
            judul: 'Senior Software Engineer', 
            status: 'dibuka', 
            approve: true,
            tanggal_posting: '2025-09-15' 
        },
        { 
            id_lowongan: 2, 
            judul: 'UI/UX Designer', 
            status: 'dibuka', 
            approve: false,
            tanggal_posting: '2025-09-20' 
        },
        { 
            id_lowongan: 3, 
            judul: 'Project Manager', 
            status: 'ditutup', 
            approve: true,
            tanggal_posting: '2025-08-10' 
        }
    ];

    // Use provided data or fallback to mock data
    const displayCompany = company || mockCompany;
    const displayJobs = jobs || mockJobs;

    // Handle company approval/rejection
    const handleApproveCompany = () => {
        const confirmMessage = `Are you sure you want to approve company ${displayCompany.nama_perusahaan}?`;
        
        if (window.confirm(confirmMessage)) {
            console.log({ action: 'approve', company_id: displayCompany.id });
            // In a real application, this would send a request to the server
        }
    };

    const handleRejectCompany = () => {
        const confirmMessage = `Are you sure you want to reject company ${displayCompany.nama_perusahaan}?`;
        
        if (window.confirm(confirmMessage)) {
            console.log({ action: 'reject', company_id: displayCompany.id });
            // In a real application, this would send a request to the server
        }
    };

    // Helper function to render status badge
    const renderStatusBadge = (status) => {
        let badgeClass = '';
        let statusText = '';
        
        switch (status) {
            case 'pending':
                badgeClass = 'bg-yellow-100 text-yellow-800';
                statusText = 'Pending';
                break;
            case 'approved':
                badgeClass = 'bg-green-100 text-green-800';
                statusText = 'Approved';
                break;
            case 'rejected':
                badgeClass = 'bg-red-100 text-red-800';
                statusText = 'Rejected';
                break;
            default:
                badgeClass = 'bg-gray-100 text-gray-800';
                statusText = status;
        }
        
        return (
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${badgeClass}`}>
                {statusText}
            </span>
        );
    };

    // Admin access guard
    if (user?.role_id !== 1) {
        return (
            <AuthenticatedLayout
                header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Access Restricted</h2>}
            >
                <Head title="Admin - Company Detail" />
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
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        {displayCompany.nama_perusahaan}
                    </h2>
                    <div className="flex space-x-3">
                        {displayCompany.status === 'pending' && (
                            <>
                                <button 
                                    onClick={handleApproveCompany}
                                    className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                                >
                                    Approve
                                </button>
                                <button 
                                    onClick={handleRejectCompany}
                                    className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                >
                                    Tolak
                                </button>
                            </>
                        )}
                        <Link
                            href={route('admin.companies.index')}
                            className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                        >
                            Kembali
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={`Admin - ${displayCompany.nama_perusahaan}`} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {/* Company Information */}
                            <div className="mb-8 border-b border-gray-200 pb-5">
                                <div className="grid gap-6 md:grid-cols-2">
                                    <div>
                                        <h3 className="mb-4 text-lg font-medium leading-6 text-gray-900">Informasi Perusahaan</h3>
                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <div>
                                                <div className="text-sm font-medium text-gray-500">Status</div>
                                                <div className="mt-1">{renderStatusBadge(displayCompany.status)}</div>
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-gray-500">Industri</div>
                                                <div className="mt-1 text-sm text-gray-900">{displayCompany.industri || '-'}</div>
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-gray-500">Website</div>
                                                <div className="mt-1 text-sm text-indigo-600 hover:text-indigo-500">
                                                    {displayCompany.website ? (
                                                        <a href={displayCompany.website} target="_blank" rel="noopener noreferrer">
                                                            {displayCompany.website}
                                                        </a>
                                                    ) : '-'}
                                                </div>
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-gray-500">Email</div>
                                                <div className="mt-1 text-sm text-gray-900">{displayCompany.email_perusahaan || '-'}</div>
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-gray-500">Telepon</div>
                                                <div className="mt-1 text-sm text-gray-900">{displayCompany.telepon || '-'}</div>
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-gray-500">Lokasi</div>
                                                <div className="mt-1 text-sm text-gray-900">{displayCompany.lokasi || '-'}</div>
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-gray-500">Tahun Dibentuk</div>
                                                <div className="mt-1 text-sm text-gray-900">{displayCompany.tahun_dibentuk || '-'}</div>
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-gray-500">Jumlah Karyawan</div>
                                                <div className="mt-1 text-sm text-gray-900">{displayCompany.jumlah_karyawan || '-'}</div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <h3 className="mb-4 text-lg font-medium leading-6 text-gray-900">Alamat</h3>
                                        <div className="text-sm text-gray-900">{displayCompany.alamat || '-'}</div>
                                        
                                        <h3 className="mb-4 mt-6 text-lg font-medium leading-6 text-gray-900">Deskripsi</h3>
                                        <div className="prose text-sm text-gray-900">
                                            {displayCompany.deskripsi ? (
                                                <p>{displayCompany.deskripsi}</p>
                                            ) : (
                                                <p className="italic text-gray-500">Tidak ada deskripsi</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Jobs List */}
                            <div>
                                <h3 className="mb-4 text-lg font-medium leading-6 text-gray-900">Daftar Lowongan</h3>
                                {displayJobs.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200 border">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                        Judul
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                        Status
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                        Approved
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                        Tanggal Posting
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200 bg-white">
                                                {displayJobs.map((job) => (
                                                    <tr key={job.id_lowongan}>
                                                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                                                            {job.judul}
                                                        </td>
                                                        <td className="whitespace-nowrap px-6 py-4 text-sm">
                                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                                                                ${job.status === 'dibuka' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                                                            `}>
                                                                {job.status === 'dibuka' ? 'Dibuka' : 'Ditutup'}
                                                            </span>
                                                        </td>
                                                        <td className="whitespace-nowrap px-6 py-4 text-sm">
                                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                                                                ${job.approve ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
                                                            `}>
                                                                {job.approve ? 'Ya' : 'Tidak'}
                                                            </span>
                                                        </td>
                                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                            {job.tanggal_posting || '-'}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="rounded-md border border-gray-200 py-8 text-center">
                                        <p className="text-gray-500">Belum ada lowongan yang dibuat.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
