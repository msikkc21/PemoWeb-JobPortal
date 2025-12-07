import React, { useState } from "react";
import { Link, usePage } from "@inertiajs/react";

export default function List() {
  const { jobs, filters } = usePage().props;
  const [selectedSkill, setSelectedSkill] = useState(filters?.skill_id || "");

  const handleFilterChange = (e) => {
    const skill = e.target.value;
    setSelectedSkill(skill);
    // reload page with new filter
    window.location.href = route("jobseeker.jobs.index", { skill_id: skill });
  };

  return (
    <div className="max-w-5xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Browse Jobs</h1>

      {/* Filter by skill */}
      <div className="mb-6">
        <label htmlFor="skillFilter" className="block text-sm font-medium mb-2">
          Filter by Skill:
        </label>
        <select
          id="skillFilter"
          value={selectedSkill}
          onChange={handleFilterChange}
          className="border border-gray-300 rounded-md p-2"
        >
          <option value="">-- All Skills --</option>
          {filters?.skills?.map((skill) => (
            <option key={skill.id} value={skill.id}>
              {skill.name}
            </option>
          ))}
        </select>
      </div>

      {/* Job list */}
      {jobs.length === 0 ? (
        <p className="text-gray-600">No jobs found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition"
            >
              <h2 className="text-lg font-semibold mb-2">{job.title}</h2>
              <p className="text-gray-700 text-sm mb-2">{job.company?.name}</p>
              <p className="text-gray-600 text-sm mb-4">{job.location}</p>

              <Link
                href={route("jobseeker.jobs.show", job.id)}
                className="text-blue-600 hover:underline"
              >
                View Details →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
