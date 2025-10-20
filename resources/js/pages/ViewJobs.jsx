import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function ViewJobs({ auth, lowongans = [], skills = [] }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedLocation, setSelectedLocation] = useState('');
    const [selectedJobType, setSelectedJobType] = useState('');
    const [selectedLevel, setSelectedLevel] = useState('');

    const isPencariKerja = auth?.user?.is_pencari_kerja;
    const isPerusahaan = auth?.user?.is_perusahaan;

    // Filter lowongan berdasarkan pencarian
    const filteredLowongans = lowongans.filter(lowongan => {
        const matchesSearch = lowongan.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            lowongan.deskripsi.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesLocation = selectedLocation === '' || lowongan.lokasi === selectedLocation;
        const matchesJobType = selectedJobType === '' || lowongan.jenis_pekerjaan === selectedJobType;
        const matchesLevel = selectedLevel === '' || lowongan.level_pekerjaan === selectedLevel;

        return matchesSearch && matchesLocation && matchesJobType && matchesLevel;
    });

    // Get unique values for filters
    const locations = [...new Set(lowongans.map(l => l.lokasi).filter(Boolean))];
    const jobTypes = [...new Set(lowongans.map(l => l.jenis_pekerjaan).filter(Boolean))];
    const levels = [...new Set(lowongans.map(l => l.level_pekerjaan).filter(Boolean))];

    const formatCurrency = (amount) => {
        if (!amount) return 'Gaji Tidak Disebutkan';
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const formatDate = (date) => {
        if (!date) return '';
        return new Date(date).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className='flex justify-between items-center'>
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Lowongan Pekerjaan</h2>
                    {isPerusahaan ? (
                        <>
                            <Link href={route('company.jobs.create')} className="px-4 py-2 text-sm bg-primary text-white rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary">
                                Tambah Lowongan
                            </Link>
                        </>
                    ) : null}
                    
                </div>
                
            }
        >
            <Head title="Lowongan Pekerjaan" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Filter Section */}
                    <div className="mb-6 bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h3 className="text-lg font-medium text-primary mb-4">Filter Lowongan</h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                                {/* Search */}
                                <div>
                                    <label className="block text-sm font-medium text-primary mb-2">
                                        Cari Pekerjaan
                                    </label>
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Masukkan kata kunci..."
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                                    />
                                </div>

                                {/* Location Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-primary mb-2">
                                        Lokasi
                                    </label>
                                    <select
                                        value={selectedLocation}
                                        onChange={(e) => setSelectedLocation(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                                    >
                                        <option value="">Semua Lokasi</option>
                                        {locations.map(location => (
                                            <option key={location} value={location}>{location}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Job Type Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-primary mb-2">
                                        Jenis Pekerjaan
                                    </label>
                                    <select
                                        value={selectedJobType}
                                        onChange={(e) => setSelectedJobType(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                                    >
                                        <option value="">Semua Jenis</option>
                                        {jobTypes.map(type => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Level Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-primary mb-2">
                                        Level
                                    </label>
                                    <select
                                        value={selectedLevel}
                                        onChange={(e) => setSelectedLevel(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                                    >
                                        <option value="">Semua Level</option>
                                        {levels.map(level => (
                                            <option key={level} value={level}>{level}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Clear Filters */}
                                <div className="flex items-end">
                                    <button
                                        onClick={() => {
                                            setSearchTerm('');
                                            setSelectedLocation('');
                                            setSelectedJobType('');
                                            setSelectedLevel('');
                                        }}
                                        className="w-full px-4 py-2 bg-secondary text-white rounded-md hover:bg-secondary/90 focus:outline-none focus:ring-2 focus:ring-secondary"
                                    >
                                        Reset Filter
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Results Count */}
                    <div className="mb-4 text-text-secondary">
                        Menampilkan {filteredLowongans.length} dari {lowongans.length} lowongan pekerjaan
                    </div>

                    {/* Job Listings */}
                    <div className="space-y-6">
                        {filteredLowongans.length > 0 ? (
                            filteredLowongans.map((lowongan) => (
                                <div key={lowongan.id_lowongan} className="bg-white shadow-sm sm:rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex-1">
                                                <h3 className="text-xl font-semibold text-primary mb-2">
                                                    {lowongan.judul}
                                                </h3>
                                                <p className="text-lg text-secondary font-medium mb-2">
                                                    {lowongan.company?.nama_perusahaan || 'Perusahaan'}
                                                </p>
                                                <div className="flex flex-wrap gap-4 text-sm text-text-secondary mb-3">
                                                    <span className="flex items-center">
                                                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                                        </svg>
                                                        {lowongan.lokasi}
                                                    </span>
                                                    <span className="flex items-center">
                                                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h2zM8 5a1 1 0 011-1h2a1 1 0 011 1v1H8V5zM8 11a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" />
                                                        </svg>
                                                        {lowongan.jenis_pekerjaan}
                                                    </span>
                                                    <span className="flex items-center">
                                                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        {lowongan.level_pekerjaan}
                                                    </span>
                                                </div>
                                            </div>
                                            
                                            <div className="text-right">
                                                <div className="text-lg font-semibold text-green-600 mb-2">
                                                    {formatCurrency(lowongan.gaji)}
                                                </div>
                                                <div className="flex space-x-2">
                                                    <span className={`px-2 py-1 text-xs rounded-full ${
                                                        lowongan.status === 'dibuka' 
                                                            ? 'bg-green-100 text-green-800' 
                                                            : 'bg-red-100 text-red-800'
                                                    }`}>
                                                        {lowongan.status === 'dibuka' ? 'Dibuka' : 'Ditutup'}
                                                    </span>
                                                    {lowongan.approve && (
                                                        <span className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-full">
                                                            Terverifikasi
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <p className="text-text-primary mb-4 line-clamp-3">
                                            {lowongan.deskripsi}
                                        </p>

                                        {lowongan.persyaratan && (
                                            <div className="mb-4">
                                                <h4 className="font-medium text-primary mb-2">Persyaratan:</h4>
                                                <p className="text-text-primary text-sm">
                                                    {lowongan.persyaratan}
                                                </p>
                                            </div>
                                        )}

                                        {/* Skills */}
                                        {lowongan.skills && lowongan.skills.length > 0 && (
                                            <div className="mb-4">
                                                <h4 className="font-medium text-primary mb-2">Keahlian yang Dibutuhkan:</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {lowongan.skills.map((skill, index) => (
                                                        <span key={index} className="px-3 py-1 bg-secondary/10 text-secondary text-sm rounded-full">
                                                            {skill.nama_keahlian}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                                            <div className="text-sm text-text-secondary">
                                                <span>Diposting: {formatDate(lowongan.tanggal_posting)}</span>
                                                {lowongan.tanggal_berakhir && (
                                                    <span className="ml-4">Berakhir: {formatDate(lowongan.tanggal_berakhir)}</span>
                                                )}
                                            </div>
                                            
                                            <div className="flex space-x-3">
                                                {isPerusahaan ? (
                                                    <>
                                                        <Link
                                                            href={route('company.jobs.edit', lowongan.id_lowongan)}
                                                            className="px-4 py-2 text-primary border border-primary rounded-md hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-primary"
                                                        >
                                                            Edit
                                                        </Link>
                                                        <button
                                                            onClick={() => {
                                                                if (confirm('Yakin hapus lowongan ini?')) {
                                                                    router.delete(route('company.jobs.destroy', lowongan.id_lowongan));
                                                                }
                                                            }}
                                                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600"
                                                        >
                                                            Hapus
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Link
                                                            href={route('jobs.show', lowongan.id_lowongan)}
                                                            className="px-4 py-2 text-primary border border-primary rounded-md hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-primary"
                                                        >
                                                            Detail
                                                        </Link>
                                                        <button
                                                            onClick={() => router.visit(`/lowongan/${lowongan.id_lowongan}/lamar`)}
                                                            disabled={lowongan.status !== 'dibuka'}
                                                            className={`px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                                                                lowongan.status === 'dibuka'
                                                                    ? 'bg-primary text-white hover:bg-primary/90'
                                                                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                                            }`}
                                                        >
                                                            Lamar
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="bg-white shadow-sm sm:rounded-lg">
                                <div className="p-12 text-center">
                                    <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                        <svg className="w-12 h-12 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 01-2 2H10a2 2 0 01-2-2V6m8 0H8" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-medium text-primary mb-2">
                                        Tidak Ada Lowongan Ditemukan
                                    </h3>
                                    <p className="text-text-secondary">
                                        Coba ubah filter pencarian Anda atau kembali lagi nanti.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}