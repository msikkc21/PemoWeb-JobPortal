import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';

/**
 * Route Integration:
 * 
 * Add this to routes/web.php:
 * Route::get('/admin/jobs/{id}', function ($id) {
 *     return Inertia::render('Admin/Jobs/Show', [
 *         'auth' => [
 *             'user' => Auth::user(),
 *         ],
 *         'id' => (int) $id
 *     ]);
 * })->middleware(['auth', 'verified'])->name('admin.jobs.show');
 * 
 * NOTE: This is a view-only page using mock data, no API calls are made.
 */

export default function JobShow({ auth, job = null, id = null }) {
    const { user } = auth || usePage().props.auth || {};
    const jobId = id || Number(new URL(window.location.href).pathname.split('/').pop());
    
    // Mock data for development (will be replaced by real data from the backend)
    const mockJob = {
        id_lowongan: jobId || 1,
        judul: 'Senior Frontend Developer',
        deskripsi: `
            <p>PT Teknologi Indonesia sedang mencari kandidat yang berpengalaman sebagai Frontend Developer untuk bergabung dengan tim pengembangan kami.</p>
            <p>Sebagai Senior Frontend Developer, Anda akan bertanggung jawab untuk membangun dan memelihara aplikasi web yang responsif dan interaktif menggunakan teknologi modern.</p>
            <p>Posisi ini menawarkan kesempatan untuk bekerja pada proyek-proyek inovatif dan berdampak tinggi dalam industri teknologi.</p>
        `,
        persyaratan: [
            'Pengalaman 3+ tahun sebagai Frontend Developer',
            'Mahir dalam JavaScript, HTML5, dan CSS3',
            'Pengalaman dengan framework modern seperti React, Vue, atau Angular',
            'Kemampuan komunikasi yang baik dan mampu bekerja dalam tim',
            'Gelar sarjana di bidang Ilmu Komputer atau bidang terkait (diutamakan)',
            'Portfolio yang menunjukkan proyek-proyek sebelumnya'
        ],
        perusahaan: {
            id: 5,
            nama: 'PT Teknologi Indonesia'
        },
        lokasi: 'Jakarta Selatan (On-site)',
        gaji: 'Rp 10,000,000 - 15,000,000 per bulan',
        jenis_pekerjaan: 'Full-time',
        level_pekerjaan: 'Senior',
        status: 'dibuka',
        approve: false,
        tanggal_posting: '2025-09-01',
        tanggal_berakhir: '2025-10-01',
        created_at: '2025-09-01',
        updated_at: '2025-09-01'
    };
    
    // Use provided job data or fallback to mock data
    const displayJob = job || mockJob;

    // Handle job approval or rejection
    const handleApproveJob = () => {
        if (window.confirm(`Apakah Anda yakin ingin menyetujui lowongan "${displayJob.judul}"?`)) {
            console.log({ action: 'approve', id_lowongan: displayJob.id_lowongan });
            // In a real application, this would send a request to the server
        }
    };

    const handleRejectJob = () => {
        if (window.confirm(`Apakah Anda yakin ingin menolak lowongan "${displayJob.judul}"?`)) {
            console.log({ action: 'reject', id_lowongan: displayJob.id_lowongan });
            // In a real application, this would send a request to the server
        }
    };

    // Helper function to render status badge
    const renderStatusBadge = () => {
        let badgeClass = '';
        let statusText = '';
        
        if (!displayJob.approve) {
            badgeClass = 'bg-yellow-100 text-yellow-800';
            statusText = 'Pending';
        } else if (displayJob.status === 'dibuka') {
            badgeClass = 'bg-green-100 text-green-800';
            statusText = 'Dibuka';
        } else if (displayJob.status === 'ditutup') {
            badgeClass = 'bg-gray-100 text-gray-800';
            statusText = 'Ditutup';
        } else {
            badgeClass = 'bg-red-100 text-red-800';
            statusText = 'Ditolak';
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
                header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Access Restricted</h2>}
            >
                <Head title="Job Detail" />
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
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">Detail Lowongan</h2>
                    <div className="flex space-x-3">
                        <Link
                            href={route('admin.jobs.pending')}
                            className="bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500 focus:ring-offset-2 focus:outline-none focus:ring-2 rounded-md px-4 py-2 text-sm font-medium text-white"
                        >
                            Pending Jobs
                        </Link>
                        <Link
                            href={route('admin.jobs.index')}
                            className="bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none focus:ring-2 rounded-md px-4 py-2 text-sm font-medium text-white"
                        >
                            Semua Lowongan
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={`Job: ${displayJob.judul}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {/* Header Section */}
                            <div className="border-b border-gray-200 pb-6 mb-6">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                    <div>
                                        <h1 className="text-2xl font-bold text-gray-900">{displayJob.judul}</h1>
                                        <div className="mt-2 flex items-center text-sm text-gray-500">
                                            <span className="mr-4">Perusahaan: <span className="font-medium">{displayJob.perusahaan?.nama}</span></span>
                                            <span>Status: {renderStatusBadge()}</span>
                                        </div>
                                    </div>
                                    
                                    {!displayJob.approve && (
                                        <div className="mt-4 md:mt-0 flex space-x-3">
                                            <button
                                                onClick={handleApproveJob}
                                                className="bg-green-600 hover:bg-green-700 focus:ring-green-500 focus:ring-offset-2 focus:outline-none focus:ring-2 rounded-md px-4 py-2 text-sm font-medium text-white"
                                            >
                                                Approve Lowongan
                                            </button>
                                            <button
                                                onClick={handleRejectJob}
                                                className="bg-red-600 hover:bg-red-700 focus:ring-red-500 focus:ring-offset-2 focus:outline-none focus:ring-2 rounded-md px-4 py-2 text-sm font-medium text-white"
                                            >
                                                Tolak Lowongan
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            {/* Job Details */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {/* Left column - Job info */}
                                <div className="col-span-2">
                                    <section className="mb-8">
                                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Deskripsi Pekerjaan</h2>
                                        <div 
                                            className="text-gray-700 space-y-4"
                                            dangerouslySetInnerHTML={{ __html: displayJob.deskripsi }}
                                        />
                                    </section>
                                    
                                    <section className="mb-8">
                                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Persyaratan</h2>
                                        <ul className="list-disc list-inside text-gray-700 space-y-2 pl-4">
                                            {Array.isArray(displayJob.persyaratan) 
                                                ? displayJob.persyaratan.map((req, index) => (
                                                    <li key={index}>{req}</li>
                                                ))
                                                : <li>{displayJob.persyaratan || 'Tidak ada persyaratan khusus'}</li>
                                            }
                                        </ul>
                                    </section>
                                </div>
                                
                                {/* Right column - Summary */}
                                <div className="col-span-1">
                                    <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Detail Ringkas</h2>
                                        
                                        <div className="space-y-4">
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Lokasi</p>
                                                <p className="text-base text-gray-900">{displayJob.lokasi || '-'}</p>
                                            </div>
                                            
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Gaji</p>
                                                <p className="text-base text-gray-900">{displayJob.gaji || '-'}</p>
                                            </div>
                                            
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Jenis Pekerjaan</p>
                                                <p className="text-base text-gray-900">{displayJob.jenis_pekerjaan || '-'}</p>
                                            </div>
                                            
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Level</p>
                                                <p className="text-base text-gray-900">{displayJob.level_pekerjaan || '-'}</p>
                                            </div>
                                            
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Tanggal Posting</p>
                                                <p className="text-base text-gray-900">{displayJob.tanggal_posting || '-'}</p>
                                            </div>
                                            
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Berakhir Pada</p>
                                                <p className="text-base text-gray-900">{displayJob.tanggal_berakhir || 'Belum ditentukan'}</p>
                                            </div>
                                            
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Perusahaan</p>
                                                <p className="text-base text-gray-900">{displayJob.perusahaan?.nama || '-'}</p>
                                            </div>
                                            
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Status</p>
                                                <p className="text-base text-gray-900 flex items-center">
                                                    {renderStatusBadge()}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
