import React from 'react';
import { useForm, Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import InputError from '@/Components/InputError';

export default function SkillsEdit({ skill }) {
    
    // Inisialisasi useForm dengan data skill dari props
    const { data, setData, put, processing, errors } = useForm({
        nama_keahlian: skill.nama_keahlian || '',
        kategori: skill.kategori || '',
        deskripsi: skill.deskripsi || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Menggunakan method put() untuk mengirim request PUT ke endpoint update
        put(route('admin.skills.update', skill.id), {
            onSuccess: () => {
                alert('Skill berhasil diperbarui!');
                // Inertia akan otomatis mengarahkan kembali ke halaman index
            },
            onError: () => {
                // Errors otomatis diisi di state errors
            }
        });
    };

    return (
        <AdminLayout>
            <Head title={`Edit Skill: ${skill.nama_keahlian}`} />

            <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
                    <h2 className="text-2xl font-bold mb-6">Edit Skill: {skill.nama_keahlian}</h2>
                    
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block font-medium text-sm text-gray-700">Nama Skill *</label>
                            <TextInput
                                type="text"
                                value={data.nama_keahlian}
                                onChange={(e) => setData('nama_keahlian', e.target.value)}
                                className="mt-1 block w-full"
                                required
                            />
                            <InputError message={errors.nama_keahlian} className="mt-2" />
                        </div>

                        <div className="mb-4">
                            <label className="block font-medium text-sm text-gray-700">Kategori</label>
                            <TextInput
                                type="text"
                                value={data.kategori}
                                onChange={(e) => setData('kategori', e.target.value)}
                                className="mt-1 block w-full"
                            />
                            <InputError message={errors.kategori} className="mt-2" />
                        </div>

                        <div className="mb-6">
                            <label className="block font-medium text-sm text-gray-700">Deskripsi</label>
                            <textarea
                                value={data.deskripsi}
                                onChange={(e) => setData('deskripsi', e.target.value)}
                                className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm mt-1 block w-full"
                            ></textarea>
                            <InputError message={errors.deskripsi} className="mt-2" />
                        </div>

                        <div className="flex justify-end">
                            {/* Link kembali ke index (menggunakan SecondaryButton untuk visual) */}
                            <Link href={route('admin.skills.index')}>
                                <SecondaryButton type="button" className="mr-2">
                                    Batal
                                </SecondaryButton>
                            </Link>
                            <PrimaryButton type="submit" processing={processing}>
                                Simpan Perubahan
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}