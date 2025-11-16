import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { useForm, Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Pagination from '@/Components/Pagination';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import DangerButton from '@/Components/DangerButton';
import Modal from '@/Components/Modal';
import InputError from '@/Components/InputError';
import SecondaryButton from '@/Components/SecondaryButton';

export default function SkillsIndex({ skills, filters }) {
    const [showingCreateModal, setShowingCreateModal] = useState(false);

    // Form untuk Search (mengirim GET request)
    const { data: searchData, setData: setSearchData, get: performSearch } = useForm({
        search: filters.search || '',
    });

    // Form untuk Create Skill (mengirim POST request)
    const { data: createForm, setData: setCreateForm, post: storeSkill, processing, errors, reset } = useForm({
        nama_keahlian: '',
        kategori: '',
        deskripsi: '',
    });

    // Logika Pencarian
    const handleSearch = (e) => {
        e.preventDefault();
        // Menggunakan GET request untuk pencarian (diteruskan sebagai query string)
        performSearch(route('admin.skills.index'));
    };

    // Logika Submit Tambah Skill
    const handleStore = (e) => {
        e.preventDefault();
        storeSkill(route('admin.skills.store'), {
            onSuccess: () => { 
                setShowingCreateModal(false); 
                reset(); 
                alert('Skill berhasil ditambahkan!');
            },
            onError: () => {
                // Inertia otomatis mengisi errors state
            },
        });
    };

    // Logika Hapus Skill
    const handleDelete = (skillId) => {
        if (confirm('Apakah Anda yakin ingin menghapus skill ini? Aksi ini tidak dapat dibatalkan.')) {
            // Menggunakan Inertia.delete helper
            Inertia.delete(route('admin.skills.destroy', skillId), {
                onSuccess: () => {
                    alert('Skill berhasil dihapus.');
                },
                onError: (errors) => {
                    // Menampilkan pesan jika skill sedang digunakan (sesuai logic di Controller)
                    alert(errors.error || "Gagal menghapus skill. Mungkin sedang digunakan."); 
                }
            });
        }
    };

    return (
        <AdminLayout>
            <Head title="Kelola Skills" />

            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <h2 className="text-2xl font-bold mb-4">Kelola Skills 🛠️</h2>

                <div className="flex justify-between mb-4">
                    {/* Form Pencarian */}
                    <form onSubmit={handleSearch} className="flex space-x-2 w-1/3">
                        <TextInput
                            type="text"
                            placeholder="Cari Skill (Nama)"
                            value={searchData.search}
                            onChange={(e) => setSearchData('search', e.target.value)}
                            className="w-full"
                        />
                        <PrimaryButton type="submit">Cari</PrimaryButton>
                    </form>
                    
                    {/* Tombol Tambah (membuka modal) */}
                    <PrimaryButton onClick={() => setShowingCreateModal(true)}>
                        + Tambah Skill Baru
                    </PrimaryButton>
                </div>

                {/* Tabel Skills */}
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deskripsi</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {skills.data.length > 0 ? (
                                skills.data.map((skill) => (
                                    <tr key={skill.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{skill.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{skill.nama_keahlian}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{skill.deskripsi || '-'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                            {/* Link Inertia untuk Edit */}
                                            <Link href={route('admin.skills.edit', skill.id)}>
                                                <SecondaryButton className="mr-2">Edit</SecondaryButton>
                                            </Link>
                                            <DangerButton onClick={() => handleDelete(skill.id)}>
                                                Hapus
                                            </DangerButton>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                                        Tidak ada skill yang ditemukan.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="mt-4">
                    <Pagination links={skills.links} />
                </div>
            </div>
            
            {/* Modal Tambah Skill Baru */}
            <Modal show={showingCreateModal} onClose={() => { setShowingCreateModal(false); reset(); }}>
                <form onSubmit={handleStore} className="p-6">
                    <h3 className="text-lg font-medium text-gray-900">
                        Tambah Skill Baru
                    </h3>

                    <div className="mt-4">
                        <label className="block font-medium text-sm text-gray-700">Nama Skill *</label>
                        <TextInput
                            type="text"
                            value={createForm.nama_keahlian}
                            onChange={(e) => setCreateForm('nama_keahlian', e.target.value)}
                            className="mt-1 block w-full"
                            required
                        />
                        <InputError message={errors.nama_keahlian} className="mt-2" />
                    </div>

                    <div className="mt-4">
                        <label className="block font-medium text-sm text-gray-700">Kategori</label>
                        <TextInput
                            type="text"
                            value={createForm.kategori}
                            onChange={(e) => setCreateForm('kategori', e.target.value)}
                            className="mt-1 block w-full"
                        />
                        <InputError message={errors.kategori} className="mt-2" />
                    </div>

                    <div className="mt-4">
                        <label className="block font-medium text-sm text-gray-700">Deskripsi</label>
                        <textarea
                            value={createForm.deskripsi}
                            onChange={(e) => setCreateForm('deskripsi', e.target.value)}
                            className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm mt-1 block w-full"
                        ></textarea>
                        <InputError message={errors.deskripsi} className="mt-2" />
                    </div>

                    <div className="mt-6 flex justify-end">
                        <SecondaryButton type="button" onClick={() => { setShowingCreateModal(false); reset(); }} className="mr-2">
                            Batal
                        </SecondaryButton>
                        <PrimaryButton type="submit" processing={processing}>
                            Tambahkan
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AdminLayout>
    );
}