import { Head, useForm, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';

export default function EditJobSeeker({ auth, jobSeeker }) {
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

        /* === TAMBAHAN BARU === */
        skills: jobSeeker?.skills || [],
        newSkill: '',
    });

    const photoUrl = jobSeeker?.photo_path ? `/storage/${jobSeeker.photo_path}` : null;

    const submit = (e) => {
        e.preventDefault();
        post(route('jobseeker.profile.update'), {
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

                            <div className="mb-6 flex justify-between items-center">
                                <h1 className="text-2xl font-bold text-gray-900">Edit Profil</h1>
                                <Link
                                    href={route('jobseeker.profile.show')}
                                    className="text-gray-600 hover:text-gray-900"
                                >
                                    Kembali
                                </Link>
                            </div>

                            <form onSubmit={submit}>
                                <div className="space-y-6">

                                    {/* === SELURUH KODE LAMA TETAP === */}
                                    {/* Personal Info, Education, Contact, Social Media, dll. */}

                                    {/* === SECTION SKILL BARU === */}
                                    <div className="border-b border-gray-200 pb-6">
                                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Skill</h2>

                                        <div className="flex gap-4">
                                            <input
                                                type="text"
                                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                                placeholder="Contoh: Python, C++, HTML"
                                                value={data.newSkill}
                                                onChange={(e) => setData('newSkill', e.target.value)}
                                            />

                                            <button
                                                type="button"
                                                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                                                onClick={() => {
                                                    if (data.newSkill.trim() !== '') {
                                                        setData('skills', [...data.skills, data.newSkill]);
                                                        setData('newSkill', '');
                                                    }
                                                }}
                                            >
                                                Tambah
                                            </button>
                                        </div>

                                        <div className="mt-4 flex flex-wrap gap-2">
                                            {data.skills.map((skill, index) => (
                                                <span
                                                    key={index}
                                                    className="px-3 py-1 bg-gray-200 rounded-full text-sm flex items-center gap-2"
                                                >
                                                    {skill}
                                                    <button
                                                        type="button"
                                                        className="text-red-600 font-bold"
                                                        onClick={() => {
                                                            setData(
                                                                'skills',
                                                                data.skills.filter((_, i) => i !== index)
                                                            );
                                                        }}
                                                    >
                                                        ✕
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                </div>

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
