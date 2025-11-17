import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function ViewJobSeeker({ auth, jobSeeker }) {
    const photoUrl = jobSeeker?.photo_path ? `/storage/${jobSeeker.photo_path}` : null;

    return (
        <AuthenticatedLayout>
            <Head title="Profil Saya" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-8">
                            {/* Header */}
                            <div className="mb-6 flex justify-between items-center">
                                <h1 className="text-2xl font-bold text-gray-900">Profil Saya</h1>
                                <Link
                                    href={route('jobseeker.profile.edit')}
                                    className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 focus:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                >
                                    Edit Profil
                                </Link>
                            </div>

                            {/* Photo */}
                            <div className="mb-8 text-center border-b border-gray-200 pb-8">
                                {photoUrl ? (
                                    <img
                                        src={photoUrl}
                                        alt={jobSeeker?.name}
                                        className="h-32 w-32 rounded-full object-cover mx-auto border-4 border-gray-200"
                                    />
                                ) : (
                                    <div className="h-32 w-32 rounded-full bg-gray-200 flex items-center justify-center mx-auto border-4 border-gray-300">
                                        <span className="text-4xl text-gray-500 font-bold">
                                            {jobSeeker?.name?.charAt(0)?.toUpperCase()}
                                        </span>
                                    </div>
                                )}
                                <h2 className="mt-4 text-2xl font-bold text-gray-900">{jobSeeker?.name}</h2>
                            </div>

                            {/* Personal Information */}
                            <div className="mb-8">
                                <h3 className="text-xl font-semibold text-gray-900 mb-4 border-b pb-2">
                                    Informasi Pribadi
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Nama Lengkap</dt>
                                        <dd className="mt-1 text-sm text-gray-900">{jobSeeker?.name || '-'}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Jenis Kelamin</dt>
                                        <dd className="mt-1 text-sm text-gray-900">
                                            {jobSeeker?.gender === 'male' ? 'Laki-laki' : jobSeeker?.gender === 'female' ? 'Perempuan' : '-'}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Tempat Lahir</dt>
                                        <dd className="mt-1 text-sm text-gray-900">{jobSeeker?.birth_place || '-'}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Tanggal Lahir</dt>
                                        <dd className="mt-1 text-sm text-gray-900">
                                            {jobSeeker?.birth_date ? new Date(jobSeeker.birth_date).toLocaleDateString('id-ID', { 
                                                year: 'numeric', 
                                                month: 'long', 
                                                day: 'numeric' 
                                            }) : '-'}
                                        </dd>
                                    </div>
                                </div>
                            </div>

                            {/* Education & Experience */}
                            <div className="mb-8">
                                <h3 className="text-xl font-semibold text-gray-900 mb-4 border-b pb-2">
                                    Pendidikan & Pengalaman
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Pendidikan Terakhir</dt>
                                        <dd className="mt-1 text-sm text-gray-900">{jobSeeker?.education || '-'}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Pengalaman</dt>
                                        <dd className="mt-1 text-sm text-gray-900">{jobSeeker?.experience || '-'}</dd>
                                    </div>
                                    <div className="md:col-span-2">
                                        <dt className="text-sm font-medium text-gray-500">Deskripsi Diri</dt>
                                        <dd className="mt-1 text-sm text-gray-900 whitespace-pre-line">
                                            {jobSeeker?.description || '-'}
                                        </dd>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Information */}
                            <div className="mb-8">
                                <h3 className="text-xl font-semibold text-gray-900 mb-4 border-b pb-2">
                                    Informasi Kontak
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Email</dt>
                                        <dd className="mt-1 text-sm text-gray-900">{jobSeeker?.user?.email || '-'}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Nomor Telepon</dt>
                                        <dd className="mt-1 text-sm text-gray-900">{jobSeeker?.phone || '-'}</dd>
                                    </div>
                                    <div className="md:col-span-2">
                                        <dt className="text-sm font-medium text-gray-500">Alamat</dt>
                                        <dd className="mt-1 text-sm text-gray-900 whitespace-pre-line">
                                            {jobSeeker?.address || '-'}
                                        </dd>
                                    </div>
                                </div>
                            </div>

                            {/* Social Media & Portfolio */}
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-4 border-b pb-2">
                                    Media Sosial & Portfolio
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">LinkedIn</dt>
                                        <dd className="mt-1 text-sm">
                                            {jobSeeker?.linkedin_url ? (
                                                <a
                                                    href={jobSeeker.linkedin_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-indigo-600 hover:text-indigo-900 break-all"
                                                >
                                                    {jobSeeker.linkedin_url}
                                                </a>
                                            ) : (
                                                '-'
                                            )}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">GitHub</dt>
                                        <dd className="mt-1 text-sm">
                                            {jobSeeker?.github_url ? (
                                                <a
                                                    href={jobSeeker.github_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-indigo-600 hover:text-indigo-900 break-all"
                                                >
                                                    {jobSeeker.github_url}
                                                </a>
                                            ) : (
                                                '-'
                                            )}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Portfolio</dt>
                                        <dd className="mt-1 text-sm">
                                            {jobSeeker?.portfolio_url ? (
                                                <a
                                                    href={jobSeeker.portfolio_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-indigo-600 hover:text-indigo-900 break-all"
                                                >
                                                    {jobSeeker.portfolio_url}
                                                </a>
                                            ) : (
                                                '-'
                                            )}
                                        </dd>
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
