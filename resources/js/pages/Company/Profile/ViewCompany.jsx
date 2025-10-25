import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function ViewCompany({ auth, company }) {
    const photoUrl = company?.photo_path ? `/storage/${company.photo_path}` : null;

    return (
        <AuthenticatedLayout>
            <Head title="Profil Perusahaan" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        {/* Header */}
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex justify-between items-center">
                                <h1 className="text-2xl font-bold text-gray-900">
                                    Profil Perusahaan
                                </h1>
                                <Link
                                    href={route('company.profile.edit')}
                                    className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 focus:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                >
                                    Edit Profil
                                </Link>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            {/* Photo */}
                            {photoUrl && (
                                <div className="mb-6 flex justify-center">
                                    <img
                                        src={photoUrl}
                                        alt={company.company_name}
                                        className="h-32 w-32 rounded-full object-cover border-4 border-gray-200"
                                    />
                                </div>
                            )}

                            {/* Company Info */}
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Company Name */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Nama Perusahaan
                                        </label>
                                        <p className="mt-1 text-lg text-gray-900">
                                            {company.company_name || '-'}
                                        </p>
                                    </div>

                                    {/* Industry */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Industri
                                        </label>
                                        <p className="mt-1 text-lg text-gray-900">
                                            {company.industry || '-'}
                                        </p>
                                    </div>

                                    {/* Location */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Lokasi
                                        </label>
                                        <p className="mt-1 text-lg text-gray-900">
                                            {company.location || '-'}
                                        </p>
                                    </div>

                                    {/* Website */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Website
                                        </label>
                                        {company.website ? (
                                            <a
                                                href={company.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="mt-1 text-lg text-indigo-600 hover:text-indigo-800"
                                            >
                                                {company.website}
                                            </a>
                                        ) : (
                                            <p className="mt-1 text-lg text-gray-900">-</p>
                                        )}
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Email
                                        </label>
                                        <p className="mt-1 text-lg text-gray-900">
                                            {company.company_email || '-'}
                                        </p>
                                    </div>

                                    {/* Phone */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Telepon
                                        </label>
                                        <p className="mt-1 text-lg text-gray-900">
                                            {company.phone || '-'}
                                        </p>
                                    </div>

                                    {/* Employee Count */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Jumlah Karyawan
                                        </label>
                                        <p className="mt-1 text-lg text-gray-900">
                                            {company.employee_count || '-'}
                                        </p>
                                    </div>

                                    {/* Founded Year */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Tahun Berdiri
                                        </label>
                                        <p className="mt-1 text-lg text-gray-900">
                                            {company.founded_year || '-'}
                                        </p>
                                    </div>
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Deskripsi Perusahaan
                                    </label>
                                    <p className="mt-1 text-gray-900 whitespace-pre-wrap">
                                        {company.description || '-'}
                                    </p>
                                </div>

                                {/* Address */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Alamat
                                    </label>
                                    <p className="mt-1 text-gray-900 whitespace-pre-wrap">
                                        {company.address || '-'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
