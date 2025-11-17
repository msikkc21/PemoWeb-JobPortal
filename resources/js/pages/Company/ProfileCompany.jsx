import { Head, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';

export default function ProfileCompany({ auth, company }) {
    const { data, setData, post, processing, errors } = useForm({
        company_name: company?.company_name || '',
        industry: company?.industry || '',
        description: company?.description || '',
        location: company?.location || '',
        company_email: company?.company_email || '',
        phone: company?.phone || '',
        website: company?.website || '',
        address: company?.address || '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('company.profile.update'));
    };

    return (
        <>
            <Head title="Lengkapi Profil Perusahaan" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h1 className="text-2xl font-semibold mb-6">
                                Lengkapi Profil Perusahaan
                            </h1>
                            <p className="mb-6 text-gray-600">
                                Silakan lengkapi profil perusahaan Anda untuk
                                dapat mengakses dashboard dan fitur lainnya.
                            </p>

                            <form onSubmit={submit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Company Name */}
                                    <div>
                                        <InputLabel
                                            htmlFor="company_name"
                                            value="Nama Perusahaan *"
                                        />
                                        <TextInput
                                            id="company_name"
                                            type="text"
                                            className="mt-1 block w-full"
                                            value={data.company_name}
                                            onChange={(e) =>
                                                setData(
                                                    'company_name',
                                                    e.target.value,
                                                )
                                            }
                                            required
                                        />
                                        <InputError
                                            message={errors.company_name}
                                            className="mt-2"
                                        />
                                    </div>

                                    {/* Industry */}
                                    <div>
                                        <InputLabel
                                            htmlFor="industry"
                                            value="Industri *"
                                        />
                                        <TextInput
                                            id="industry"
                                            type="text"
                                            className="mt-1 block w-full"
                                            value={data.industry}
                                            onChange={(e) =>
                                                setData('industry', e.target.value)
                                            }
                                            required
                                        />
                                        <InputError
                                            message={errors.industry}
                                            className="mt-2"
                                        />
                                    </div>

                                    {/* Location */}
                                    <div>
                                        <InputLabel
                                            htmlFor="location"
                                            value="Lokasi *"
                                        />
                                        <TextInput
                                            id="location"
                                            type="text"
                                            className="mt-1 block w-full"
                                            value={data.location}
                                            onChange={(e) =>
                                                setData('location', e.target.value)
                                            }
                                            required
                                        />
                                        <InputError
                                            message={errors.location}
                                            className="mt-2"
                                        />
                                    </div>

                                    {/* Company Email */}
                                    <div>
                                        <InputLabel
                                            htmlFor="company_email"
                                            value="Email Perusahaan *"
                                        />
                                        <TextInput
                                            id="company_email"
                                            type="email"
                                            className="mt-1 block w-full"
                                            value={data.company_email}
                                            onChange={(e) =>
                                                setData(
                                                    'company_email',
                                                    e.target.value,
                                                )
                                            }
                                            required
                                        />
                                        <InputError
                                            message={errors.company_email}
                                            className="mt-2"
                                        />
                                    </div>

                                    {/* Phone */}
                                    <div>
                                        <InputLabel
                                            htmlFor="phone"
                                            value="Telepon *"
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

                                    {/* Website */}
                                    <div>
                                        <InputLabel
                                            htmlFor="website"
                                            value="Website"
                                        />
                                        <TextInput
                                            id="website"
                                            type="url"
                                            className="mt-1 block w-full"
                                            value={data.website}
                                            onChange={(e) =>
                                                setData('website', e.target.value)
                                            }
                                        />
                                        <InputError
                                            message={errors.website}
                                            className="mt-2"
                                        />
                                    </div>

                                    {/* Description */}
                                    <div className="md:col-span-2">
                                        <InputLabel
                                            htmlFor="description"
                                            value="Deskripsi Perusahaan *"
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
                                            required
                                        />
                                        <InputError
                                            message={errors.description}
                                            className="mt-2"
                                        />
                                    </div>

                                    {/* Address */}
                                    <div className="md:col-span-2">
                                        <InputLabel
                                            htmlFor="address"
                                            value="Alamat Lengkap"
                                        />
                                        <textarea
                                            id="address"
                                            className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                            value={data.address}
                                            onChange={(e) =>
                                                setData('address', e.target.value)
                                            }
                                            rows="3"
                                        />
                                        <InputError
                                            message={errors.address}
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
