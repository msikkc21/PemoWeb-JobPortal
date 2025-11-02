import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

export default function ScheduleInterview({ auth, application }) {
    const [schedule, setSchedule] = useState('');
    const [location, setLocation] = useState('');
    const [processing, setProcessing] = useState(false);
    const applicationId = application?.id;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!applicationId) {
            alert('Application ID tidak ditemukan.');
            return;
        }
        if (!schedule || !location) {
            alert('Harap mengisi tanggal/waktu dan lokasi.');
            return;
        }
        if (!confirm('Jadwalkan interview untuk pelamar ini?')) return;

        setProcessing(true);
        const url = typeof route === 'function' ? route('company.interviews.store') : '/company/interviews';
        router.post(
            url,
            { application_id: applicationId, schedule, location },
            {
                onFinish: () => setProcessing(false),
            },
        );
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Jadwalkan Interview - ${application?.job_seeker?.name || 'Pelamar'}`} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Jadwalkan Interview</h1>
                        <p className="mt-2 text-gray-600">Isi tanggal/waktu dan lokasi interview untuk pelamar ini.</p>
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
                            <div className="md:col-span-2">
                                <p className="text-sm text-gray-500">Lowongan</p>
                                <p className="font-medium">{application?.job?.title || '-'}</p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="mt-6">
                            <input type="hidden" name="application_id" value={applicationId} />

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Tanggal & Waktu</label>
                                <input
                                    type="datetime-local"
                                    value={schedule}
                                    onChange={(e) => setSchedule(e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Lokasi</label>
                                <input
                                    type="text"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                    placeholder="Contoh: Kantor Jakarta / Zoom link"
                                    required
                                />
                            </div>

                            <div className="flex justify-end gap-3">
                                <a
                                    href={
                                        typeof route === 'function'
                                            ? route('company.applicants.show', applicationId)
                                            : `/company/applicants/${applicationId}`
                                    }
                                    className="rounded border px-4 py-2"
                                >
                                    Batal
                                </a>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className={`rounded px-4 py-2 text-white ${processing ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                                >
                                    {processing ? 'Menyimpan...' : 'Simpan & Jadwalkan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
