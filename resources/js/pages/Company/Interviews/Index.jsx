import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Index({ auth, interviews }) {
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
            <Head title="Jadwal Interview" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-gray-900">Jadwal Interview</h1>
                        <p className="mt-2 text-gray-600">Semua jadwal interview untuk perusahaan Anda.</p>
                    </div>

                    {!interviews || interviews.length === 0 ? (
                        <div className="rounded-lg bg-white p-6 shadow">
                            <p className="text-sm text-gray-500">Belum ada jadwal interview.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {interviews.map((it) => (
                                <div key={it.id} className="rounded-lg bg-white p-6 shadow">
                                    <div className="flex items-start justify-between gap-6">
                                        <div>
                                            <p className="text-sm text-gray-500">Posisi</p>
                                            <p className="text-lg font-medium">{it.job?.title || '-'}</p>

                                            <p className="mt-3 text-sm text-gray-500">Pelamar</p>
                                            <p className="font-medium">{it.job_seeker?.name || '-'}</p>

                                            <p className="mt-3 text-sm text-gray-500">Lokasi</p>
                                            <p className="text-sm">{it.location || '-'}</p>
                                        </div>

                                        <div className="text-right">
                                            <p className="text-sm text-gray-500">Waktu</p>
                                            <p className="font-medium">{it.schedule ? new Date(it.schedule).toLocaleString('id-ID') : '-'}</p>

                                            <p className="mt-3 text-sm text-gray-500">Status</p>
                                            <p className="font-medium">{it.status}</p>

                                            <div className="mt-4 flex justify-end gap-2">
                                                <a
                                                    href={
                                                        typeof route === 'function'
                                                            ? route('company.interviews.start', it.id)
                                                            : `/company/interviews/${it.id}/start`
                                                    }
                                                    className="rounded bg-indigo-600 px-3 py-1 text-sm text-white hover:bg-indigo-700"
                                                >
                                                    Mulai Interview
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
