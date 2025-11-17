import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

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
		router.post(`/company/jobs/${id}/submit`, {}, {
			onSuccess: () => router.reload(),
			onError: () => alert('Submit failed'),
		});
	}

	function handleClose(id) {
		if (!hasActiveSubscription) {
			alert('Langganan Anda tidak aktif. Silakan perpanjang paket untuk mengelola lowongan.');
			return;
		}
		if (!confirm('Close this job?')) return;
		router.post(`/company/jobs/${id}/close`, {}, {
			onSuccess: () => router.reload(),
			onError: () => alert('Close failed'),
		});
	}

	return (
		<AuthenticatedLayout auth={auth}>
			<Head title="Jobs" />

			<div className="py-6">
				<div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
					{/* Warning Banner for Inactive Subscription */}
					{!hasActiveSubscription && (
						<div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md">
							<div className="flex">
								<div className="flex-shrink-0">
									<svg className="h-5 w-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
									</svg>
								</div>
								<div className="ml-3">
									<p className="text-sm text-yellow-700">
										<strong className="font-semibold">Langganan Tidak Aktif</strong> 
										{subscriptionStatus === 'pending_payment' && ' - Menunggu pembayaran.'}
										{subscriptionStatus === 'expired' && ' - Langganan Anda telah kadaluarsa.'}
										{!subscriptionStatus && ' - Anda belum memiliki paket langganan.'}
										{' '}Anda hanya dapat melihat daftar lowongan. 
										<Link href="/company/subscription" className="font-medium underline text-yellow-700 hover:text-yellow-600 ml-1">
											Perbarui paket langganan
										</Link> untuk membuka fitur posting pekerjaan.
									</p>
								</div>
							</div>
						</div>
					)}

					<div className="bg-white shadow-sm sm:rounded-lg p-6">
						<div className="flex items-center justify-between mb-4">
							<div>
								<h1 className="text-2xl font-semibold text-gray-900">Jobs</h1>
								<p className="text-sm text-gray-600">Kelola lowongan perusahaan Anda.</p>
							</div>
							<div>
								{hasActiveSubscription ? (
									<Link
										href="/company/jobs/create"
										className="inline-flex items-center px-4 py-2 bg-teal-500 text-white rounded-md shadow-sm hover:bg-teal-600 transition"
									>
										Create Job
									</Link>
								) : (
									<button
										disabled
										className="inline-flex items-center px-4 py-2 bg-gray-300 text-gray-500 rounded-md shadow-sm cursor-not-allowed opacity-50"
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
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Skills</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
										<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
									</tr>
								</thead>
								<tbody className="bg-white divide-y divide-gray-200">
									{(items || []).length === 0 && (
										<tr>
											<td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">No jobs found.</td>
										</tr>
									)}

									{(items || []).map(job => (
										<tr key={job.id}>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{job.title}</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{job.status.replace('_', ' ')}</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{(job.skills || []).map(s => s.name).join(', ')}</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(job.created_at).toLocaleDateString()}</td>
											<td className="px-6 py-4 whitespace-nowrap text-right text-sm">
												{hasActiveSubscription ? (
													<>
														<Link href={`/company/jobs/${job.id}/edit`} className="text-indigo-600 hover:text-indigo-900 mr-3">Edit</Link>
														<button onClick={() => handleDelete(job.id)} className="text-red-600 hover:text-red-900 mr-3">Delete</button>
														{job.status !== 'pending_review' && job.status !== 'approved' && job.status !== 'closed' && (
															<button onClick={() => handleSubmitForReview(job.id)} className="text-yellow-600 hover:text-yellow-800 mr-3">Submit</button>
														)}
														{job.status !== 'closed' && (
															<button onClick={() => handleClose(job.id)} className="text-gray-600 hover:text-gray-900">Close</button>
														)}
													</>
												) : (
													<span className="text-gray-400 italic text-xs">Langganan tidak aktif</span>
												)}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>

						<div className="mt-4 flex justify-between items-center">
							<div className="text-sm text-gray-600">
								Showing {items.length} of {jobs.total ?? items.length}
							</div>
							<div className="space-x-2">
								{jobs.prev_page_url && <button onClick={() => router.visit(jobs.prev_page_url)} className="px-3 py-1 border rounded">Previous</button>}
								{jobs.next_page_url && <button onClick={() => router.visit(jobs.next_page_url)} className="px-3 py-1 border rounded">Next</button>}
							</div>
						</div>
					</div>
				</div>
			</div>
		</AuthenticatedLayout>
	);
}
