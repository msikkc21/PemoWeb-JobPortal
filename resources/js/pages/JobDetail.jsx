import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function JobDetail({ auth, lowongan }) {
    const user = auth?.user;

    const formatCurrency = (amount) => {
        if (!amount) return 'Gaji Tidak Disebutkan';
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const formatDate = (date) => {
        if (!date) return '-';
        return new Date(date).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    const handleApply = () => {
        // Ubah URL sesuai route apply yang Anda gunakan
        router.visit(`/lowongan/${lowongan.id_lowongan}/lamar`);
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Detail Lowongan Pekerjaan
                </h2>
            }
        >
            <Head title={`Lowongan: ${lowongan?.judul || ''}`} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="mb-4">
                        <button
                            onClick={() => window.history.back()}
                            className="text-primary hover:underline text-sm"
                        >
                            ← Kembali
                        </button>
                    </div>

                    <div className="bg-white shadow-sm sm:rounded-lg border border-gray-200">
                        <div className="p-6">
                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                                <div>
                                    <h1 className="text-2xl font-semibold text-primary">
                                        {lowongan?.judul}
                                    </h1>
                                    <p className="text-secondary font-medium mt-1">
                                        {lowongan?.company?.nama_perusahaan || 'Perusahaan'}
                                    </p>

                                    <div className="flex flex-wrap gap-4 text-sm text-text-secondary mt-3">
                                        {lowongan?.lokasi && (
                                            <span className="flex items-center">
                                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                                </svg>
                                                {lowongan.lokasi}
                                            </span>
                                        )}
                                        {lowongan?.jenis_pekerjaan && (
                                            <span className="flex items-center">
                                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h2zM8 5a1 1 0 011-1h2a1 1 0 011 1v1H8V5zM8 11a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" />
                                                </svg>
                                                {lowongan.jenis_pekerjaan}
                                            </span>
                                        )}
                                        {lowongan?.level_pekerjaan && (
                                            <span className="flex items-center">
                                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                {lowongan.level_pekerjaan}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="text-right">
                                    <div className="text-xl font-semibold text-green-600">
                                        {formatCurrency(lowongan?.gaji)}
                                    </div>
                                    <div className="mt-2 flex items-center justify-end gap-2">
                                        <span
                                            className={`px-2 py-1 text-xs rounded-full ${
                                                lowongan?.status === 'dibuka'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                            }`}
                                        >
                                            {lowongan?.status === 'dibuka' ? 'Dibuka' : 'Ditutup'}
                                        </span>
                                        {lowongan?.approve && (
                                            <span className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-full">
                                                Terverifikasi
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="md:col-span-2">
                                    <section className="mb-6">
                                        <h3 className="text-lg font-medium text-primary mb-2">
                                            Deskripsi Pekerjaan
                                        </h3>
                                        <p className="text-text-primary leading-relaxed whitespace-pre-line">
                                            {lowongan?.deskripsi || '-'}
                                        </p>
                                    </section>

                                    {lowongan?.persyaratan && (
                                        <section className="mb-6">
                                            <h3 className="text-lg font-medium text-primary mb-2">
                                                Persyaratan
                                            </h3>
                                            <p className="text-text-primary leading-relaxed whitespace-pre-line">
                                                {lowongan.persyaratan}
                                            </p>
                                        </section>
                                    )}

                                    {Array.isArray(lowongan?.skills) && lowongan.skills.length > 0 && (
                                        <section className="mb-6">
                                            <h3 className="text-lg font-medium text-primary mb-2">
                                                Keahlian yang Dibutuhkan
                                            </h3>
                                            <div className="flex flex-wrap gap-2">
                                                {lowongan.skills.map((skill, idx) => (
                                                    <span key={idx} className="px-3 py-1 bg-secondary/10 text-secondary text-sm rounded-full">
                                                        {skill.nama_keahlian}
                                                    </span>
                                                ))}
                                            </div>
                                        </section>
                                    )}
                                </div>

                                <aside className="md:col-span-1">
                                    <div className="rounded-lg border border-gray-200 p-4">
                                        <h4 className="font-medium text-primary mb-3">Informasi</h4>
                                        <ul className="text-sm text-text-secondary space-y-2">
                                            <li>
                                                <span className="text-text-primary">Diposting:</span>{' '}
                                                {formatDate(lowongan?.tanggal_posting)}
                                            </li>
                                            <li>
                                                <span className="text-text-primary">Berakhir:</span>{' '}
                                                {formatDate(lowongan?.tanggal_berakhir)}
                                            </li>
                                            {lowongan?.lokasi && (
                                                <li>
                                                    <span className="text-text-primary">Lokasi:</span>{' '}
                                                    {lowongan.lokasi}
                                                </li>
                                            )}
                                            {lowongan?.jenis_pekerjaan && (
                                                <li>
                                                    <span className="text-text-primary">Jenis:</span>{' '}
                                                    {lowongan.jenis_pekerjaan}
                                                </li>
                                            )}
                                            {lowongan?.level_pekerjaan && (
                                                <li>
                                                    <span className="text-text-primary">Level:</span>{' '}
                                                    {lowongan.level_pekerjaan}
                                                </li>
                                            )}
                                        </ul>

                                        <div className="mt-4">
                                            <button
                                                onClick={handleApply}
                                                disabled={lowongan?.status !== 'dibuka'}
                                                className={`w-full px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                                                    lowongan?.status === 'dibuka'
                                                        ? 'bg-primary text-white hover:bg-primary/90'
                                                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                                }`}
                                            >
                                                Lamar Sekarang
                                            </button>
                                        </div>
                                    </div>
                                </aside>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}