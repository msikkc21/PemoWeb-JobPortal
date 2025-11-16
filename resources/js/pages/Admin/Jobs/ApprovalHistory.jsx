import React, { useState } from 'react';
import { useForm, Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Pagination from '@/Components/Pagination';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import Modal from '@/Components/Modal';

export default function ApprovalHistory({ jobs, filters }) {
    const [showingDetailModal, setShowingDetailModal] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);
    
    // Form untuk Search dan Filter
    const { data: filterData, setData: setFilterData, get } = useForm({
        search: filters?.search || '',
        status: filters?.status || '',
        date_from: filters?.date_from || '',
        date_to: filters?.date_to || '',
    });

    // Logika Pencarian & Filter
    const handleFilter = (e) => {
        e.preventDefault();
        get(route('admin.jobs.history'));
    };

    // Buka Modal Detail
    const openDetailModal = (job) => {
        setSelectedJob(job);
        setShowingDetailModal(true);
    }

    const getStatusBadge = (status) => {
        if (status === 'approved') {
            return <span className="inline-flex px-3 py-1 text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">✅ Approved</span>;
        } else if (status === 'rejected') {
            return <span className="inline-flex px-3 py-1 text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">❌ Rejected</span>;
        }
        return <span className="text-gray-500">-</span>;
    };

    return (
        <AdminLayout>
            <Head title="Job Approval History" />

            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <h2 className="text-2xl font-bold mb-6">Riwayat Approval Lowongan 📋</h2>

                {/* Filter Form */}
                <div className="bg-white shadow rounded-lg p-6 mb-6">
                    <form onSubmit={handleFilter}>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {/* Search */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Cari Judul/Perusahaan</label>
                                <TextInput
                                    type="text"
                                    value={filterData.search}
                                    onChange={(e) => setFilterData('search', e.target.value)}
                                    placeholder="Cari..."
                                    className="w-full"
                                />
                            </div>

                            {/* Status Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <select
                                    value={filterData.status}
                                    onChange={(e) => setFilterData('status', e.target.value)}
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                >
                                    <option value="">Semua</option>
                                    <option value="approved">Approved</option>
                                    <option value="rejected">Rejected</option>
                                </select>
                            </div>

                            {/* Date From */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Dari Tanggal</label>
                                <input
                                    type="date"
                                    value={filterData.date_from}
                                    onChange={(e) => setFilterData('date_from', e.target.value)}
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>

                            {/* Date To */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Sampai Tanggal</label>
                                <input
                                    type="date"
                                    value={filterData.date_to}
                                    onChange={(e) => setFilterData('date_to', e.target.value)}
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                        </div>

                        <div className="mt-4 flex gap-2">
                            <PrimaryButton type="submit">Cari</PrimaryButton>
                            <Link href={route('admin.jobs.history')}>
                                <SecondaryButton type="button">Reset</SecondaryButton>
                            </Link>
                        </div>
                    </form>
                </div>

                {/* Tabel Riwayat */}
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Judul</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Perusahaan</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal Posting</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {jobs.data && jobs.data.length > 0 ? (
                                jobs.data.map((job) => (
                                    <tr key={job.id_lowongan}>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{job.judul}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{job.company?.nama_perusahaan || '-'}</td>
                                        <td className="px-6 py-4 text-sm">
                                            {getStatusBadge(job.status)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {job.tanggal_posting ? new Date(job.tanggal_posting).toLocaleDateString() : '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                            <button
                                                onClick={() => openDetailModal(job)}
                                                className="text-indigo-600 hover:text-indigo-900"
                                            >
                                                Detail
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                                        Tidak ada riwayat approval ditemukan.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {jobs.links && (
                    <div className="mt-4">
                        <Pagination links={jobs.links} />
                    </div>
                )}
            </div>

            {/* MODAL: Detail Job */}
            <Modal show={showingDetailModal} onClose={() => setShowingDetailModal(false)} maxWidth="xl">
                {selectedJob && (
                    <div className="p-6">
                        <h3 className="text-2xl font-bold mb-4">{selectedJob.judul}</h3>
                        <p className="text-gray-600 mb-4">Perusahaan: <strong>{selectedJob.company?.nama_perusahaan}</strong></p>
                        
                        <div className="mb-4">
                            <span className="text-lg font-semibold mr-2">Status:</span>
                            {selectedJob.status === 'approved' && (
                                <span className="inline-flex px-3 py-1 text-sm leading-5 font-semibold rounded-full bg-green-100 text-green-800">✅ Approved</span>
                            )}
                            {selectedJob.status === 'rejected' && (
                                <span className="inline-flex px-3 py-1 text-sm leading-5 font-semibold rounded-full bg-red-100 text-red-800">❌ Rejected</span>
                            )}
                        </div>

                        <div className="space-y-4">
                            <div>
                                <h4 className="font-semibold text-lg">Deskripsi</h4>
                                <div className="mt-2 text-sm text-gray-700 whitespace-pre-line">{selectedJob.deskripsi}</div>
                            </div>

                            <div>
                                <h4 className="font-semibold text-lg">Persyaratan</h4>
                                <div className="mt-2 text-sm text-gray-700 whitespace-pre-line">{selectedJob.persyaratan || '-'}</div>
                            </div>

                            <div>
                                <h4 className="font-semibold text-lg">Skills yang Dibutuhkan</h4>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {selectedJob.skills && selectedJob.skills.length > 0 ? (
                                        selectedJob.skills.map(skill => (
                                            <span key={skill.id} className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                                                {skill.nama_keahlian}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-sm text-gray-500">Tidak ada skill tercantum.</span>
                                    )}
                                </div>
                            </div>

                            {selectedJob.status === 'rejected' && selectedJob.rejection_reason && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                    <h4 className="font-semibold text-lg text-red-900">Alasan Penolakan</h4>
                                    <p className="mt-2 text-sm text-red-800 whitespace-pre-line">{selectedJob.rejection_reason}</p>
                                </div>
                            )}

                            {selectedJob.status === 'approved' && selectedJob.tanggal_posting && (
                                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                    <p className="text-sm text-green-800">
                                        <strong>Tanggal Posting:</strong> {new Date(selectedJob.tanggal_posting).toLocaleDateString()}
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="mt-6 flex justify-end">
                            <SecondaryButton type="button" onClick={() => setShowingDetailModal(false)}>
                                Tutup
                            </SecondaryButton>
                        </div>
                    </div>
                )}
            </Modal>
        </AdminLayout>
    );
}
