import React from "react";
import { Link, usePage } from "@inertiajs/react";

export default function Detail() {
  const { job, hasApplied } = usePage().props;

  if (!job) {
    return <p className="text-center py-10">Job not found.</p>;
  }

  return (
    <div className="max-w-4xl mx-auto py-10">
      <Link
        href={route("jobseeker.jobs.index")}
        className="text-blue-600 hover:underline mb-4 inline-block"
      >
        ← Back to Job List
      </Link>

      <div className="border border-gray-200 rounded-xl p-6 shadow-sm">
        <h1 className="text-2xl font-bold mb-2">{job.title}</h1>
        <p className="text-gray-700 mb-1">
          <strong>Company:</strong> {job.company?.name}
        </p>
        <p className="text-gray-700 mb-1">
          <strong>Location:</strong> {job.location}
        </p>

        <div className="mt-4">
          <h2 className="text-lg font-semibold mb-2">Job Description</h2>
          <p className="text-gray-700 whitespace-pre-line">{job.description}</p>
        </div>

        {job.skills?.length > 0 && (
          <div className="mt-4">
            <h2 className="text-lg font-semibold mb-2">Required Skills</h2>
            <ul className="list-disc ml-6 text-gray-700">
              {job.skills.map((skill) => (
                <li key={skill.id}>{skill.name}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Apply Button */}
        <div className="mt-6">
          {hasApplied ? (
            <button
              disabled
              className="bg-gray-400 text-white px-4 py-2 rounded-md cursor-not-allowed"
            >
              Already Applied
            </button>
          ) : (
            <Link
              href={route("jobseeker.applications.store")}
              method="post"
              data={{ job_id: job.id }}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Apply Now
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
