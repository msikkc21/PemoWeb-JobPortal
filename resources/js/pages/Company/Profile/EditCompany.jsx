import { Head, useForm, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';

export default function EditCompany({ auth, company }) {
    const { data, setData, post, processing, errors } = useForm({
        company_name: company?.company_name || '',
        industry: company?.industry || '',
        description: company?.description || '',
        location: company?.location || '',
        company_email: company?.company_email || '',
        phone: company?.phone || '',
        address: company?.address || '',
        website: company?.website || '',
        photo_path: null,
        employee_count: company?.employee_count || '',
        founded_year: company?.founded_year || '',
    });

    const photoUrl = company?.photo_path ? `/storage/${company.photo_path}` : null;

    const submit = (e) => {
        e.preventDefault();
        post(route('company.profile.update'), {
            forceFormData: true,
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Edit Profil Perusahaan" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-8">
                            {/* Header */}
                            <div className="mb-6 flex justify-between items-center">
                                <h1 className="text-2xl font-bold text-gray-900">
                                    Edit Profil Perusahaan
                                </h1>
                                <Link
                                    href={route('company.profile.show')}
                                    className="text-gray-600 hover:text-gray-900"
                                >
                                    Kembali
                                </Link>
                            </div>

                            <form onSubmit={submit}>
                                <div className="space-y-6">
                                    {/* Current Photo */}
                                    {photoUrl && (
                                        <div className="text-center">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Foto Saat Ini
                                            </label>
                                            <img
                                                src={photoUrl}
                                                alt="Current"
                                                className="h-24 w-24 rounded-full object-cover mx-auto border-2 border-gray-200"
                                            />
                                        </div>
                                    )}

                                    {/* Basic Info Section */}
                                    <div className="border-b border-gray-200 pb-6">
                                        <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                            Informasi Perusahaan
                                        </h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <InputLabel htmlFor="company_name" value="Nama Perusahaan *" />
                                                <TextInput
                                                    id="company_name"
                                                    type="text"
                                                    className="mt-1 block w-full"
                                                    value={data.company_name}
                                                    onChange={(e) => setData('company_name', e.target.value)}
                                                    required
                                                />
                                                <InputError message={errors.company_name} className="mt-2" />
                                            </div>

                                            <div>
                                                <InputLabel htmlFor="industry" value="Industri *" />
                                                <TextInput
                                                    id="industry"
                                                    type="text"
                                                    className="mt-1 block w-full"
                                                    value={data.industry}
                                                    onChange={(e) => setData('industry', e.target.value)}
                                                    required
                                                />
                                                <InputError message={errors.industry} className="mt-2" />
                                            </div>

                                            <div>
                                                <InputLabel htmlFor="location" value="Lokasi *" />
                                                <TextInput
                                                    id="location"
                                                    type="text"
                                                    className="mt-1 block w-full"
                                                    value={data.location}
                                                    onChange={(e) => setData('location', e.target.value)}
                                                    required
                                                />
                                                <InputError message={errors.location} className="mt-2" />
                                            </div>

                                            <div>
                                                <InputLabel htmlFor="website" value="Website" />
                                                <TextInput
                                                    id="website"
                                                    type="url"
                                                    className="mt-1 block w-full"
                                                    value={data.website}
                                                    onChange={(e) => setData('website', e.target.value)}
                                                />
                                                <InputError message={errors.website} className="mt-2" />
                                            </div>

                                            <div>
                                                <InputLabel htmlFor="employee_count" value="Jumlah Karyawan" />
                                                <TextInput
                                                    id="employee_count"
                                                    type="number"
                                                    className="mt-1 block w-full"
                                                    value={data.employee_count}
                                                    onChange={(e) => setData('employee_count', e.target.value)}
                                                    min="1"
                                                />
                                                <InputError message={errors.employee_count} className="mt-2" />
                                            </div>

                                            <div>
                                                <InputLabel htmlFor="founded_year" value="Tahun Berdiri" />
                                                <TextInput
                                                    id="founded_year"
                                                    type="number"
                                                    className="mt-1 block w-full"
                                                    value={data.founded_year}
                                                    onChange={(e) => setData('founded_year', e.target.value)}
                                                    min="1800"
                                                    max={new Date().getFullYear()}
                                                />
                                                <InputError message={errors.founded_year} className="mt-2" />
                                            </div>

                                            {/* Photo Upload */}
                                            <div className="md:col-span-2">
                                                <InputLabel htmlFor="photo_path" value="Upload Logo Baru" />
                                                <input
                                                    id="photo_path"
                                                    type="file"
                                                    className="mt-1 block w-full text-sm text-gray-500
                                                        file:mr-4 file:py-2 file:px-4
                                                        file:rounded-md file:border-0
                                                        file:text-sm file:font-semibold
                                                        file:bg-indigo-50 file:text-indigo-700
                                                        hover:file:bg-indigo-100"
                                                    onChange={(e) => setData('photo_path', e.target.files[0])}
                                                    accept="image/*"
                                                />
                                                <p className="mt-1 text-sm text-gray-500">
                                                    Format: JPG, JPEG, PNG. Maksimal 2MB.
                                                </p>
                                                <InputError message={errors.photo_path} className="mt-2" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Contact Section */}
                                    <div className="border-b border-gray-200 pb-6">
                                        <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                            Informasi Kontak
                                        </h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <InputLabel htmlFor="company_email" value="Email Perusahaan *" />
                                                <TextInput
                                                    id="company_email"
                                                    type="email"
                                                    className="mt-1 block w-full"
                                                    value={data.company_email}
                                                    onChange={(e) => setData('company_email', e.target.value)}
                                                    required
                                                />
                                                <InputError message={errors.company_email} className="mt-2" />
                                            </div>

                                            <div>
                                                <InputLabel htmlFor="phone" value="Nomor Telepon *" />
                                                <TextInput
                                                    id="phone"
                                                    type="tel"
                                                    className="mt-1 block w-full"
                                                    value={data.phone}
                                                    onChange={(e) => setData('phone', e.target.value)}
                                                    required
                                                />
                                                <InputError message={errors.phone} className="mt-2" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Description & Address Section */}
                                    <div>
                                        <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                            Deskripsi & Alamat
                                        </h2>
                                        <div className="space-y-6">
                                            <div>
                                                <InputLabel htmlFor="description" value="Deskripsi Perusahaan *" />
                                                <textarea
                                                    id="description"
                                                    className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                                    value={data.description}
                                                    onChange={(e) => setData('description', e.target.value)}
                                                    rows="4"
                                                    required
                                                />
                                                <InputError message={errors.description} className="mt-2" />
                                            </div>

                                            <div>
                                                <InputLabel htmlFor="address" value="Alamat Lengkap *" />
                                                <textarea
                                                    id="address"
                                                    className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                                    value={data.address}
                                                    onChange={(e) => setData('address', e.target.value)}
                                                    rows="3"
                                                    required
                                                />
                                                <InputError message={errors.address} className="mt-2" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div className="flex items-center justify-end mt-8 pt-6 border-t border-gray-200">
                                    <PrimaryButton className="px-8" disabled={processing}>
                                        {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
