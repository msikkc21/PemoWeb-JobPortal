import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { useMemo } from 'react';

const toOptions = (items = []) => items.map((value) => ({ value, label: value }));

export default function InterviewForm({
    form,
    options,
    applications,
    schema,
    submitLabel = 'Simpan Jadwal',
    onSubmit,
    onCancel,
    isEditing = false,
}) {
    const allowed = useMemo(() => new Set(schema?.allowed ?? []), [schema]);
    const statusOptions = toOptions(options?.statuses);
    const formatOptions = toOptions(options?.formats);
    const attendanceOptions = toOptions(options?.attendanceStatuses);

    const applicationOptions = useMemo(() => applications ?? [], [applications]);
    const selectedApplication = useMemo(
        () => applicationOptions.find((item) => String(item.id) === String(form.data.lamaran_id)) ?? null,
        [applicationOptions, form.data.lamaran_id],
    );

    const submit = (event) => {
        event.preventDefault();
        onSubmit?.();
    };

    return (
        <form onSubmit={submit} className="space-y-6">
            <div className="grid gap-5 md:grid-cols-2">
                <div className="md:col-span-2">
                    <InputLabel htmlFor="lamaran_id" value="Pilih Lamaran" />
                    <select
                        id="lamaran_id"
                        value={form.data.lamaran_id}
                        onChange={(event) => form.setData('lamaran_id', event.target.value)}
                        disabled={isEditing}
                        className="focus:border-[#0A6CF5] focus:ring-[#0A6CF5] mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    >
                        <option value="">Pilih lamaran kandidat</option>
                        {applicationOptions.map((item) => (
                            <option key={item.id} value={item.id}>
                                #{item.id} • {item.posisi || 'Posisi tidak tersedia'}
                            </option>
                        ))}
                    </select>
                    <InputError message={form.errors.lamaran_id} className="mt-2" />
                    {selectedApplication && (
                        <p className="mt-2 text-xs text-slate-500">
                            Posisi: {selectedApplication.posisi || '—'} | Status Lamaran: {selectedApplication.status || '—'}
                        </p>
                    )}
                </div>

                {allowed.has('tanggal') && (
                    <div>
                        <InputLabel htmlFor="tanggal" value="Tanggal" />
                        <TextInput
                            id="tanggal"
                            type="date"
                            value={form.data.tanggal}
                            onChange={(event) => form.setData('tanggal', event.target.value)}
                            className="mt-1 block w-full"
                        />
                        <InputError message={form.errors.tanggal} className="mt-2" />
                    </div>
                )}

                {allowed.has('waktu') && (
                    <div>
                        <InputLabel htmlFor="waktu" value="Waktu" />
                        <TextInput
                            id="waktu"
                            type="time"
                            value={form.data.waktu}
                            onChange={(event) => form.setData('waktu', event.target.value)}
                            className="mt-1 block w-full"
                        />
                        <InputError message={form.errors.waktu} className="mt-2" />
                    </div>
                )}

                {allowed.has('format') && (
                    <div>
                        <InputLabel htmlFor="format" value="Format Wawancara" />
                        <select
                            id="format"
                            value={form.data.format}
                            onChange={(event) => form.setData('format', event.target.value)}
                            className="focus:border-[#0A6CF5] focus:ring-[#0A6CF5] mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                        >
                            {formatOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <InputError message={form.errors.format} className="mt-2" />
                    </div>
                )}

                {allowed.has('lokasi') && (
                    <div className="md:col-span-2">
                        <InputLabel htmlFor="lokasi" value="Lokasi / Detail" />
                        <TextInput
                            id="lokasi"
                            value={form.data.lokasi}
                            onChange={(event) => form.setData('lokasi', event.target.value)}
                            placeholder="Contoh: Zoom Meeting atau Alamat kantor"
                            className="mt-1 block w-full"
                        />
                        <InputError message={form.errors.lokasi} className="mt-2" />
                    </div>
                )}

                {allowed.has('status') && (
                    <div>
                        <InputLabel htmlFor="status" value="Status Wawancara" />
                        <select
                            id="status"
                            value={form.data.status}
                            onChange={(event) => form.setData('status', event.target.value)}
                            className="focus:border-[#0A6CF5] focus:ring-[#0A6CF5] mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                        >
                            {statusOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <InputError message={form.errors.status} className="mt-2" />
                    </div>
                )}

                {allowed.has('status_kehadiran') && (
                    <div>
                        <InputLabel htmlFor="status_kehadiran" value="Status Kehadiran" />
                        <select
                            id="status_kehadiran"
                            value={form.data.status_kehadiran}
                            onChange={(event) => form.setData('status_kehadiran', event.target.value)}
                            className="focus:border-[#0A6CF5] focus:ring-[#0A6CF5] mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                        >
                            {attendanceOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <InputError message={form.errors.status_kehadiran} className="mt-2" />
                    </div>
                )}

                {allowed.has('catatan') && (
                    <div className="md:col-span-2">
                        <InputLabel htmlFor="catatan" value="Catatan" />
                        <textarea
                            id="catatan"
                            rows={4}
                            value={form.data.catatan}
                            onChange={(event) => form.setData('catatan', event.target.value)}
                            className="focus:border-[#0A6CF5] focus:ring-[#0A6CF5] mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                            placeholder="Instruksi tambahan atau catatan internal"
                        />
                        <InputError message={form.errors.catatan} className="mt-2" />
                    </div>
                )}
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
                {onCancel && (
                    <SecondaryButton type="button" onClick={onCancel} className="sm:w-auto">
                        Batalkan
                    </SecondaryButton>
                )}
                <PrimaryButton type="submit" disabled={form.processing} className="justify-center sm:w-auto">
                    {form.processing ? 'Menyimpan...' : submitLabel}
                </PrimaryButton>
            </div>
        </form>
    );
}
