import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import SecondaryButton from '@/Components/SecondaryButton';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { useMemo } from 'react';
import InterviewForm from './components/InterviewForm';

const initFormState = (defaults = {}, options = {}) => ({
    lamaran_id: defaults.lamaran_id ?? '',
    tanggal: defaults.tanggal ?? '',
    waktu: defaults.waktu ?? '09:00',
    format: defaults.format ?? (options.formats?.[0] ?? 'online'),
    lokasi: defaults.lokasi ?? '',
    status: defaults.status ?? (options.statuses?.[0] ?? ''),
    status_kehadiran:
        defaults.status_kehadiran ?? (options.attendanceStatuses?.[0] ?? ''),
    catatan: defaults.catatan ?? '',
});

export default function CompanyInterviewsCreate() {
    const { options = {}, applications = [], schema = {}, defaults = {} } = usePage().props;

    const form = useForm(initFormState(defaults, options));

    const goBack = () => router.visit(route('company.interviews.index'));

    const submit = () => {
        form.post(route('company.interviews.store'), {
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
                            Tambah Jadwal Wawancara
                        </h2>
                        <p className="text-sm text-slate-500">
                            Lengkapi detail untuk menjadwalkan sesi wawancara baru.
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
            <Head title="Tambah Wawancara" />

            <div className="bg-[#F8FAFC] py-10">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
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
                            submitLabel="Simpan Jadwal"
                        />
                        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <SecondaryButton type="button" onClick={goBack}>
                                Kembali
                            </SecondaryButton>
                            <p className="text-xs text-slate-400">
                                Data akan langsung tersimpan ke database sesuai model wawancara.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
