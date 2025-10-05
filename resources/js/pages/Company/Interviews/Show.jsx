import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import SecondaryButton from '@/Components/SecondaryButton';
import PrimaryButton from '@/Components/PrimaryButton';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useMemo } from 'react';

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

export default function CompanyInterviewsShow() {
    const { interview = null, schema = {} } = usePage().props;

    const goBack = () => router.visit(route('company.interviews.index'));

    const hasSchemaWarning = useMemo(
        () => (schema?.unknown?.length ?? 0) > 0,
        [schema?.unknown],
    );

    const schedule = formatSchedule(interview?.tanggal, interview?.waktu);

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-xl font-semibold leading-tight text-slate-800">
                            Detail Wawancara
                        </h2>
                        <p className="text-sm text-slate-500">
                            Tinjau informasi lengkap jadwal wawancara kandidat.
                        </p>
                    </div>
                    {interview && (
                        <PrimaryButton
                            type="button"
                            onClick={() => router.visit(route('company.interviews.edit', interview.id))}
                        >
                            Edit Jadwal
                        </PrimaryButton>
                    )}
                </div>
            }
        >
            <Head title="Detail Wawancara" />

            <div className="bg-[#F8FAFC] py-10">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    {!interview && (
                        <div className="space-y-4 rounded-2xl border border-slate-100 bg-white p-10 text-center text-slate-500 shadow-sm">
                            <p className="text-lg font-semibold text-rose-500">
                                Jadwal tidak ditemukan
                            </p>
                            <p className="text-sm">
                                Jadwal mungkin telah dihapus atau Anda tidak memiliki akses ke data ini.
                            </p>
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
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                    <div>
                                        <p className="text-sm uppercase tracking-wider text-white/70">
                                            Posisi
                                        </p>
                                        <h3 className="mt-1 text-3xl font-semibold">
                                            {interview.posisi || 'Tidak disebutkan'}
                                        </h3>
                                    </div>
                                    <span className="inline-flex items-center rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-[#0A6CF5] shadow-sm">
                                        {interview.status}
                                    </span>
                                </div>
                                <div className="mt-6 grid gap-6 sm:grid-cols-2">
                                    <div>
                                        <p className="text-sm uppercase tracking-wider text-white/70">
                                            Jadwal Wawancara
                                        </p>
                                        <p className="mt-1 text-lg font-medium">
                                            {schedule}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm uppercase tracking-wider text-white/70">
                                            Format
                                        </p>
                                        <p className="mt-1 text-lg font-medium">
                                            {interview.format || 'Belum ditentukan'}
                                        </p>
                                        {interview.lokasi && (
                                            <p className="text-sm text-white/80">
                                                {interview.lokasi}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </section>

                            <section className="grid gap-6 rounded-3xl border border-slate-100 bg-white p-8 shadow-sm lg:grid-cols-2">
                                <div className="space-y-3">
                                    <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                                        Status Wawancara
                                    </h4>
                                    <p className="text-lg font-semibold text-slate-800">
                                        {interview.status}
                                    </p>
                                    <p className="text-sm text-slate-500">
                                        Status kehadiran: {interview.status_kehadiran || 'Belum dikonfirmasi'}
                                    </p>
                                </div>
                                <div className="space-y-3">
                                    <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                                        Catatan
                                    </h4>
                                    <p className="text-sm text-slate-600 leading-relaxed">
                                        {interview.catatan || 'Tidak ada catatan tambahan.'}
                                    </p>
                                </div>
                            </section>

                            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <SecondaryButton type="button" onClick={goBack}>
                                    Kembali ke daftar
                                </SecondaryButton>
                                <Link
                                    href={route('company.interviews.edit', interview.id)}
                                    className="inline-flex items-center rounded-lg border border-transparent bg-[#0A6CF5] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#085ad1]"
                                >
                                    Edit Jadwal
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
