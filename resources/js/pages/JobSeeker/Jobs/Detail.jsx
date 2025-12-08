import React from "react";
import { Link, usePage, Head, router } from "@inertiajs/react";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Detail() {
  const { auth, job, hasApplied, flash, errors } = usePage().props;
  const [processing, setProcessing] = React.useState(false);

  const handleApply = (e) => {
    e.preventDefault();
    setProcessing(true);

    router.post('/jobseeker/applications', {
      job_id: job.id,
    }, {
      onFinish: () => setProcessing(false),
    });
  };

  if (!job) {
    return (
      <AuthenticatedLayout user={auth.user}>
        <Head title="Job Not Found" />
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center py-10 text-gray-600">Job not found.</p>
          </div>
        </div>
      </AuthenticatedLayout>
    );
  }

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title={`${job.title} - Job Details`} />

      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Flash Messages */}
          {flash?.success && (
            <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-md">
              {flash.success}
            </div>
          )}
          {flash?.error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
              {flash.error}
            </div>
          )}
          {errors?.job_id && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
              {errors.job_id}
            </div>
          )}

          {/* Back Button */}
          <Link
            href="/jobseeker/jobs"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium mb-4"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Job List
          </Link>

          <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
            {/* Job Header */}
            <div className="border-b border-gray-200 pb-6 mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{job.title}</h1>

              <div className="flex flex-wrap gap-4 text-gray-700">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span className="font-medium">{job.company?.name || job.company?.company_name || 'Company'}</span>
                </div>

                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{job.location || 'Location not specified'}</span>
                </div>
              </div>
            </div>

            {/* Job Description */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Job Description</h2>
              <p className="text-gray-700 whitespace-pre-line leading-relaxed">{job.description || 'No description provided.'}</p>
            </div>

            {/* Required Skills */}
            {job.skills?.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Required Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill) => (
                    <span
                      key={skill.id}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Apply Button */}
            <div className="pt-6 border-t border-gray-200">
              {hasApplied ? (
                <button
                  disabled
                  className="w-full md:w-auto bg-gray-400 text-white px-8 py-3 rounded-md cursor-not-allowed font-medium"
                >
                  Already Applied
                </button>
              ) : (
                <button
                  onClick={handleApply}
                  disabled={processing}
                  className="w-full md:w-auto bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
                >
                  {processing ? 'Submitting...' : 'Apply Now'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
