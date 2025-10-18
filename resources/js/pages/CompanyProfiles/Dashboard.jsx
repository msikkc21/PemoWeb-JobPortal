import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Dashboard({ auth, profile, stats, recentApplications }) {
    console.log(auth.user);
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard Perusahaan</h2>}
        >
            <Head title="Dashboard Perusahaan" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Company Profile Summary */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6 text-gray-900">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                                <div className="flex-1">
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                        {profile?.company_name || 'Nama Perusahaan'}
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-1">
                                        <span className="font-semibold">Industri:</span> {profile?.industry || 'N/A'}
                                    </p>
                                    <p className="text-sm text-gray-600 mb-3">
                                        <span className="font-semibold">Lokasi:</span> {profile?.location || 'N/A'}
                                    </p>
                                    {profile?.is_approved ? (
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            ✓ Disetujui Admin
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                                            ⏳ Menunggu Persetujuan
                                        </span>
                                    )}
                                </div>
                                <Link href={route('company_profiles.edit', profile?.id)}>
                                    <PrimaryButton>
                                        Edit Profil
                                    </PrimaryButton>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <div className="text-sm font-medium text-gray-600 mb-1">Total Lowongan</div>
                                <div className="text-3xl font-bold text-gray-900">
                                    {stats?.totalJobs || 0}
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <div className="text-sm font-medium text-gray-600 mb-1">Lamaran Baru</div>
                                <div className="text-3xl font-bold text-indigo-600">
                                    {stats?.pendingApplications || 0}
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <div className="text-sm font-medium text-gray-600 mb-1">Dalam Proses</div>
                                <div className="text-3xl font-bold text-amber-600">
                                    {stats?.inProcessApplications || 0}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Applications */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Pelamar Terbaru
                            </h3>
                            
                            {recentApplications && recentApplications.length > 0 ? (
                                <div className="space-y-3">
                                    {recentApplications.slice(0, 5).map((application) => (
                                        <div 
                                            key={application.application_id}
                                            className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition duration-150 gap-3"
                                        >
                                            <div className="flex-1">
                                                <p className="font-semibold text-gray-900">
                                                    {application.applicant_name}
                                                </p>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    {application.job_title}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {new Date(application.application_date).toLocaleDateString('id-ID')}
                                                </p>
                                            </div>
                                            <div className="flex-shrink-0">
                                                <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                                                    application.status === 'submitted' 
                                                        ? 'bg-indigo-100 text-indigo-800' 
                                                        : 'bg-amber-100 text-amber-800'
                                                }`}>
                                                    {application.status === 'submitted' ? 'Baru' : 'Diproses'}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 text-gray-500">
                                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    <p className="mt-4 text-sm font-medium">Belum ada pelamar</p>
                                    <p className="mt-1 text-sm">Buat lowongan pekerjaan untuk menerima lamaran</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
