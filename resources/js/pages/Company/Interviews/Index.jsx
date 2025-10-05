import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DangerButton from '@/Components/DangerButton';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';

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

const sanitizeInterview = (interview, allowedFields) => {
    if (!interview) return {};
    return Object.fromEntries(
        Object.entries(interview).filter(([field]) => allowedFields.has(field)),
    );
};

export default function CompanyInterviewsIndex() {
    const { interviews = [], options = {}, schema = {}, meta = {} } = usePage().props;

    const allowedFields = useMemo(
        () => new Set(schema?.allowed ?? []),
        [schema?.allowed],
    );

    const tableColumns = useMemo(() => {
        let count = 4; // posisi, jadwal, status, aksi
        if (allowedFields.has('format')) count += 1;
        if (allowedFields.has('lokasi')) count += 1;
        if (allowedFields.has('status_kehadiran')) count += 1;
        return count;
    }, [allowedFields]);

    const safeInterviews = useMemo(
        () => interviews.map((item) => sanitizeInterview(item, allowedFields)),
        [interviews, allowedFields],
    );

    const [filters, setFilters] = useState({
        search: '',
        status: '',
        format: '',
    });

    const filtered = useMemo(() => {
        return safeInterviews.filter((item) => {
            const matchesSearch = [item.posisi, item.lokasi, item.catatan]
                .filter(Boolean)
                .join(' ')
                .toLowerCase()
                .includes(filters.search.trim().toLowerCase());

            const matchesStatus = filters.status ? item.status === filters.status : true;
            const matchesFormat = filters.format ? item.format === filters.format : true;

            return matchesSearch && matchesStatus && matchesFormat;
        });
    }, [safeInterviews, filters]);

    const totalScheduled = useMemo(
        () => safeInterviews.filter((item) => item.status === 'Terjadwal').length,
        [safeInterviews],
    );

    const totalCompleted = useMemo(
        () => safeInterviews.filter((item) => item.status === 'Selesai').length,
        [safeInterviews],
    );

    const resetFilters = () => setFilters({ search: '', status: '', format: '' });

    const deleteInterview = (id) => {
        if (!id) return;
        if (confirm('Hapus jadwal wawancara ini?')) {
            router.delete(route('company.interviews.destroy', id), {
                preserveScroll: true,
            });
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-xl font-semibold leading-tight text-slate-800">
                            Proses Seleksi &amp; Wawancara
                        </h2>
                        <p className="text-sm text-slate-500">
                            Data real-time dari database, tersinkron dengan model wawancara.
                        </p>
                    </div>
                    <PrimaryButton
                        type="button"
                        onClick={() => router.visit(route('company.interviews.create'))}
                    >
                        Tambah Jadwal
                    </PrimaryButton>
                </div>
            }
        >
            <Head title="Wawancara Perusahaan" />

            <div className="bg-[#F8FAFC] py-8">
                <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 sm:px-6 lg:px-8">
                    <section className="grid gap-4 sm:grid-cols-3">
                        <div className="rounded-2xl bg-gradient-to-br from-[#0A6CF5] to-[#08B2D0] p-6 text-white shadow-lg">
                            <p className="text-sm font-medium opacity-80">Total Jadwal</p>
                            <p className="mt-3 text-3xl font-semibold">{safeInterviews.length}</p>
                            <p className="mt-1 text-xs opacity-80">Termasuk jadwal aktif dan riwayat</p>
                        </div>
                        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                            <p className="text-sm font-medium text-slate-500">Interview Terjadwal</p>
                            <p className="mt-3 text-2xl font-semibold text-[#0A6CF5]">{totalScheduled}</p>
                            <p className="mt-1 text-xs text-slate-500">Status &ldquo;Terjadwal&rdquo; aktif</p>
                        </div>
                        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                            <p className="text-sm font-medium text-slate-500">Interview Selesai</p>
                            <p className="mt-3 text-2xl font-semibold text-emerald-500">{totalCompleted}</p>
                            <p className="mt-1 text-xs text-slate-500">Status &ldquo;Selesai&rdquo;</p>
                        </div>
                    </section>

                    {schema?.unknown?.length > 0 && (
                        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
                            <p className="font-semibold">Peringatan integritas field</p>
                            <p className="mt-1">
                                Terdapat field yang tidak dikenal oleh model: {schema.unknown.join(', ')}
                            </p>
                        </div>
                    )}

                    <section className="rounded-2xl border border-slate-100 bg-white shadow-sm">
                        <div className="flex flex-col gap-4 border-b border-slate-100 p-6 lg:flex-row lg:items-end lg:justify-between">
                            <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
                                <div className="flex-1">
                                    <label className="text-sm font-medium text-slate-600" htmlFor="search">
                                        Cari posisi / lokasi
                                    </label>
                                    <input
                                        id="search"
                                        type="search"
                                        value={filters.search}
                                        onChange={(event) => setFilters((prev) => ({
                                            ...prev,
                                            search: event.target.value,
                                        }))}
                                        placeholder="Contoh: Frontend Engineer atau Zoom"
                                        className="focus:border-[#0A6CF5] focus:ring-[#0A6CF5] mt-1 block w-full rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-700 shadow-sm"
                                    />
                                </div>
                                <div className="grid gap-3 sm:w-[320px] sm:grid-cols-2">
                                    <div>
                                        <label className="text-sm font-medium text-slate-600" htmlFor="statusFilter">
                                            Status
                                        </label>
                                        <select
                                            id="statusFilter"
                                            value={filters.status}
                                            onChange={(event) => setFilters((prev) => ({
                                                ...prev,
                                                status: event.target.value,
                                            }))}
                                            className="focus:border-[#0A6CF5] focus:ring-[#0A6CF5] mt-1 block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm"
                                        >
                                            <option value="">Semua status</option>
                                            {(options.statuses ?? []).map((option) => (
                                                <option key={option} value={option}>
                                                    {option}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-slate-600" htmlFor="formatFilter">
                                            Format
                                        </label>
                                        <select
                                            id="formatFilter"
                                            value={filters.format}
                                            onChange={(event) => setFilters((prev) => ({
                                                ...prev,
                                                format: event.target.value,
                                            }))}
                                            className="focus:border-[#0A6CF5] focus:ring-[#0A6CF5] mt-1 block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm"
                                        >
                                            <option value="">Semua format</option>
                                            {(options.formats ?? []).map((option) => (
                                                <option key={option} value={option}>
                                                    {option}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <SecondaryButton type="button" onClick={resetFilters}>
                                    Reset Filter
                                </SecondaryButton>
                                <Link
                                    href={route('company.interviews.create')}
                                    className="inline-flex items-center rounded-lg border border-transparent bg-[#0A6CF5] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#085ad1]"
                                >
                                    Formulir Baru
                                </Link>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-100">
                                <thead className="bg-slate-50">
                                    <tr className="text-left text-sm font-semibold text-slate-600">
                                        <th className="px-6 py-4">Posisi</th>
                                        <th className="px-6 py-4">Jadwal</th>
                                        {allowedFields.has('format') && <th className="px-6 py-4">Format</th>}
                                        {allowedFields.has('lokasi') && <th className="px-6 py-4">Lokasi</th>}
                                        {allowedFields.has('status_kehadiran') && <th className="px-6 py-4">Status Kehadiran</th>}
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-sm text-slate-600">
                                    {filtered.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan={tableColumns}
                                                className="px-6 py-10 text-center text-slate-400"
                                            >
                                                Tidak ada jadwal yang cocok dengan filter saat ini.
                                            </td>
                                        </tr>
                                    )}

                                    {filtered.map((interview) => (
                                        <tr key={interview.id} className="hover:bg-slate-50/60">
                                            <td className="px-6 py-4">
                                                <div className="font-semibold text-slate-800">{interview.posisi || '—'}</div>
                                                {allowedFields.has('catatan') && interview.catatan && (
                                                    <p className="text-xs text-slate-500 line-clamp-2">{interview.catatan}</p>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-slate-600">
                                                <p>{formatSchedule(interview.tanggal, interview.waktu)}</p>
                                            </td>
                                            {allowedFields.has('format') && (
                                                <td className="px-6 py-4 text-slate-600">
                                                    {interview.format || '—'}
                                                </td>
                                            )}
                                            {allowedFields.has('lokasi') && (
                                                <td className="px-6 py-4 text-slate-600">
                                                    {interview.lokasi || '—'}
                                                </td>
                                            )}
                                            {allowedFields.has('status_kehadiran') && (
                                                <td className="px-6 py-4 text-slate-600">
                                                    {interview.status_kehadiran || 'Belum Dikonfirmasi'}
                                                </td>
                                            )}
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${statusBadge(interview.status)}`}
                                                >
                                                    {interview.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex justify-end gap-2">
                                                    <Link
                                                        href={route('company.interviews.edit', interview.id)}
                                                        className="inline-flex items-center rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-100"
                                                    >
                                                        Edit
                                                    </Link>
                                                    <Link
                                                        href={route('company.interviews.show', interview.id)}
                                                        className="inline-flex items-center rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-[#0A6CF5] transition hover:bg-[#0A6CF5]/10"
                                                    >
                                                        Detail
                                                    </Link>
                                                    <DangerButton
                                                        type="button"
                                                        className="text-xs"
                                                        onClick={() => deleteInterview(interview.id)}
                                                    >
                                                        Hapus
                                                    </DangerButton>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
