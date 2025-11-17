import { Head, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';

export default function OnboardingJobSeeker({ auth, jobSeeker }) {
    const { data, setData, post, processing, errors } = useForm({
        // Field wajib
        name: jobSeeker?.name || '',
        gender: jobSeeker?.gender || '',
        birth_place: jobSeeker?.birth_place || '',
        birth_date: jobSeeker?.birth_date || '',
        phone: jobSeeker?.phone || '',
        address: jobSeeker?.address || '',
        education: jobSeeker?.education || '',
        
        // Field opsional
        experience: jobSeeker?.experience || '',
        description: jobSeeker?.description || '',
        photo_path: jobSeeker?.photo_path || '',
        linkedin: jobSeeker?.linkedin || '',
        github: jobSeeker?.github || '',
        portfolio: jobSeeker?.portfolio || '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('jobseeker.onboarding.store'), {
            forceFormData: true,
        });
    };

    return (
        <>
            <Head title="Onboarding Pencari Kerja" />

            <div className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-8">
                            {/* Header */}
                            <div className="mb-8">
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                    Selamat Datang! 🎉
                                </h1>
                                <p className="text-gray-600">
                                    Lengkapi profil Anda untuk mulai mencari
                                    pekerjaan impian. Semua field bertanda{' '}
                                    <span className="text-red-500">*</span> wajib diisi.
                                </p>
                            </div>

                            <form onSubmit={submit}>
                                <div className="space-y-6">
                                    {/* Section: Data Pribadi */}
                                    <div className="border-b border-gray-200 pb-6">
                                        <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                            Data Pribadi
                                        </h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* Name */}
                                            <div>
                                                <InputLabel
                                                    htmlFor="name"
                                                    value="Nama Lengkap *"
                                                />
                                                <TextInput
                                                    id="name"
                                                    type="text"
                                                    className="mt-1 block w-full"
                                                    value={data.name}
                                                    onChange={(e) =>
                                                        setData('name', e.target.value)
                                                    }
                                                    required
                                                    autoFocus
                                                />
                                                <InputError
                                                    message={errors.name}
                                                    className="mt-2"
                                                />
                                            </div>

                                            {/* Gender */}
                                            <div>
                                                <InputLabel
                                                    htmlFor="gender"
                                                    value="Jenis Kelamin *"
                                                />
                                                <select
                                                    id="gender"
                                                    className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                                    value={data.gender}
                                                    onChange={(e) =>
                                                        setData('gender', e.target.value)
                                                    }
                                                    required
                                                >
                                                    <option value="">Pilih...</option>
                                                    <option value="male">
                                                        Laki-laki
                                                    </option>
                                                    <option value="female">
                                                        Perempuan
                                                    </option>
                                                </select>
                                                <InputError
                                                    message={errors.gender}
                                                    className="mt-2"
                                                />
                                            </div>

                                            {/* Birth Place */}
                                            <div>
                                                <InputLabel
                                                    htmlFor="birth_place"
                                                    value="Tempat Lahir *"
                                                />
                                                <TextInput
                                                    id="birth_place"
                                                    type="text"
                                                    className="mt-1 block w-full"
                                                    value={data.birth_place}
                                                    onChange={(e) =>
                                                        setData(
                                                            'birth_place',
                                                            e.target.value,
                                                        )
                                                    }
                                                    required
                                                />
                                                <InputError
                                                    message={errors.birth_place}
                                                    className="mt-2"
                                                />
                                            </div>

                                            {/* Birth Date */}
                                            <div>
                                                <InputLabel
                                                    htmlFor="birth_date"
                                                    value="Tanggal Lahir *"
                                                />
                                                <TextInput
                                                    id="birth_date"
                                                    type="date"
                                                    className="mt-1 block w-full"
                                                    value={data.birth_date}
                                                    onChange={(e) =>
                                                        setData(
                                                            'birth_date',
                                                            e.target.value,
                                                        )
                                                    }
                                                    required
                                                />
                                                <InputError
                                                    message={errors.birth_date}
                                                    className="mt-2"
                                                />
                                            </div>

                                            {/* Phone */}
                                            <div>
                                                <InputLabel
                                                    htmlFor="phone"
                                                    value="Nomor Telepon *"
                                                />
                                                <TextInput
                                                    id="phone"
                                                    type="tel"
                                                    className="mt-1 block w-full"
                                                    value={data.phone}
                                                    onChange={(e) =>
                                                        setData('phone', e.target.value)
                                                    }
                                                    placeholder="Contoh: 081234567890"
                                                    required
                                                />
                                                <InputError
                                                    message={errors.phone}
                                                    className="mt-2"
                                                />
                                            </div>

                                            {/* Education */}
                                            <div>
                                                <InputLabel
                                                    htmlFor="education"
                                                    value="Pendidikan Terakhir *"
                                                />
                                                <TextInput
                                                    id="education"
                                                    type="text"
                                                    className="mt-1 block w-full"
                                                    value={data.education}
                                                    onChange={(e) =>
                                                        setData(
                                                            'education',
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="Contoh: S1 Teknik Informatika"
                                                    required
                                                />
                                                <InputError
                                                    message={errors.education}
                                                    className="mt-2"
                                                />
                                            </div>

                                            {/* Photo Upload */}
                                            <div className="md:col-span-2">
                                                <InputLabel
                                                    htmlFor="photo_path"
                                                    value="Foto Profil"
                                                />
                                                <input
                                                    id="photo_path"
                                                    type="file"
                                                    className="mt-1 block w-full text-sm text-gray-500
                                                        file:mr-4 file:py-2 file:px-4
                                                        file:rounded-md file:border-0
                                                        file:text-sm file:font-semibold
                                                        file:bg-indigo-50 file:text-indigo-700
                                                        hover:file:bg-indigo-100"
                                                    onChange={(e) =>
                                                        setData('photo_path', e.target.files[0])
                                                    }
                                                    accept="image/*"
                                                />
                                                <p className="mt-1 text-sm text-gray-500">
                                                    Format: JPG, JPEG, PNG. Maksimal 2MB.
                                                </p>
                                                <InputError
                                                    message={errors.photo_path}
                                                    className="mt-2"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Section: Alamat */}
                                    <div className="border-b border-gray-200 pb-6">
                                        <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                            Alamat
                                        </h2>
                                        <div>
                                            <InputLabel
                                                htmlFor="address"
                                                value="Alamat Lengkap *"
                                            />
                                            <textarea
                                                id="address"
                                                className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                                value={data.address}
                                                onChange={(e) =>
                                                    setData('address', e.target.value)
                                                }
                                                rows="3"
                                                placeholder="Alamat tempat tinggal Anda..."
                                                required
                                            />
                                            <InputError
                                                message={errors.address}
                                                className="mt-2"
                                            />
                                        </div>
                                    </div>

                                    {/* Section: Pengalaman & Deskripsi */}
                                    <div className="border-b border-gray-200 pb-6">
                                        <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                            Pengalaman & Deskripsi Diri
                                        </h2>
                                        <div className="space-y-6">
                                            {/* Experience */}
                                            <div>
                                                <InputLabel
                                                    htmlFor="experience"
                                                    value="Pengalaman Kerja"
                                                />
                                                <textarea
                                                    id="experience"
                                                    className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                                    value={data.experience}
                                                    onChange={(e) =>
                                                        setData(
                                                            'experience',
                                                            e.target.value,
                                                        )
                                                    }
                                                    rows="4"
                                                    placeholder="Ceritakan pengalaman kerja Anda (jika ada)..."
                                                />
                                                <InputError
                                                    message={errors.experience}
                                                    className="mt-2"
                                                />
                                            </div>

                                            {/* Description */}
                                            <div>
                                                <InputLabel
                                                    htmlFor="description"
                                                    value="Deskripsi Diri"
                                                />
                                                <textarea
                                                    id="description"
                                                    className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                                    value={data.description}
                                                    onChange={(e) =>
                                                        setData(
                                                            'description',
                                                            e.target.value,
                                                        )
                                                    }
                                                    rows="4"
                                                    placeholder="Ceritakan tentang diri Anda..."
                                                />
                                                <InputError
                                                    message={errors.description}
                                                    className="mt-2"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Section: Link Sosial Media */}
                                    <div>
                                        <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                            Link Sosial Media & Portfolio
                                        </h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* LinkedIn */}
                                            <div>
                                                <InputLabel
                                                    htmlFor="linkedin"
                                                    value="LinkedIn"
                                                />
                                                <TextInput
                                                    id="linkedin"
                                                    type="url"
                                                    className="mt-1 block w-full"
                                                    value={data.linkedin}
                                                    onChange={(e) =>
                                                        setData('linkedin', e.target.value)
                                                    }
                                                    placeholder="https://linkedin.com/in/username"
                                                />
                                                <InputError
                                                    message={errors.linkedin}
                                                    className="mt-2"
                                                />
                                            </div>

                                            {/* GitHub */}
                                            <div>
                                                <InputLabel
                                                    htmlFor="github"
                                                    value="GitHub"
                                                />
                                                <TextInput
                                                    id="github"
                                                    type="url"
                                                    className="mt-1 block w-full"
                                                    value={data.github}
                                                    onChange={(e) =>
                                                        setData('github', e.target.value)
                                                    }
                                                    placeholder="https://github.com/username"
                                                />
                                                <InputError
                                                    message={errors.github}
                                                    className="mt-2"
                                                />
                                            </div>

                                            {/* Portfolio */}
                                            <div className="md:col-span-2">
                                                <InputLabel
                                                    htmlFor="portfolio"
                                                    value="Portfolio"
                                                />
                                                <TextInput
                                                    id="portfolio"
                                                    type="url"
                                                    className="mt-1 block w-full"
                                                    value={data.portfolio}
                                                    onChange={(e) =>
                                                        setData('portfolio', e.target.value)
                                                    }
                                                    placeholder="https://yourportfolio.com"
                                                />
                                                <InputError
                                                    message={errors.portfolio}
                                                    className="mt-2"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div className="flex items-center justify-end mt-8 pt-6 border-t border-gray-200">
                                    <PrimaryButton
                                        className="px-8"
                                        disabled={processing}
                                    >
                                        {processing ? 'Menyimpan...' : 'Lanjutkan ke Dashboard'}
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
