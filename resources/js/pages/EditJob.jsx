import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function EditJob({ auth, lowongan, skills = [] }) {
    const { data, setData, put, processing, errors } = useForm({
        judul: lowongan?.judul || '',
        deskripsi: lowongan?.deskripsi || '',
        persyaratan: lowongan?.persyaratan || '',
        gaji: lowongan?.gaji || '',
        lokasi: lowongan?.lokasi || '',
        jenis_pekerjaan: lowongan?.jenis_pekerjaan || 'Full-time',
        level_pekerjaan: lowongan?.level_pekerjaan || 'Entry Level',
        tanggal_berakhir: lowongan?.tanggal_berakhir || '',
        status: lowongan?.status || 'dibuka',
        skills: lowongan?.skills?.map(s => s.id) || [],
    });

    const [searchSkill, setSearchSkill] = useState('');
    const [showSkillDropdown, setShowSkillDropdown] = useState(false);

    const jenisPekerjaanOptions = [
        'Full-time',
        'Part-time',
        'Contract',
        'Freelance',
        'Internship',
    ];

    const levelPekerjaanOptions = [
        'Entry Level',
        'Junior',
        'Mid Level',
        'Senior',
        'Manager',
        'Director',
    ];

    const statusOptions = [
        { value: 'dibuka', label: 'Dibuka' },
        { value: 'ditutup', label: 'Ditutup' },
    ];

    const filteredSkills = skills.filter(
        (skill) =>
            skill.nama_keahlian.toLowerCase().includes(searchSkill.toLowerCase()) &&
            !data.skills.includes(skill.id)
    );

    const handleAddSkill = (skillId) => {
        if (!data.skills.includes(skillId)) {
            setData('skills', [...data.skills, skillId]);
        }
        setSearchSkill('');
        setShowSkillDropdown(false);
    };

    const handleRemoveSkill = (skillId) => {
        setData('skills', data.skills.filter((id) => id !== skillId));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('company.jobs.update', lowongan.id_lowongan));
    };

    const getSkillName = (skillId) => {
        return skills.find((s) => s.id === skillId)?.nama_keahlian || '';
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Edit Lowongan Pekerjaan
                </h2>
            }
        >
            <Head title={`Edit Lowongan: ${lowongan?.judul || ''}`} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="bg-white shadow-sm sm:rounded-lg border border-gray-200">
                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* Judul Lowongan */}
                            <div>
                                <label htmlFor="judul" className="block text-sm font-medium text-gray-700">
                                    Judul Lowongan <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="judul"
                                    value={data.judul}
                                    onChange={(e) => setData('judul', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                                    placeholder="Contoh: Software Engineer"
                                    required
                                />
                                {errors.judul && (
                                    <p className="mt-1 text-sm text-red-600">{errors.judul}</p>
                                )}
                            </div>

                            {/* Deskripsi */}
                            <div>
                                <label htmlFor="deskripsi" className="block text-sm font-medium text-gray-700">
                                    Deskripsi Pekerjaan <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    id="deskripsi"
                                    rows="5"
                                    value={data.deskripsi}
                                    onChange={(e) => setData('deskripsi', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                                    placeholder="Jelaskan tanggung jawab dan tugas pekerjaan..."
                                    required
                                />
                                {errors.deskripsi && (
                                    <p className="mt-1 text-sm text-red-600">{errors.deskripsi}</p>
                                )}
                            </div>

                            {/* Persyaratan */}
                            <div>
                                <label htmlFor="persyaratan" className="block text-sm font-medium text-gray-700">
                                    Persyaratan <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    id="persyaratan"
                                    rows="5"
                                    value={data.persyaratan}
                                    onChange={(e) => setData('persyaratan', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                                    placeholder="Jelaskan kualifikasi dan persyaratan yang dibutuhkan..."
                                    required
                                />
                                {errors.persyaratan && (
                                    <p className="mt-1 text-sm text-red-600">{errors.persyaratan}</p>
                                )}
                            </div>

                            {/* Grid 2 Kolom */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Gaji */}
                                <div>
                                    <label htmlFor="gaji" className="block text-sm font-medium text-gray-700">
                                        Gaji (Rp)
                                    </label>
                                    <input
                                        type="number"
                                        id="gaji"
                                        value={data.gaji}
                                        onChange={(e) => setData('gaji', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                                        placeholder="5000000"
                                        min="0"
                                    />
                                    {errors.gaji && (
                                        <p className="mt-1 text-sm text-red-600">{errors.gaji}</p>
                                    )}
                                </div>

                                {/* Lokasi */}
                                <div>
                                    <label htmlFor="lokasi" className="block text-sm font-medium text-gray-700">
                                        Lokasi <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="lokasi"
                                        value={data.lokasi}
                                        onChange={(e) => setData('lokasi', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                                        placeholder="Jakarta, Indonesia"
                                        required
                                    />
                                    {errors.lokasi && (
                                        <p className="mt-1 text-sm text-red-600">{errors.lokasi}</p>
                                    )}
                                </div>

                                {/* Jenis Pekerjaan */}
                                <div>
                                    <label htmlFor="jenis_pekerjaan" className="block text-sm font-medium text-gray-700">
                                        Jenis Pekerjaan <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        id="jenis_pekerjaan"
                                        value={data.jenis_pekerjaan}
                                        onChange={(e) => setData('jenis_pekerjaan', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                                        required
                                    >
                                        {jenisPekerjaanOptions.map((option) => (
                                            <option key={option} value={option}>
                                                {option}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.jenis_pekerjaan && (
                                        <p className="mt-1 text-sm text-red-600">{errors.jenis_pekerjaan}</p>
                                    )}
                                </div>

                                {/* Level Pekerjaan */}
                                <div>
                                    <label htmlFor="level_pekerjaan" className="block text-sm font-medium text-gray-700">
                                        Level Pekerjaan <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        id="level_pekerjaan"
                                        value={data.level_pekerjaan}
                                        onChange={(e) => setData('level_pekerjaan', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                                        required
                                    >
                                        {levelPekerjaanOptions.map((option) => (
                                            <option key={option} value={option}>
                                                {option}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.level_pekerjaan && (
                                        <p className="mt-1 text-sm text-red-600">{errors.level_pekerjaan}</p>
                                    )}
                                </div>

                                {/* Status */}
                                <div>
                                    <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                                        Status <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        id="status"
                                        value={data.status}
                                        onChange={(e) => setData('status', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                                        required
                                    >
                                        {statusOptions.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.status && (
                                        <p className="mt-1 text-sm text-red-600">{errors.status}</p>
                                    )}
                                </div>

                                {/* Tanggal Berakhir */}
                                <div>
                                    <label htmlFor="tanggal_berakhir" className="block text-sm font-medium text-gray-700">
                                        Tanggal Berakhir <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        id="tanggal_berakhir"
                                        value={data.tanggal_berakhir}
                                        onChange={(e) => setData('tanggal_berakhir', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                                        required
                                    />
                                    {errors.tanggal_berakhir && (
                                        <p className="mt-1 text-sm text-red-600">{errors.tanggal_berakhir}</p>
                                    )}
                                </div>
                            </div>

                            {/* Skills */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Keahlian yang Dibutuhkan
                                </label>

                                {/* Selected Skills */}
                                {data.skills.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {data.skills.map((skillId) => (
                                            <span
                                                key={skillId}
                                                className="inline-flex items-center px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                                            >
                                                {getSkillName(skillId)}
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveSkill(skillId)}
                                                    className="ml-2 text-primary hover:text-primary/70"
                                                >
                                                    ×
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {/* Search Skills */}
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={searchSkill}
                                        onChange={(e) => {
                                            setSearchSkill(e.target.value);
                                            setShowSkillDropdown(true);
                                        }}
                                        onFocus={() => setShowSkillDropdown(true)}
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                                        placeholder="Cari keahlian..."
                                    />

                                    {/* Dropdown */}
                                    {showSkillDropdown && searchSkill && filteredSkills.length > 0 && (
                                        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                                            {filteredSkills.map((skill) => (
                                                <button
                                                    key={skill.id}
                                                    type="button"
                                                    onClick={() => handleAddSkill(skill.id)}
                                                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                                                >
                                                    {skill.nama_keahlian}
                                                    {skill.kategori && (
                                                        <span className="ml-2 text-xs text-gray-500">
                                                            ({skill.kategori})
                                                        </span>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                {errors.skills && (
                                    <p className="mt-1 text-sm text-red-600">{errors.skills}</p>
                                )}
                            </div>

                            {/* Info Approval */}
                            {lowongan?.approve === 0 && (
                                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                                    <p className="text-sm text-yellow-800">
                                        <strong>Catatan:</strong> Lowongan ini sedang menunggu persetujuan dari admin.
                                    </p>
                                </div>
                            )}

                            {/* Buttons */}
                            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={() => window.history.back()}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                                >
                                    {processing ? 'Menyimpan...' : 'Update Lowongan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}