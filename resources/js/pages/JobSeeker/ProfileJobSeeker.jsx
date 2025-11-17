import { Head, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';

export default function ProfileJobSeeker({ auth, jobSeeker }) {
    const { data, setData, post, processing, errors } = useForm({
        name: jobSeeker?.name || '',
        gender: jobSeeker?.gender || '',
        birth_place: jobSeeker?.birth_place || '',
        birth_date: jobSeeker?.birth_date || '',
        phone: jobSeeker?.phone || '',
        address: jobSeeker?.address || '',
        education: jobSeeker?.education || '',
        experience: jobSeeker?.experience || '',
        description: jobSeeker?.description || '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('jobseeker.profile.update'));
    };

    return (
        <>
            <Head title="Lengkapi Profil Job Seeker" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h1 className="text-2xl font-semibold mb-6">
                                Lengkapi Profil Pencari Kerja
                            </h1>
                            <p className="mb-6 text-gray-600">
                                Silakan lengkapi profil Anda untuk dapat
                                mengakses dashboard dan fitur lainnya.
                            </p>

                            <form onSubmit={submit}>
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
                                            required
                                        />
                                        <InputError
                                            message={errors.education}
                                            className="mt-2"
                                        />
                                    </div>

                                    {/* Address */}
                                    <div className="md:col-span-2">
                                        <InputLabel
                                            htmlFor="address"
                                            value="Alamat *"
                                        />
                                        <textarea
                                            id="address"
                                            className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                            value={data.address}
                                            onChange={(e) =>
                                                setData('address', e.target.value)
                                            }
                                            rows="3"
                                            required
                                        />
                                        <InputError
                                            message={errors.address}
                                            className="mt-2"
                                        />
                                    </div>

                                    {/* Experience */}
                                    <div className="md:col-span-2">
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
                                        />
                                        <InputError
                                            message={errors.experience}
                                            className="mt-2"
                                        />
                                    </div>

                                    {/* Description */}
                                    <div className="md:col-span-2">
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
                                        />
                                        <InputError
                                            message={errors.description}
                                            className="mt-2"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center justify-end mt-6">
                                    <PrimaryButton
                                        className="ms-4"
                                        disabled={processing}
                                    >
                                        Simpan Profil
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
