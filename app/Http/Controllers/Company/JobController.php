<?php

namespace App\Http\Controllers\Company;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Job;
use App\Models\Skill;
use Illuminate\Support\Facades\Schema;

class JobController extends Controller
{
	// status constants used by controller
	protected const STATUS_DRAFT = 'draft';
	protected const STATUS_PENDING_REVIEW = 'pending_review';
	protected const STATUS_APPROVED = 'approved';
	protected const STATUS_CLOSED = 'closed';

	/**
	 * Display a listing of the resource.
	 */
	public function index()
	{
		$authUser = auth()->user();
		$companyId = $authUser->company_id ?? ($authUser->company->id ?? null);
		if (! $companyId) {
			abort(403);
		}

		$jobs = Job::with('skills')
			->where('company_id', $companyId)
			->orderByDesc('created_at')
			->paginate(10);

		// Get subscription info for frontend
		$company = $authUser->company;
		$subscription = $company->subscriptions()->latest()->first();
		$hasActiveSubscription = $subscription && $subscription->status === 'active';

		return Inertia::render('Company/Jobs/Index', [
			'jobs' => $jobs,
			'hasActiveSubscription' => $hasActiveSubscription,
			'subscriptionStatus' => $subscription?->status,
		]);
	}

	/**
	 * Show the form for creating a new resource.
	 */
	public function create()
	{
		// select only id & name to ensure simple array for frontend
		$skills = Skill::orderBy('name')->get(['id', 'name']);

		return Inertia::render('Company/Jobs/Create', [
			'skills' => $skills->toArray(),
		]);
	}

	/**
	 * Store a newly created resource in storage.
	 */
	public function store(Request $request)
	{
		$authUser = auth()->user();
		$companyId = $authUser->company_id ?? ($authUser->company->id ?? null);
		if (! $companyId) {
			abort(403);
		}

		$data = $request->validate([
			'title' => 'required|string|max:191',
			'description' => 'required|string',
			'location' => 'nullable|string|max:191',
			'skills' => 'nullable|array',
			'skills.*' => 'integer|exists:skills,id',
		]);

		// filter $data to only columns that exist in the job table (avoid SQL errors)
		$jobTable = (new Job())->getTable();
		$filtered = [];
		foreach ($data as $k => $v) {
			if (Schema::hasColumn($jobTable, $k)) {
				$filtered[$k] = $v;
			}
		}

		$job = Job::create(array_merge($filtered, [
			'company_id' => $companyId,
			'status' => self::STATUS_DRAFT,
		]));

		if (! empty($data['skills'])) {
			$job->skills()->sync($data['skills']);
		}

		return redirect()->route('company.jobs.index')
			->with('success', 'Job created as draft.');
	}

	/**
	 * Display the specified resource.
	 */
	public function show(string $id)
	{
		$authUser = auth()->user();
		$companyId = $authUser->company_id ?? ($authUser->company->id ?? null);
		if (! $companyId) {
			abort(403);
		}

		$job = Job::with('skills')->where('company_id', $companyId)->findOrFail($id);

		return Inertia::render('Company/Jobs/Show', [
			'job' => $job,
		]);
	}

	/**
	 * Show the form for editing the specified resource.
	 */
	public function edit(string $id)
	{
		$authUser = auth()->user();
		$companyId = $authUser->company_id ?? ($authUser->company->id ?? null);
		if (! $companyId) {
			abort(403);
		}

		$job = Job::with('skills')->where('company_id', $companyId)->findOrFail($id);

		// prevent editing if already approved
		if ($job->status === self::STATUS_APPROVED) {
			abort(403, 'Approved jobs cannot be edited.');
		}

		$skills = Skill::orderBy('name')->get(['id', 'name']);

		return Inertia::render('Company/Jobs/Edit', [
			// send simple arrays to frontend
			'job' => $job->toArray(),
			'skills' => $skills->toArray(),
		]);
	}

	/**
	 * Update the specified resource in storage.
	 */
	public function update(Request $request, string $id)
	{
		$authUser = auth()->user();
		$companyId = $authUser->company_id ?? ($authUser->company->id ?? null);
		if (! $companyId) {
			abort(403);
		}

		$job = Job::where('company_id', $companyId)->findOrFail($id);

		// prevent updating if already approved
		if ($job->status === self::STATUS_APPROVED) {
			abort(403, 'Approved jobs cannot be updated.');
		}

		$data = $request->validate([
			'title' => 'required|string|max:191',
			'description' => 'required|string',
			'location' => 'nullable|string|max:191',
			'skills' => 'nullable|array',
			'skills.*' => 'integer|exists:skills,id',
		]);

		// filter $data to only existing columns before update
		$jobTable = $job->getTable();
		$filtered = [];
		foreach ($data as $k => $v) {
			if (Schema::hasColumn($jobTable, $k)) {
				$filtered[$k] = $v;
			}
		}

		$job->update($filtered);

		$job->skills()->sync($data['skills'] ?? []);

		return redirect()->route('company.jobs.index')
			->with('success', 'Job updated.');
	}

	/**
	 * Remove the specified resource from storage.
	 */
	public function destroy(string $id)
	{
		$authUser = auth()->user();
		$companyId = $authUser->company_id ?? ($authUser->company->id ?? null);
		if (! $companyId) {
			abort(403);
		}

		$job = Job::where('company_id', $companyId)->findOrFail($id);

		// prevent deletion if already approved
		if ($job->status === self::STATUS_APPROVED) {
			abort(403, 'Approved jobs cannot be deleted.');
		}

		$job->skills()->detach();
		$job->delete();

		return redirect()->route('company.jobs.index')
			->with('success', 'Job deleted.');
	}

	/**
	 * Submit job for review (change status to pending_review).
	 */
	public function submitForReview(string $id)
	{
		$authUser = auth()->user();
		$companyId = $authUser->company_id ?? ($authUser->company->id ?? null);
		if (! $companyId) {
			abort(403);
		}

		$job = Job::where('company_id', $companyId)->findOrFail($id);

		// Only allow submit if not approved or closed
		if (in_array($job->status, [self::STATUS_APPROVED, self::STATUS_CLOSED])) {
			abort(403, 'Cannot submit this job for review.');
		}

		$job->status = self::STATUS_PENDING_REVIEW;
		$job->save();

		return redirect()->route('company.jobs.index')
			->with('success', 'Job submitted for review.');
	}

	/**
	 * Close a job (change status to closed).
	 */
	public function close(string $id)
	{
		$authUser = auth()->user();
		$companyId = $authUser->company_id ?? ($authUser->company->id ?? null);
		if (! $companyId) {
			abort(403);
		}

		$job = Job::where('company_id', $companyId)->findOrFail($id);

		// allow closing unless already closed
		if ($job->status === self::STATUS_CLOSED) {
			return redirect()->back()->with('info', 'Job already closed.');
		}

		$job->status = self::STATUS_CLOSED;
		$job->save();

		return redirect()->route('company.jobs.index')
			->with('success', 'Job closed.');
	}
}
