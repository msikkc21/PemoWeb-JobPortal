import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Index({ auth, jobs, hasActiveSubscription, subscriptionStatus }) {
    const items = jobs.data ?? jobs;

    function handleDelete(id) {
        if (!hasActiveSubscription) {
            alert('Langganan Anda tidak aktif. Silakan perpanjang paket untuk mengelola lowongan.');
            return;
        }
        if (!confirm('Delete this job? This action cannot be undone.')) return;
        router.delete(`/company/jobs/${id}`, {
            onSuccess: () => router.reload(),
            onError: () => alert('Delete failed'),
        });
    }

    function handleSubmitForReview(id) {
        if (!hasActiveSubscription) {
            alert('Langganan Anda tidak aktif. Silakan perpanjang paket untuk mengelola lowongan.');
            return;
        }
        if (!confirm('Submit this job for review?')) return;
        router.post(
            `/company/jobs/${id}/submit`,
            {},
            {
                onSuccess: () => router.reload(),
                onError: () => alert('Submit failed'),
            },
        );
    }

    function handleClose(id) {
        if (!hasActiveSubscription) {
            alert('Langganan Anda tidak aktif. Silakan perpanjang paket untuk mengelola lowongan.');
            return;
        }
        if (!confirm('Close this job?')) return;
        router.post(
            `/company/jobs/${id}/close`,
            {},
            {
                onSuccess: () => router.reload(),
                onError: () => alert('Close failed'),
            },
        );
    }

    return (
        <AuthenticatedLayout auth={auth}>
            <Head title="Jobs" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Warning Banner for Inactive Subscription */}
                    {!hasActiveSubscription && (
                        <div className="mb-6 rounded-md border-l-4 border-yellow-400 bg-yellow-50 p-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                        />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-yellow-700">
                                        <strong className="font-semibold">Langganan Tidak Aktif</strong>
                                        {subscriptionStatus === 'pending_payment' && ' - Menunggu pembayaran.'}
                                        {subscriptionStatus === 'expired' && ' - Langganan Anda telah kadaluarsa.'}
                                        {!subscriptionStatus && ' - Anda belum memiliki paket langganan.'} Anda hanya dapat melihat daftar lowongan.
                                        <Link
                                            href="/company/subscription"
                                            className="ml-1 font-medium text-yellow-700 underline hover:text-yellow-600"
                                        >
                                            Perbarui paket langganan
                                        </Link>{' '}
                                        untuk membuka fitur posting pekerjaan.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="bg-white p-6 shadow-sm sm:rounded-lg">
                        <div className="mb-4 flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-semibold text-gray-900">Jobs</h1>
                                <p className="text-sm text-gray-600">Kelola lowongan perusahaan Anda.</p>
                            </div>
                            <div>
                                {hasActiveSubscription ? (
                                    <Link
                                        href="/company/jobs/create"
                                        className="inline-flex items-center rounded-md bg-teal-500 px-4 py-2 text-white shadow-sm transition hover:bg-teal-600"
                                    >
                                        Create Job
                                    </Link>
                                ) : (
                                    <button
                                        disabled
                                        className="inline-flex cursor-not-allowed items-center rounded-md bg-gray-300 px-4 py-2 text-gray-500 opacity-50 shadow-sm"
                                        title="Langganan tidak aktif"
                                    >
                                        Create Job
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Title</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Skills</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Created</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium uppercase text-gray-500">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {(items || []).length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                                                No jobs found.
                                            </td>
                                        </tr>
                                    )}

                                    {(items || []).map((job) => (
                                        <tr key={job.id}>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm">
                                                <Link href={route('company.jobs.applicants', job.id)} className="text-indigo-600 hover:underline">
                                                    {job.title}
                                                </Link>
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">{job.status.replace('_', ' ')}</td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                                                {(job.skills || []).map((s) => s.name).join(', ')}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                {new Date(job.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                                                {hasActiveSubscription ? (
                                                    <>
                                                        <Link
                                                            href={`/company/jobs/${job.id}/edit`}
                                                            className="mr-3 text-indigo-600 hover:text-indigo-900"
                                                        >
                                                            Edit
                                                        </Link>
                                                        <button onClick={() => handleDelete(job.id)} className="mr-3 text-red-600 hover:text-red-900">
                                                            Delete
                                                        </button>
                                                        {job.status !== 'pending_review' && job.status !== 'approved' && job.status !== 'closed' && (
                                                            <button
                                                                onClick={() => handleSubmitForReview(job.id)}
                                                                className="mr-3 text-yellow-600 hover:text-yellow-800"
                                                            >
                                                                Submit
                                                            </button>
                                                        )}
                                                        {job.status !== 'closed' && (
                                                            <button onClick={() => handleClose(job.id)} className="text-gray-600 hover:text-gray-900">
                                                                Close
                                                            </button>
                                                        )}
                                                    </>
                                                ) : (
                                                    <span className="text-xs italic text-gray-400">Langganan tidak aktif</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                            <div className="text-sm text-gray-600">
                                Showing {items.length} of {jobs.total ?? items.length}
                            </div>
                            <div className="space-x-2">
                                {jobs.prev_page_url && (
                                    <button onClick={() => router.visit(jobs.prev_page_url)} className="rounded border px-3 py-1">
                                        Previous
                                    </button>
                                )}
                                {jobs.next_page_url && (
                                    <button onClick={() => router.visit(jobs.next_page_url)} className="rounded border px-3 py-1">
                                        Next
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
