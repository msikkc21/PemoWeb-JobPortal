import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function ScheduleInterview({ auth, application }) {
    const { flash, errors } = usePage().props;
    const [schedule, setSchedule] = useState('');
    const [location, setLocation] = useState('');
    const [processing, setProcessing] = useState(false);
    const [alert, setAlert] = useState(null);
    const applicationId = application?.id;

    // Show flash messages and errors
    useEffect(() => {
        if (flash?.success) {
            setAlert({ type: 'success', message: flash.success });
        }
        if (flash?.error) {
            setAlert({ type: 'error', message: flash.error });
        }
        if (errors && Object.keys(errors).length > 0) {
            const errorMsg = Object.values(errors).flat().join(', ');
            setAlert({ type: 'error', message: errorMsg });
        }
    }, [flash, errors]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!applicationId) {
            setAlert({ type: 'error', message: 'Application ID tidak ditemukan.' });
            return;
        }
        if (!schedule || !location) {
            setAlert({ type: 'error', message: 'Harap mengisi tanggal/waktu dan lokasi.' });
            return;
        }

        setProcessing(true);
        setAlert({ type: 'info', message: 'Menyimpan jadwal interview...' });

        router.post('/company/interviews',
            {
                application_id: applicationId,
                schedule,
                location
            },
            {
                onSuccess: () => {
                    setAlert({ type: 'success', message: 'Interview berhasil dijadwalkan!' });
                },
                onError: (errors) => {
                    const errorMsg = Object.values(errors).flat().join(', ');
                    setAlert({ type: 'error', message: `Gagal: ${errorMsg}` });
                },
                onFinish: () => setProcessing(false),
            }
        );
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Jadwalkan Interview - ${application?.job_seeker?.name || 'Pelamar'}`} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    {/* Alert Component */}
                    {alert && (
                        <div className={`p-4 rounded-md ${alert.type === 'success' ? 'bg-green-100 border border-green-400 text-green-700' :
                                alert.type === 'error' ? 'bg-red-100 border border-red-400 text-red-700' :
                                    'bg-blue-100 border border-blue-400 text-blue-700'
                            }`}>
                            <div className="flex justify-between items-center">
                                <span>{alert.message}</span>
                                <button onClick={() => setAlert(null)} className="ml-4 text-lg font-bold">&times;</button>
                            </div>
                        </div>
                    )}

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
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Tanggal & Waktu</label>
                                <input
                                    type="datetime-local"
                                    value={schedule}
                                    onChange={(e) => setSchedule(e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Lokasi</label>
                                <input
                                    type="text"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    placeholder="Contoh: Kantor Jakarta / Zoom link"
                                    required
                                />
                            </div>

                            <div className="flex justify-end gap-3">
                                <a
                                    href={`/company/applicants/${applicationId}`}
                                    className="rounded border px-4 py-2 hover:bg-gray-50"
                                >
                                    Batal
                                </a>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className={`rounded px-4 py-2 text-white ${processing ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
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
