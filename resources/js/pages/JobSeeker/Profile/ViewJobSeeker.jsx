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

                            <div className="mb-6 flex justify-between items-center">
                                <h1 className="text-2xl font-bold text-gray-900">Profil Saya</h1>
                                <Link
                                    href={route('jobseeker.profile.edit')}
                                    className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md"
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

                            {/* Informasi Pribadi */}
                            {/* === KODE LAMA TETAP === */}

                            {/* === SKILL SECTION BARU === */}
                            <div className="mb-8">
                                <h3 className="text-xl font-semibold text-gray-900 mb-4 border-b pb-2">
                                    Skill
                                </h3>

                                {jobSeeker?.skills?.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {jobSeeker.skills.map((skill, idx) => (
                                            <span
                                                key={idx}
                                                className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-600">Belum ada skill.</p>
                                )}
                            </div>

                            {/* Social Media & Portfolio */}
                            {/* === KODE LAMA TETAP === */}

                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
