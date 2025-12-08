import { Head, useForm, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { useState } from 'react';

export default function EditJobSeeker({ auth, jobSeeker, skills = [], existingSkills = [] }) {
    const [selectedSkills, setSelectedSkills] = useState(
        existingSkills.map(s => ({ skill_id: s.id, level: s.level }))
    );

    const { data, setData, post, processing, errors } = useForm({
        name: jobSeeker?.name || '',
        gender: jobSeeker?.gender || '',
        birth_place: jobSeeker?.birth_place || '',
        birth_date: jobSeeker?.birth_date || '',
        phone: jobSeeker?.phone || '',
        education: jobSeeker?.education || '',
        address: jobSeeker?.address || '',
        experience: jobSeeker?.experience || '',
        description: jobSeeker?.description || '',
        linkedin_url: jobSeeker?.linkedin_url || '',
        github_url: jobSeeker?.github_url || '',
        portfolio_url: jobSeeker?.portfolio_url || '',
        photo_path: null,
        skills: existingSkills.map(s => ({ skill_id: s.id, level: s.level })),
    });

    const photoUrl = jobSeeker?.photo_path ? `/storage/${jobSeeker.photo_path}` : null;

    const addSkill = () => {
        const newSkills = [...selectedSkills, { skill_id: '', level: 'beginner' }];
        setSelectedSkills(newSkills);
        setData('skills', newSkills);
    };

    const removeSkill = (index) => {
        const newSkills = selectedSkills.filter((_, i) => i !== index);
        setSelectedSkills(newSkills);
        setData('skills', newSkills);
    };

    const updateSkill = (index, field, value) => {
        const newSkills = selectedSkills.map((skill, i) =>
            i === index ? { ...skill, [field]: field === 'skill_id' ? parseInt(value) : value } : skill
        );
        setSelectedSkills(newSkills);
        setData('skills', newSkills);
    };

    const getAvailableSkills = (currentIndex) => {
        const selectedIds = selectedSkills
            .filter((_, i) => i !== currentIndex)
            .map(s => s.skill_id);
        return skills.filter(s => !selectedIds.includes(s.id));
    };

    const submit = (e) => {
        e.preventDefault();
        post('/jobseeker/profile/update', {
            forceFormData: true,
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Edit Profil" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-8">
                            {/* Header */}
                            <div className="mb-6 flex justify-between items-center">
                                <h1 className="text-2xl font-bold text-gray-900">Edit Profil</h1>
                                <Link
                                    href="/jobseeker/profile"
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

                                    {/* Personal Info Section */}
                                    <div className="border-b border-gray-200 pb-6">
                                        <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                            Informasi Pribadi
                                        </h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="md:col-span-2">
                                                <InputLabel htmlFor="name" value="Nama Lengkap *" />
                                                <TextInput
                                                    id="name"
                                                    type="text"
                                                    className="mt-1 block w-full"
                                                    value={data.name}
                                                    onChange={(e) => setData('name', e.target.value)}
                                                    required
                                                />
                                                <InputError message={errors.name} className="mt-2" />
                                            </div>

                                            <div>
                                                <InputLabel htmlFor="gender" value="Jenis Kelamin *" />
                                                <select
                                                    id="gender"
                                                    className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                                    value={data.gender}
                                                    onChange={(e) => setData('gender', e.target.value)}
                                                    required
                                                >
                                                    <option value="">Pilih Jenis Kelamin</option>
                                                    <option value="male">Laki-laki</option>
                                                    <option value="female">Perempuan</option>
                                                </select>
                                                <InputError message={errors.gender} className="mt-2" />
                                            </div>

                                            <div>
                                                <InputLabel htmlFor="birth_place" value="Tempat Lahir *" />
                                                <TextInput
                                                    id="birth_place"
                                                    type="text"
                                                    className="mt-1 block w-full"
                                                    value={data.birth_place}
                                                    onChange={(e) => setData('birth_place', e.target.value)}
                                                    required
                                                />
                                                <InputError message={errors.birth_place} className="mt-2" />
                                            </div>

                                            <div>
                                                <InputLabel htmlFor="birth_date" value="Tanggal Lahir *" />
                                                <TextInput
                                                    id="birth_date"
                                                    type="date"
                                                    className="mt-1 block w-full"
                                                    value={data.birth_date}
                                                    onChange={(e) => setData('birth_date', e.target.value)}
                                                    required
                                                />
                                                <InputError message={errors.birth_date} className="mt-2" />
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

                                            {/* Photo Upload */}
                                            <div className="md:col-span-2">
                                                <InputLabel htmlFor="photo_path" value="Upload Foto Baru" />
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

                                    {/* Skills Section */}
                                    <div className="border-b border-gray-200 pb-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <h2 className="text-xl font-semibold text-gray-900">
                                                Keahlian (Skills)
                                            </h2>
                                            <button
                                                type="button"
                                                onClick={addSkill}
                                                className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-md hover:bg-indigo-100"
                                            >
                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                                </svg>
                                                Tambah Skill
                                            </button>
                                        </div>

                                        <p className="text-sm text-gray-500 mb-4">
                                            Pilih keahlian yang Anda miliki untuk meningkatkan kecocokan dengan lowongan pekerjaan.
                                        </p>

                                        {selectedSkills.length === 0 ? (
                                            <div className="text-center py-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                                                <p className="text-gray-500">Belum ada skill ditambahkan</p>
                                                <button
                                                    type="button"
                                                    onClick={addSkill}
                                                    className="mt-2 text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                                                >
                                                    + Tambah skill pertama Anda
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                {selectedSkills.map((skill, index) => (
                                                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                                        <div className="flex-1">
                                                            <select
                                                                value={skill.skill_id}
                                                                onChange={(e) => updateSkill(index, 'skill_id', e.target.value)}
                                                                className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                            >
                                                                <option value="">Pilih Skill...</option>
                                                                {getAvailableSkills(index).map(s => (
                                                                    <option key={s.id} value={s.id}>{s.name}</option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                        <div className="w-40">
                                                            <select
                                                                value={skill.level}
                                                                onChange={(e) => updateSkill(index, 'level', e.target.value)}
                                                                className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                            >
                                                                <option value="beginner">Pemula</option>
                                                                <option value="intermediate">Menengah</option>
                                                                <option value="expert">Ahli</option>
                                                            </select>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => removeSkill(index)}
                                                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                                                        >
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        <InputError message={errors.skills} className="mt-2" />
                                    </div>

                                    {/* Education & Experience Section */}
                                    <div className="border-b border-gray-200 pb-6">
                                        <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                            Pendidikan & Pengalaman
                                        </h2>
                                        <div className="grid grid-cols-1 gap-6">
                                            <div>
                                                <InputLabel htmlFor="education" value="Pendidikan Terakhir *" />
                                                <TextInput
                                                    id="education"
                                                    type="text"
                                                    className="mt-1 block w-full"
                                                    value={data.education}
                                                    onChange={(e) => setData('education', e.target.value)}
                                                    required
                                                />
                                                <InputError message={errors.education} className="mt-2" />
                                            </div>

                                            <div>
                                                <InputLabel htmlFor="experience" value="Pengalaman" />
                                                <textarea
                                                    id="experience"
                                                    className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                                    value={data.experience}
                                                    onChange={(e) => setData('experience', e.target.value)}
                                                    rows="4"
                                                />
                                                <InputError message={errors.experience} className="mt-2" />
                                            </div>

                                            <div>
                                                <InputLabel htmlFor="description" value="Deskripsi Diri" />
                                                <textarea
                                                    id="description"
                                                    className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                                    value={data.description}
                                                    onChange={(e) => setData('description', e.target.value)}
                                                    rows="4"
                                                />
                                                <InputError message={errors.description} className="mt-2" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Address Section */}
                                    <div className="border-b border-gray-200 pb-6">
                                        <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                            Alamat Lengkap
                                        </h2>
                                        <div>
                                            <InputLabel htmlFor="address" value="Alamat *" />
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

                                    {/* Social Media Section */}
                                    <div>
                                        <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                            Media Sosial & Portfolio
                                        </h2>
                                        <div className="grid grid-cols-1 gap-6">
                                            <div>
                                                <InputLabel htmlFor="linkedin_url" value="LinkedIn URL" />
                                                <TextInput
                                                    id="linkedin_url"
                                                    type="url"
                                                    className="mt-1 block w-full"
                                                    value={data.linkedin_url}
                                                    onChange={(e) => setData('linkedin_url', e.target.value)}
                                                    placeholder="https://linkedin.com/in/..."
                                                />
                                                <InputError message={errors.linkedin_url} className="mt-2" />
                                            </div>

                                            <div>
                                                <InputLabel htmlFor="github_url" value="GitHub URL" />
                                                <TextInput
                                                    id="github_url"
                                                    type="url"
                                                    className="mt-1 block w-full"
                                                    value={data.github_url}
                                                    onChange={(e) => setData('github_url', e.target.value)}
                                                    placeholder="https://github.com/..."
                                                />
                                                <InputError message={errors.github_url} className="mt-2" />
                                            </div>

                                            <div>
                                                <InputLabel htmlFor="portfolio_url" value="Portfolio URL" />
                                                <TextInput
                                                    id="portfolio_url"
                                                    type="url"
                                                    className="mt-1 block w-full"
                                                    value={data.portfolio_url}
                                                    onChange={(e) => setData('portfolio_url', e.target.value)}
                                                    placeholder="https://..."
                                                />
                                                <InputError message={errors.portfolio_url} className="mt-2" />
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
