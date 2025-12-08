import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Show({ auth, user }) {
    const handleDelete = () => {
        if (confirm(`Apakah Anda yakin ingin menghapus user "${user.name}"?`)) {
            router.delete(`/admin/users/${user.id}`);
        }
    };

    const getRoleBadge = (role) => {
        const styles = {
            admin: 'bg-purple-100 text-purple-800',
            company: 'bg-blue-100 text-blue-800',
            jobseeker: 'bg-green-100 text-green-800',
        };
        const roleName = role?.name?.toLowerCase() || '';
        return styles[roleName] || 'bg-gray-100 text-gray-800';
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={`Detail User: ${user.name} - Admin`} />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6">
                        <Link
                            href="/admin/users"
                            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Kembali ke Daftar User
                        </Link>
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-4">
                                <div className="h-16 w-16 bg-gray-200 rounded-full flex items-center justify-center">
                                    <span className="text-2xl text-gray-600 font-medium">
                                        {user.name?.charAt(0)?.toUpperCase()}
                                    </span>
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
                                    <p className="text-gray-600">{user.email}</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Link
                                    href={`/admin/users/${user.id}/edit`}
                                    className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    Edit
                                </Link>
                                {user.id !== auth.user.id && (
                                    <button
                                        onClick={handleDelete}
                                        className="inline-flex items-center px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
                                    >
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                        Hapus
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* User Info */}
                    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Informasi User</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <p className="text-sm text-gray-500">Nama</p>
                                <p className="text-gray-900 font-medium">{user.name}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Email</p>
                                <p className="text-gray-900 font-medium">{user.email}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Role</p>
                                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getRoleBadge(user.role)}`}>
                                    {user.role?.display_name || user.role?.name || 'N/A'}
                                </span>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Tanggal Bergabung</p>
                                <p className="text-gray-900 font-medium">
                                    {new Date(user.created_at).toLocaleDateString('id-ID', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric'
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Company Info (if company role) */}
                    {user.company && (
                        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Informasi Perusahaan</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <p className="text-sm text-gray-500">Nama Perusahaan</p>
                                    <p className="text-gray-900 font-medium">{user.company.company_name}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Industri</p>
                                    <p className="text-gray-900 font-medium">{user.company.industry || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Lokasi</p>
                                    <p className="text-gray-900 font-medium">{user.company.location || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Website</p>
                                    <p className="text-gray-900 font-medium">{user.company.website || '-'}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Job Seeker Info (if jobseeker role) */}
                    {user.job_seeker && (
                        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Informasi Job Seeker</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <p className="text-sm text-gray-500">Nama</p>
                                    <p className="text-gray-900 font-medium">{user.job_seeker.name}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Pendidikan</p>
                                    <p className="text-gray-900 font-medium">{user.job_seeker.education || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Pengalaman</p>
                                    <p className="text-gray-900 font-medium">{user.job_seeker.experience || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Lokasi</p>
                                    <p className="text-gray-900 font-medium">{user.job_seeker.location || '-'}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
