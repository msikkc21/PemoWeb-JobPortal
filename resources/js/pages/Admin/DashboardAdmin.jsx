import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';

export default function DashboardAdmin({ auth, stats }) {
    return (
        <AdminLayout>
            <Head title="Dashboard Admin" />

            <div className="py-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">📊 Dashboard Admin</h1>

                {/* Pesan sambutan */}
                <div className="bg-white shadow-lg rounded-lg p-8 mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Selamat Datang Kembali! 👋</h2>
                    <p className="text-gray-700 text-lg">
                        Halo <span className="font-semibold text-indigo-600">{auth.user.nama}</span>, 
                        Anda login sebagai <span className="font-semibold text-indigo-600">Administrator</span>.
                    </p>
                    <p className="text-gray-600 mt-4">
                        Gunakan menu di navbar untuk mengelola lowongan, skills, dan persetujuan lowongan kerja.
                    </p>
                </div>

                {/* Kotak Statistik */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="p-6 bg-white shadow-lg rounded-lg border-l-4 border-blue-500">
                        <p className="text-gray-600 text-sm font-medium">Total Perusahaan</p>
                        <p className="text-3xl font-bold text-blue-600 mt-2">{stats.total_perusahaan || 0}</p>
                    </div>

                    <div className="p-6 bg-white shadow-lg rounded-lg border-l-4 border-green-500">
                        <p className="text-gray-600 text-sm font-medium">Total Lowongan</p>
                        <p className="text-3xl font-bold text-green-600 mt-2">{stats.total_lowongan || 0}</p>
                    </div>

                    <div className="p-6 bg-white shadow-lg rounded-lg border-l-4 border-purple-500">
                        <p className="text-gray-600 text-sm font-medium">Total Lamaran</p>
                        <p className="text-3xl font-bold text-purple-600 mt-2">{stats.total_lamaran || 0}</p>
                    </div>

                    <div className="p-6 bg-white shadow-lg rounded-lg border-l-4 border-yellow-500">
                        <p className="text-gray-600 text-sm font-medium">Pending Review</p>
                        <p className="text-3xl font-bold text-yellow-600 mt-2">{stats.pending_review || 0}</p>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
