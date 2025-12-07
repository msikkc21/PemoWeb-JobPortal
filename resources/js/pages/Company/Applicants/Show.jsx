import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';

export default function Show({ auth, application }) {
    const resumeUrl = application?.resume?.cv_file ? `/storage/${application.resume.cv_file}` : null;

    const handleReview = () => {
        // Navigate to schedule interview page carrying application id
        const url =
            typeof route === 'function'
                ? route('company.applicants.interviews.create', application.id)
                : `/company/applicants/${application.id}/interviews/create`;
        router.get(url);
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Review Pelamar - ${application?.job_seeker?.name || 'Pelamar'}`} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Review Berkas</h1>
                        <p className="mt-2 text-gray-600">Review berkas & profil pelamar lowongan.</p>
                    </div>
                    <div className="rounded-lg bg-white p-6 shadow">
                        <h3 className="mb-4 text-lg font-medium">Informasi Pelamar</h3>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <p className="text-sm text-gray-500">Nama</p>
                                <p className="font-medium">{application?.job_seeker?.name || '-'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Email</p>
                                <p className="font-medium">{application?.job_seeker?.email || '-'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Telepon</p>
                                <p>{application?.job_seeker?.phone || '-'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Tanggal Lahir</p>
                                <p>{new Date(application.job_seeker.birth_date).toLocaleDateString('id-ID')}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Alamat</p>
                                <p>{application?.job_seeker?.address || '-'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Pendidikan</p>
                                <p>{application?.job_seeker?.education || '-'}</p>
                            </div>
                            <div className="md:col-span-2">
                                <p className="text-sm text-gray-500">Pengalaman</p>
                                <p>{application?.job_seeker?.experience || '-'}</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg bg-white p-6 shadow">
                        <h3 className="mb-4 text-lg font-medium">Keahlian</h3>
                        <div className="flex flex-wrap gap-2">
                            {application?.job_seeker?.skills && application.job_seeker.skills.length > 0 ? (
                                application.job_seeker.skills.map((s) => (
                                    <span key={s.id} className="rounded-md bg-gray-100 px-3 py-1 text-sm">
                                        {s.name} {s.pivot?.level ? `– ${s.pivot.level}` : ''}{' '}
                                        {s.pivot?.experience_years ? `(${s.pivot.experience_years} th)` : ''}
                                    </span>
                                ))
                            ) : (
                                <p className="text-sm text-gray-500">Tidak ada data keahlian</p>
                            )}
                        </div>
                    </div>

                    <div className="rounded-lg bg-white p-6 shadow">
                        <h3 className="mb-4 text-lg font-medium">Curriculum Vitae</h3>
                        {resumeUrl ? (
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">
                                        Upload: {new Date(application.resume.upload_date).toLocaleDateString('id-ID')}
                                    </p>
                                    <p className="font-medium">{application?.resume?.cv_file?.split('/').pop()}</p>
                                </div>
                                <div className="flex gap-2">
                                    <a href={resumeUrl} target="_blank" rel="noreferrer" className="rounded border px-3 py-1 text-sm">
                                        Lihat
                                    </a>
                                    <a href={resumeUrl} download className="rounded bg-indigo-600 px-3 py-1 text-sm text-white">
                                        Download
                                    </a>
                                </div>
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500">Resume tidak tersedia</p>
                        )}
                    </div>

                    <div className="rounded-lg bg-white p-6 shadow">
                        <h3 className="mb-4 text-lg font-medium">Lowongan & Lamaran</h3>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <p className="text-sm text-gray-500">Lowongan</p>
                                <p className="font-medium">{application?.job?.title || '-'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Lokasi</p>
                                <p>{application?.job?.location || '-'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Tanggal Lamar</p>
                                <p>{new Date(application.application_date).toLocaleDateString('id-ID')}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Status Lamaran</p>
                                <p className="font-medium">{application?.status || '-'}</p>
                            </div>

                            {application?.notes && (
                                <div className="md:col-span-2">
                                    <p className="text-sm text-gray-500">Catatan</p>
                                    <p className="whitespace-pre-wrap">{application.notes}</p>
                                </div>
                            )}
                        </div>

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                onClick={handleReview}
                                disabled={application?.status !== 'submitted'}
                                className={`rounded px-4 py-2 text-white ${application?.status === 'submitted' ? 'bg-indigo-600 hover:bg-indigo-700' : 'cursor-not-allowed bg-gray-300'}`}
                            >
                                Jadwalkan
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
