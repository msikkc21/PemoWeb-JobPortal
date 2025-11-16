import React, { useState } from 'react';
import { useForm, Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout'; 
import Pagination from '@/Components/Pagination'; 
import TextInput from '@/Components/TextInput'; 
import PrimaryButton from '@/Components/PrimaryButton'; 
import DangerButton from '@/Components/DangerButton'; 
import SecondaryButton from '@/Components/SecondaryButton'; 
import Modal from '@/Components/Modal'; 
import InputError from '@/Components/InputError';

export default function JobReviewIndex({ jobs, filters }) {
    const [showingRejectModal, setShowingRejectModal] = useState(false);
    const [showingDetailModal, setShowingDetailModal] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null); // Menyimpan data job yang sedang di-review
    
    // Form untuk Search
    const { data: searchData, setData: setSearchData, get } = useForm({
        search: filters.search || '',
    });

    // Form untuk Reject (hanya butuh rejection_reason)
    const { data: rejectForm, setData: setRejectForm, post: rejectPost, processing: isRejecting, errors: rejectErrors, reset: rejectReset } = useForm({
        rejection_reason: '',
    });

    // Logika Pencarian
    const handleSearch = (e) => {
        e.preventDefault();
        get(route('admin.jobs.review'));
    };
    
    // 1. Aksi Approve
    const handleApprove = (jobPost) => {
        if (!confirm(`Yakin ingin MENG-APPROVE lowongan: ${jobPost.judul}?`)) {
            return;
        }

        // Post ke endpoint Approve
        router.post(route('admin.jobs.approve', jobPost.id_lowongan), {}, {
            onSuccess: () => {
                alert('Lowongan berhasil di-approve dan sudah tayang!');
                setShowingDetailModal(false); // Tutup modal detail jika sedang terbuka
            },
            onError: (err) => {
                alert(`Gagal Approve: ${err.status}`);
            }
        });
    };

    // 2. Buka Modal Detail
    const openDetailModal = (jobPost) => {
        setSelectedJob(jobPost);
        setShowingDetailModal(true);
    }
    
    // 3. Aksi Reject (Buka Modal Input Alasan)
    const openRejectModal = (jobPost) => {
        setSelectedJob(jobPost);
        rejectReset(); 
        setShowingDetailModal(false); // Tutup modal detail agar tidak tumpang tindih
        setShowingRejectModal(true);
    };

    // 4. Submit Reject Form
    const submitReject = (e) => {
        e.preventDefault();
        
        if (!selectedJob) return;

        // Submit form reject ke endpoint
        rejectPost(route('admin.jobs.reject', selectedJob.id_lowongan), {
            data: { rejection_reason: rejectForm.rejection_reason },
            onSuccess: () => {
                setShowingRejectModal(false);
                setSelectedJob(null);
                alert(`Lowongan "${selectedJob.judul}" berhasil di-reject.`);
            },
            onError: (err) => {
                // Errors dari backend akan ditampilkan via InputError
            },
            preserveScroll: true,
        });
    };


    return (
        <AdminLayout>
            <Head title="Job Review" />

            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <h2 className="text-2xl font-bold mb-4">Review Lowongan Kerja 🧐</h2>

                <div className="flex justify-between items-center mb-4">
                    {/* Form Pencarian */}
                    <form onSubmit={handleSearch} className="flex space-x-2 w-1/2">
                        <TextInput
                            type="text"
                            placeholder="Cari Judul / Perusahaan..."
                            value={searchData.search}
                            onChange={(e) => setSearchData('search', e.target.value)}
                            className="w-full"
                        />
                        <PrimaryButton type="submit">Cari</PrimaryButton>
                    </form>
                    
                    {/* Link ke Riwayat */}
                    {/* Asumsi route admin.jobs.history sudah ada */}
                    <Link href={route('admin.jobs.history')}>
                         <SecondaryButton>Lihat Riwayat Approval</SecondaryButton>
                    </Link>
                </div>

                {/* Tabel Lowongan Pending Review */}
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Judul</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Perusahaan</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal Dibuat</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {jobs.data.length > 0 ? (
                                jobs.data.map((job) => (
                                    <tr key={job.id_lowongan}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{job.judul}</td>
                                        {/* job.company diasumsikan sudah di-eager load di controller */}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{job.company?.nama_perusahaan || '-'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(job.created_at).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                            {/* Tombol Detail (Membuka Modal Detail) */}
                                            <SecondaryButton onClick={() => openDetailModal(job)} className="mr-2">
                                                Detail
                                            </SecondaryButton>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                                        Tidak ada lowongan yang berstatus 'Pending Review'.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="mt-4">
                    <Pagination links={jobs.links} />
                </div>
            </div>
            
            {/* MODAL 1: Detail Job Review */}
            <Modal show={showingDetailModal} onClose={() => setShowingDetailModal(false)} maxWidth="xl">
                {selectedJob && (
                    <div className="p-6">
                        <h3 className="text-2xl font-bold mb-4">{selectedJob.judul}</h3>
                        <p className="text-gray-600 mb-4">Diposting oleh: **{selectedJob.company?.nama_perusahaan}**</p>
                        
                        <div className="space-y-4">
                            <div>
                                <h4 className="font-semibold text-lg">Deskripsi Pekerjaan</h4>
                                {/* Asumsi deskripsi pekerjaan ada di selectedJob.deskripsi */}
                                <div className="mt-2 text-sm text-gray-700 whitespace-pre-line">{selectedJob.deskripsi}</div>
                            </div>
                            
                            <div>
                                <h4 className="font-semibold text-lg">Persyaratan</h4>
                                <div className="mt-2 text-sm text-gray-700 whitespace-pre-line">{selectedJob.persyaratan || '-'}</div>
                            </div>

                            <div>
                                <h4 className="font-semibold text-lg">Skills yang Dibutuhkan</h4>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {/* selectedJob.skills diasumsikan sudah di-eager load di controller */}
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
                        </div>

                        <div className="mt-8 flex justify-end space-x-3">
                            <PrimaryButton onClick={() => handleApprove(selectedJob)}>
                                ✅ Approve Lowongan
                            </PrimaryButton>
                            <DangerButton onClick={() => openRejectModal(selectedJob)}>
                                ❌ Reject Lowongan
                            </DangerButton>
                        </div>
                    </div>
                )}
            </Modal>
            
            {/* MODAL 2: Reject Job (Input Alasan Wajib) */}
            <Modal show={showingRejectModal} onClose={() => setShowingRejectModal(false)}>
                <form onSubmit={submitReject} className="p-6">
                    <h3 className="text-lg font-medium text-gray-900">
                        Tolak Lowongan: {selectedJob?.judul}
                    </h3>
                    <p className="mt-1 text-sm text-gray-600">
                        Anda **wajib** mengisi alasan penolakan (`rejection_reason`).
                    </p>

                    <div className="mt-4">
                        <label className="block font-medium text-sm text-gray-700">Alasan Penolakan *</label>
                        <textarea
                            value={rejectForm.rejection_reason}
                            onChange={(e) => setRejectForm('rejection_reason', e.target.value)}
                            className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm mt-1 block w-full"
                            rows="4"
                            required
                        ></textarea>
                        {/* Menampilkan error validasi dari backend */}
                        <InputError message={rejectErrors.rejection_reason} className="mt-2" />
                    </div>

                    <div className="mt-6 flex justify-end">
                        <SecondaryButton type="button" onClick={() => setShowingRejectModal(false)} className="mr-2">
                            Batal
                        </SecondaryButton>
                        <DangerButton type="submit" processing={isRejecting}>
                            Tolak Lowongan Ini
                        </DangerButton>
                    </div>
                </form>
            </Modal>
        </AdminLayout>
    );
}