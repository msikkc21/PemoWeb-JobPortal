import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Index({ auth, jobs }) {
	const items = jobs.data ?? jobs;

	function handleDelete(id) {
		if (!confirm('Delete this job? This action cannot be undone.')) return;
		router.delete(`/company/jobs/${id}`, {
			onSuccess: () => router.reload(),
			onError: () => alert('Delete failed'),
		});
	}

	function handleSubmitForReview(id) {
		if (!confirm('Submit this job for review?')) return;
		router.post(`/company/jobs/${id}/submit`, {}, {
			onSuccess: () => router.reload(),
			onError: () => alert('Submit failed'),
		});
	}

	function handleClose(id) {
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
					<div className="bg-white shadow-sm sm:rounded-lg p-6">
						<div className="flex items-center justify-between mb-4">
							<div>
								<h1 className="text-2xl font-semibold text-gray-900">Jobs</h1>
								<p className="text-sm text-gray-600">Kelola lowongan perusahaan Anda.</p>
							</div>
							<div>
								<Link
									href="/company/jobs/create"
									className="inline-flex items-center px-4 py-2 bg-teal-500 text-white rounded-md shadow-sm hover:bg-teal-600"
								>
									Create Job
								</Link>
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
												<Link href={`/company/jobs/${job.id}/edit`} className="text-indigo-600 hover:text-indigo-900 mr-3">Edit</Link>
												<button onClick={() => handleDelete(job.id)} className="text-red-600 hover:text-red-900 mr-3">Delete</button>
												{job.status !== 'pending_review' && job.status !== 'approved' && job.status !== 'closed' && (
													<button onClick={() => handleSubmitForReview(job.id)} className="text-yellow-600 hover:text-yellow-800 mr-3">Submit</button>
												)}
												{job.status !== 'closed' && (
													<button onClick={() => handleClose(job.id)} className="text-gray-600 hover:text-gray-900">Close</button>
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
