import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { useMemo } from 'react';

const statusBadge = (status) => {
    switch (status) {
        case 'Terjadwal':
            return 'bg-[#0A6CF5]/10 text-[#0A6CF5]';
        case 'Diproses':
            return 'bg-amber-100 text-amber-700';
        case 'Selesai':
            return 'bg-emerald-100 text-emerald-700';
        case 'Ditolak':
            return 'bg-rose-100 text-rose-700';
        case 'Dibatalkan':
            return 'bg-slate-200 text-slate-600';
        default:
            return 'bg-slate-100 text-slate-600';
    }
};

const formatSchedule = (tanggal, waktu) => {
    if (!tanggal) return 'Tanggal belum ditentukan';
    try {
        const display = new Date(`${tanggal}T${waktu || '00:00'}:00`);
        return new Intl.DateTimeFormat('id-ID', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(display);
    } catch (error) {
        return `${tanggal} ${waktu || ''}`.trim();
    }
};

const isPastInterview = (tanggal, waktu) => {
    if (!tanggal) return false;
    const target = new Date(`${tanggal}T${waktu || '00:00'}:00`);
    if (Number.isNaN(target.getTime())) {
        return false;
    }
    return target.getTime() < Date.now();
};

export default function JobseekerInterviewsIndex() {
    const { interviews = [], schema = {} } = usePage().props;

    const upcomingInterviews = useMemo(
        () =>
            interviews.filter(
                (item) => !isPastInterview(item.tanggal, item.waktu) && item.status !== 'Selesai',
            ),
        [interviews],
    );

    const historyInterviews = useMemo(
        () =>
            interviews.filter(
                (item) => isPastInterview(item.tanggal, item.waktu) || item.status === 'Selesai',
            ),
        [interviews],
    );

    const openDetail = (id) => {
        if (!id) return;
        router.visit(route('jobseeker.interviews.show', id));
    };

    const hasSchemaWarning = useMemo(
        () => (schema?.unknown?.length ?? 0) > 0,
        [schema?.unknown],
    );

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col gap-1">
                    <h2 className="text-xl font-semibold leading-tight text-slate-800">
                        Wawancara Saya
                    </h2>
                    <p className="text-sm text-slate-500">
                        Pantau jadwal dan riwayat wawancara Anda secara real-time.
                    </p>
                </div>
            }
        >
            <Head title="Wawancara Saya" />

            <div className="bg-[#F8FAFC] py-10">
                <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 sm:px-6 lg:px-8">
                    {hasSchemaWarning && (
                        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
                            <p className="font-semibold">Peringatan integritas field</p>
                            <p className="mt-1">
                                Field berikut belum dikenal oleh model: {(schema?.unknown ?? []).join(', ')}
                            </p>
                        </div>
                    )}

                    <section className="space-y-4">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-slate-800">Jadwal Mendatang</h3>
                                <p className="text-sm text-slate-500">
                                    Pastikan Anda siap untuk sesi wawancara berikutnya.
                                </p>
                            </div>
                            <span className="rounded-full bg-[#0A6CF5]/10 px-4 py-1 text-sm font-medium text-[#0A6CF5]">
                                {upcomingInterviews.length} wawancara aktif
                            </span>
                        </div>

                        <div className="grid gap-4 lg:grid-cols-2">
                            {upcomingInterviews.length === 0 && (
                                <div className="rounded-2xl border border-dashed border-[#0A6CF5]/30 bg-white p-6 text-center text-slate-500 shadow-sm">
                                    Belum ada jadwal wawancara yang menunggu.
                                </div>
                            )}

                            {upcomingInterviews.map((interview) => (
                                <article
                                    key={interview.id}
                                    className="flex flex-col gap-5 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <p className="text-xs font-semibold uppercase tracking-widest text-[#08B2D0]">
                                                Posisi
                                            </p>
                                            <h4 className="mt-1 text-xl font-semibold text-slate-800">
                                                {interview.posisi || 'Belum ditentukan'}
                                            </h4>
                                            <p className="text-sm text-slate-500">{formatSchedule(interview.tanggal, interview.waktu)}</p>
                                        </div>
                                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${statusBadge(interview.status)}`}>
                                            {interview.status}
                                        </span>
                                    </div>

                                    <div className="space-y-2 text-sm text-slate-600">
                                        {interview.format && (
                                            <div className="flex justify-between gap-3">
                                                <span className="text-slate-500">Format</span>
                                                <span className="font-medium text-right text-slate-700">{interview.format}</span>
                                            </div>
                                        )}
                                        {interview.lokasi && (
                                            <div className="flex justify-between gap-3">
                                                <span className="text-slate-500">Lokasi / Link</span>
                                                <span className="max-w-[240px] text-right font-medium text-slate-700">
                                                    {interview.lokasi}
                                                </span>
                                            </div>
                                        )}
                                        <div className="flex justify-between gap-3">
                                            <span className="text-slate-500">Status Kehadiran</span>
                                            <span className="font-medium text-right text-slate-700">
                                                {interview.status_kehadiran || 'Belum dikonfirmasi'}
                                            </span>
                                        </div>
                                        {interview.catatan && (
                                            <p className="rounded-lg bg-slate-50 p-3 text-xs text-slate-500">
                                                {interview.catatan}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex justify-end border-t border-slate-100 pt-4">
                                        <button
                                            type="button"
                                            onClick={() => openDetail(interview.id)}
                                            className="inline-flex items-center justify-center rounded-lg border border-transparent bg-[#0A6CF5] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#085ad1]"
                                        >
                                            Lihat Detail
                                        </button>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </section>

                    <section className="space-y-4">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-slate-800">Riwayat Wawancara</h3>
                                <p className="text-sm text-slate-500">Rekap wawancara yang telah Anda selesaikan.</p>
                            </div>
                            <span className="rounded-full bg-slate-100 px-4 py-1 text-sm font-medium text-slate-600">
                                {historyInterviews.length} riwayat wawancara
                            </span>
                        </div>

                        <div className="space-y-3">
                            {historyInterviews.length === 0 && (
                                <div className="rounded-2xl border border-slate-100 bg-white p-6 text-center text-slate-500 shadow-sm">
                                    Tidak ada riwayat wawancara untuk ditampilkan.
                                </div>
                            )}

                            {historyInterviews.map((interview) => (
                                <article
                                    key={`${interview.id}-history`}
                                    className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg md:flex-row md:items-center md:justify-between"
                                >
                                    <div>
                                        <h4 className="text-lg font-semibold text-slate-800">
                                            {interview.posisi || 'Posisi tidak diketahui'}
                                        </h4>
                                        <p className="text-sm text-slate-500">{formatSchedule(interview.tanggal, interview.waktu)}</p>
                                        {interview.catatan && (
                                            <p className="mt-2 max-w-xl text-xs text-slate-400 line-clamp-2">
                                                {interview.catatan}
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${statusBadge(interview.status)}`}>
                                            {interview.status}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => openDetail(interview.id)}
                                            className="inline-flex items-center justify-center rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-[#0A6CF5] transition hover:bg-[#0A6CF5]/10"
                                        >
                                            Lihat Detail
                                        </button>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
