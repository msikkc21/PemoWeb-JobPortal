import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Start({ auth, interview }) {
    const [notes, setNotes] = useState(interview.application_notes || '');
    const [processing, setProcessing] = useState(false);

    const submitAction = (action) => {
        if (!confirm('Yakin ingin mengakhiri interview dengan status: ' + action + ' ?')) return;
        setProcessing(true);
        const url = typeof route === 'function' ? route('company.interviews.complete', interview.id) : `/company/interviews/${interview.id}/complete`;
        router.post(
            url,
            { action, notes },
            {
                onFinish: () => setProcessing(false),
            },
        );
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Mulai Interview - ${interview.job?.title || ''}`} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-gray-900">Mulai Interview</h1>
                        <p className="text-sm text-gray-600">Informasi interview dan hasil.</p>
                    </div>

                    <div className="rounded-lg bg-white p-6 shadow">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <p className="text-sm text-gray-500">Posisi</p>
                                <p className="font-medium">{interview.job?.title || '-'}</p>

                                <p className="mt-2 text-sm text-gray-500">Pelamar</p>
                                <p className="font-medium">{interview.job_seeker?.name || '-'}</p>

                                <p className="mt-2 text-sm text-gray-500">Email</p>
                                <p>{interview.job_seeker?.email || '-'}</p>
                            </div>

                            <div className="text-right">
                                <p className="text-sm text-gray-500">Waktu</p>
                                <p className="font-medium">{interview.schedule ? new Date(interview.schedule).toLocaleString('id-ID') : '-'}</p>

                                <p className="mt-2 text-sm text-gray-500">Lokasi</p>
                                <p className="font-medium">{interview.location || '-'}</p>

                                <p className="mt-2 text-sm text-gray-500">Status</p>
                                <p className="font-medium">{interview.status}</p>
                            </div>
                        </div>

                        <div className="mt-6">
                            <label className="block text-sm font-medium text-gray-700">Catatan untuk Lamaran</label>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                rows={6}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                placeholder="Masukkan catatan tentang pelamar (akan disimpan ke field notes lamaran)."
                            />
                        </div>

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                onClick={() => submitAction('ditolak')}
                                disabled={processing}
                                className="rounded border px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                            >
                                Ditolak
                            </button>

                            <button
                                onClick={() => submitAction('offered')}
                                disabled={processing}
                                className="rounded border px-4 py-2 text-sm text-yellow-700 hover:bg-yellow-50"
                            >
                                Offered
                            </button>

                            <button
                                onClick={() => submitAction('diterima')}
                                disabled={processing}
                                className="rounded bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700"
                            >
                                Diterima
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
