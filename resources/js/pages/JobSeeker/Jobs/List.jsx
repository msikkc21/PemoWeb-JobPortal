import React, { useState } from "react";
import { Link, usePage, Head } from "@inertiajs/react";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function List() {
  const { auth, jobs, skills, selectedSkill: initialSkill } = usePage().props;
  const [selectedSkill, setSelectedSkill] = useState(initialSkill || "");

  const handleFilterChange = (e) => {
    const skill = e.target.value;
    setSelectedSkill(skill);
    // reload page with new filter
    window.location.href = route("jobseeker.jobs.index", { skill_id: skill });
  };

  // Extract jobs data from paginated response
  const jobsData = Array.isArray(jobs) ? jobs : (jobs?.data || []);

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Browse Jobs - JobSeeker" />
      
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Browse Jobs</h1>

            {/* Filter by skill */}
            <div className="mb-6">
              <label htmlFor="skillFilter" className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Skill:
              </label>
              <select
                id="skillFilter"
                value={selectedSkill}
                onChange={handleFilterChange}
                className="w-full md:w-64 border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">-- All Skills --</option>
                {skills?.map((skill) => (
                  <option key={skill.id} value={skill.id}>
                    {skill.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Job list */}
            {jobsData.length === 0 ? (
              <p className="text-gray-600 text-center py-8">No jobs found.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobsData.map((job) => (
                  <div
                    key={job.id}
                    className="border border-gray-200 rounded-xl p-5 bg-white shadow-sm hover:shadow-lg transition-shadow duration-200"
                  >
                    <h2 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{job.title}</h2>
                    <p className="text-gray-700 text-sm font-medium mb-1">{job.company?.name || 'Company'}</p>
                    <p className="text-gray-600 text-sm mb-4 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {job.location || 'Location not specified'}
                    </p>

                    <Link
                      href={route("jobseeker.jobs.show", job.id)}
                      className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm"
                    >
                      View Details 
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {!Array.isArray(jobs) && jobs?.links && jobs.links.length > 3 && (
              <div className="flex justify-center gap-2 mt-8">
                {jobs.links.map((link, index) => (
                  <Link
                    key={index}
                    href={link.url || "#"}
                    preserveState
                    className={`px-4 py-2 border rounded-md font-medium transition-colors ${
                      link.active
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    } ${!link.url ? "opacity-50 cursor-not-allowed" : ""}`}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
