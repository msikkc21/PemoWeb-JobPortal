import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import SkillSelector from '../../../Components/SkillSelector';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Edit({ auth, job, skills = [] }) {
	// map existing selected skills to array of numeric ids
	const selectedSkillIds = (job.skills || []).map(s => Number(s.id));

	const form = useForm({
		title: job.title || '',
		description: job.description || '',
		location: job.location || '',
		skills: selectedSkillIds,
	});

	const isApproved = job.status === 'approved';

	function submit(e) {
		e.preventDefault();
		if (isApproved) return;
		form.put(`/company/jobs/${job.id}`);
	}

	return (
		<AuthenticatedLayout auth={auth}>
			<Head title="Edit Job" />
			<div className="py-6">
				<div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
					<div className="bg-white shadow-sm sm:rounded-lg p-6">
						<h2 className="text-xl font-semibold mb-4">Edit Job</h2>

						{isApproved && <div className="mb-4 p-3 bg-yellow-50 text-yellow-800 rounded">This job is approved and cannot be edited.</div>}

						<form onSubmit={submit}>
							<div className="mb-4">
								<label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
								<input value={form.data.title} onChange={e => form.setData('title', e.target.value)} disabled={isApproved} className="w-full border rounded px-3 py-2" />
								{form.errors.title && <div className="text-red-600 mt-1 text-sm">{form.errors.title}</div>}
							</div>

							<div className="mb-4">
								<label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
								<textarea value={form.data.description} onChange={e => form.setData('description', e.target.value)} disabled={isApproved} className="w-full border rounded px-3 py-2" rows="5" />
								{form.errors.description && <div className="text-red-600 mt-1 text-sm">{form.errors.description}</div>}
							</div>

							<div className="mb-4">
								<label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
								<input value={form.data.location} onChange={e => form.setData('location', e.target.value)} disabled={isApproved} className="w-full border rounded px-3 py-2" />
								{form.errors.location && <div className="text-red-600 mt-1 text-sm">{form.errors.location}</div>}
							</div>

							<div className="mb-4">
								<label className="block text-sm font-medium text-gray-700 mb-1">Skills</label>
								<SkillSelector skills={skills} value={form.data.skills} onChange={val => form.setData('skills', val)} />
								{form.errors.skills && <div className="text-red-600 mt-1 text-sm">{form.errors.skills}</div>}
							</div>

							<div className="mt-6">
								<button type="submit" disabled={form.processing || isApproved} className="px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600">Save</button>
								<Link href="/company/jobs" className="ml-3 text-sm text-gray-600">Cancel</Link>
							</div>
						</form>
					</div>
				</div>
			</div>
		</AuthenticatedLayout>
	);
}
