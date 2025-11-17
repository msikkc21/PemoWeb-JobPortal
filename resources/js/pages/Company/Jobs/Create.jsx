import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import SkillSelector from '../../../Components/SkillSelector';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Create({ auth, skills = [] }) {
	const form = useForm({
		title: '',
		description: '',
		location: '',
		skills: [],
	});

	const skillList = Array.isArray(skills) ? skills : (skills?.data ?? []);

	function submit(e) {
		e.preventDefault();
		form.post('/company/jobs');
	}

	return (
		<AuthenticatedLayout auth={auth}>
			<Head title="Create Job" />
			<div className="py-6">
				<div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
					<div className="bg-white shadow-sm sm:rounded-lg p-6">
						<h2 className="text-xl font-semibold mb-4">Create Job</h2>

						<form onSubmit={submit}>
							<div className="mb-4">
								<label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
								<input value={form.data.title} onChange={e => form.setData('title', e.target.value)} className="w-full border rounded px-3 py-2" />
								{form.errors.title && <div className="text-red-600 mt-1 text-sm">{form.errors.title}</div>}
							</div>

							<div className="mb-4">
								<label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
								<textarea value={form.data.description} onChange={e => form.setData('description', e.target.value)} className="w-full border rounded px-3 py-2" rows="5" />
								{form.errors.description && <div className="text-red-600 mt-1 text-sm">{form.errors.description}</div>}
							</div>

							<div className="mb-4">
								<label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
								<input value={form.data.location} onChange={e => form.setData('location', e.target.value)} className="w-full border rounded px-3 py-2" />
								{form.errors.location && <div className="text-red-600 mt-1 text-sm">{form.errors.location}</div>}
							</div>

							<div className="mb-4">
								<label className="block text-sm font-medium text-gray-700 mb-1">Skills</label>
								<SkillSelector skills={skillList} value={form.data.skills} onChange={val => form.setData('skills', val)} />
								{form.errors.skills && <div className="text-red-600 mt-1 text-sm">{form.errors.skills}</div>}
							</div>

							<div className="mt-6">
								<button type="submit" disabled={form.processing} className="px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600">Create</button>
								<Link href="/company/jobs" className="ml-3 text-sm text-gray-600">Cancel</Link>
							</div>
						</form>
					</div>
				</div>
			</div>
		</AuthenticatedLayout>
	);
}