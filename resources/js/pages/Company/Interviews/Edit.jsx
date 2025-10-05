import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import SecondaryButton from '@/Components/SecondaryButton';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { useMemo } from 'react';
import InterviewForm from './components/InterviewForm';

const initFormState = (interview = {}, options = {}) => ({
    lamaran_id: interview.lamaran_id ?? '',
    tanggal: interview.tanggal ?? '',
    waktu: interview.waktu ?? '09:00',
    format: interview.format ?? (options.formats?.[0] ?? 'online'),
    lokasi: interview.lokasi ?? '',
    status: interview.status ?? (options.statuses?.[0] ?? ''),
    status_kehadiran:
        interview.status_kehadiran ?? (options.attendanceStatuses?.[0] ?? ''),
    catatan: interview.catatan ?? '',
});

export default function CompanyInterviewsEdit() {
    const { interview = null, options = {}, applications = [], schema = {} } = usePage().props;

    const form = useForm(initFormState(interview ?? {}, options));

    const goBack = () => router.visit(route('company.interviews.index'));

    const submit = () => {
        if (!interview) return;
        form.put(route('company.interviews.update', interview.id), {
            preserveScroll: true,
        });
    };

    const hasSchemaWarning = useMemo(
        () => (schema?.unknown?.length ?? 0) > 0,
        [schema?.unknown],
    );

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-xl font-semibold leading-tight text-slate-800">
                            Edit Jadwal Wawancara
                        </h2>
                        <p className="text-sm text-slate-500">
                            Perbarui informasi wawancara kandidat sesuai kebutuhan.
                        </p>
                    </div>
                    <Link
                        href={route('company.interviews.index')}
                        className="text-sm font-semibold text-[#0A6CF5] transition hover:text-[#085ad1]"
                    >
                        &larr; Kembali ke daftar
                    </Link>
                </div>
            }
        >
            <Head title="Edit Wawancara" />

            <div className="bg-[#F8FAFC] py-10">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
                        {!interview && (
                            <div className="space-y-4 py-10 text-center text-slate-500">
                                <p className="text-lg font-semibold text-rose-500">
                                    Jadwal tidak ditemukan
                                </p>
                                <p className="text-sm">
                                    Data wawancara tidak tersedia atau telah dihapus.
                                </p>
                                <SecondaryButton type="button" onClick={goBack}>
                                    Kembali ke daftar
                                </SecondaryButton>
                            </div>
                        )}

                        {interview && (
                            <>
                                {hasSchemaWarning && (
                                    <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
                                        <p className="font-semibold">Peringatan integritas field</p>
                                        <p className="mt-1">
                                            Field berikut belum dikenal oleh model: {(schema?.unknown ?? []).join(', ')}
                                        </p>
                                    </div>
                                )}

                                <InterviewForm
                                    form={form}
                                    options={options}
                                    applications={applications}
                                    schema={schema}
                                    onSubmit={submit}
                                    onCancel={goBack}
                                    submitLabel="Simpan Perubahan"
                                    isEditing
                                />
                            </>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
