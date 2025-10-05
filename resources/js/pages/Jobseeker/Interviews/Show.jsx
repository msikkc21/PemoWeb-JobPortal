import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import SecondaryButton from '@/Components/SecondaryButton';
import { Head, router, usePage } from '@inertiajs/react';
import { useMemo } from 'react';

const statusBadge = (status) => {
    switch (status) {
        case 'Terjadwal':
            return 'bg-white/90 text-[#0A6CF5]';
        case 'Diproses':
            return 'bg-amber-200/80 text-amber-800';
        case 'Selesai':
            return 'bg-emerald-200/80 text-emerald-800';
        case 'Ditolak':
            return 'bg-rose-200/80 text-rose-800';
        case 'Dibatalkan':
            return 'bg-slate-200 text-slate-700';
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

export default function JobseekerInterviewShow() {
    const { interview = null, schema = {} } = usePage().props;

    const goBack = () => router.visit(route('jobseeker.interviews.index'));

    const hasSchemaWarning = useMemo(
        () => (schema?.unknown?.length ?? 0) > 0,
        [schema?.unknown],
    );

    const schedule = formatSchedule(interview?.tanggal, interview?.waktu);

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col gap-2">
                    <h2 className="text-xl font-semibold leading-tight text-slate-800">
                        Detail Wawancara Saya
                    </h2>
                    <p className="text-sm text-slate-500">
                        Informasi ini bersifat hanya-baca. Hubungi perusahaan bila perlu perubahan jadwal.
                    </p>
                </div>
            }
        >
            <Head title="Detail Wawancara" />

            <div className="bg-[#F8FAFC] py-10">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    {!interview && (
                        <div className="space-y-4 rounded-2xl border border-slate-100 bg-white p-10 text-center text-slate-500 shadow-sm">
                            <p className="text-lg font-semibold text-rose-500">Jadwal tidak ditemukan</p>
                            <p className="text-sm">Jadwal mungkin telah dihapus atau Anda tidak memiliki akses.</p>
                            <SecondaryButton type="button" onClick={goBack}>
                                Kembali ke daftar
                            </SecondaryButton>
                        </div>
                    )}

                    {interview && (
                        <div className="space-y-6">
                            {hasSchemaWarning && (
                                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
                                    <p className="font-semibold">Peringatan integritas field</p>
                                    <p className="mt-1">
                                        Field berikut belum dikenal oleh model: {(schema?.unknown ?? []).join(', ')}
                                    </p>
                                </div>
                            )}

                            <section className="rounded-3xl bg-gradient-to-br from-[#0A6CF5] to-[#08B2D0] p-8 text-white shadow-lg">
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                    <div>
                                        <p className="text-sm uppercase tracking-widest text-white/70">Posisi</p>
                                        <h3 className="mt-1 text-3xl font-semibold">{interview.posisi || 'Belum ditentukan'}</h3>
                                    </div>
                                    <span className={`inline-flex rounded-full px-4 py-1.5 text-xs font-semibold ${statusBadge(interview.status)}`}>
                                        {interview.status}
                                    </span>
                                </div>
                                <div className="mt-6 grid gap-6 sm:grid-cols-2">
                                    <div>
                                        <p className="text-sm uppercase tracking-widest text-white/70">Jadwal</p>
                                        <p className="mt-2 text-lg font-medium">{schedule}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm uppercase tracking-widest text-white/70">Format</p>
                                        <p className="mt-2 text-lg font-medium">{interview.format || 'Belum ditentukan'}</p>
                                        {interview.lokasi && (
                                            <p className="text-sm text-white/80">{interview.lokasi}</p>
                                        )}
                                    </div>
                                </div>
                            </section>

                            <section className="space-y-6 rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="rounded-2xl bg-slate-50 p-4">
                                        <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                                            Status Wawancara
                                        </p>
                                        <p className="mt-2 text-lg font-semibold text-slate-800">{interview.status}</p>
                                    </div>
                                    <div className="rounded-2xl bg-slate-50 p-4">
                                        <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                                            Status Kehadiran
                                        </p>
                                        <p className="mt-2 text-lg font-semibold text-slate-800">
                                            {interview.status_kehadiran || 'Belum dikonfirmasi'}
                                        </p>
                                    </div>
                                </div>

                                {interview.catatan && (
                                    <div>
                                        <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                                            Catatan
                                        </h4>
                                        <p className="mt-3 rounded-xl bg-slate-50 p-4 text-sm leading-relaxed text-slate-600">
                                            {interview.catatan}
                                        </p>
                                    </div>
                                )}

                                <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
                                    <SecondaryButton type="button" onClick={goBack}>
                                        Kembali ke daftar
                                    </SecondaryButton>
                                    <p className="text-xs text-slate-400">
                                        Data ini bersumber langsung dari jadwal perusahaan.
                                    </p>
                                </div>
                            </section>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
