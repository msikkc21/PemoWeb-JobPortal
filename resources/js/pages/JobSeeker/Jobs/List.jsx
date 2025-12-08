import React, { useState, useEffect, useRef } from "react";
import { Link, usePage, Head, router } from "@inertiajs/react";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function List() {
  const { auth, jobs, skills, selectedSkill: initialSkill, search: initialSearch = '', jobSeekerSkills = [] } = usePage().props;
  const [selectedSkill, setSelectedSkill] = useState(initialSkill || "");
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [isSearching, setIsSearching] = useState(false);
  const isInitialMount = useRef(true);
  const debounceTimer = useRef(null);

  // Realtime search with custom debounce
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    setIsSearching(true);

    // Clear previous timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Set new debounce timer
    debounceTimer.current = setTimeout(() => {
      const query = {};
      if (searchTerm) query.search = searchTerm;
      if (selectedSkill) query.skill_id = selectedSkill;

      router.get('/jobseeker/jobs', query, {
        preserveState: true,
        replace: true,
        onFinish: () => setIsSearching(false),
      });
    }, 400);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [searchTerm]);

  const handleFilterChange = (e) => {
    const skill = e.target.value;
    setSelectedSkill(skill);

    const query = {};
    if (searchTerm) query.search = searchTerm;
    if (skill) query.skill_id = skill;

    router.get('/jobseeker/jobs', query, {
      preserveState: true,
      replace: true,
    });
  };

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  // Extract jobs data from paginated response
  const jobsData = Array.isArray(jobs) ? jobs : (jobs?.data || []);

  // Get match percentage color
  const getMatchColor = (percentage) => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-emerald-500';
    if (percentage >= 40) return 'bg-yellow-500';
    if (percentage >= 20) return 'bg-orange-500';
    return 'bg-gray-400';
  };

  const getMatchBgColor = (percentage) => {
    if (percentage >= 80) return 'bg-green-50 border-green-200';
    if (percentage >= 60) return 'bg-emerald-50 border-emerald-200';
    if (percentage >= 40) return 'bg-yellow-50 border-yellow-200';
    if (percentage >= 20) return 'bg-orange-50 border-orange-200';
    return 'bg-gray-50 border-gray-200';
  };

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Browse Jobs - JobSeeker" />

      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold text-gray-900">Browse Jobs</h1>
              {jobSeekerSkills.length > 0 && (
                <div className="text-sm text-gray-500">
                  Diurutkan berdasarkan kecocokan skill
                </div>
              )}
            </div>

            {/* Info box for skill matching */}
            {jobSeekerSkills.length === 0 && (
              <div className="mb-6 p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-indigo-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-indigo-800">Tingkatkan Kecocokan dengan Lowongan!</p>
                    <p className="text-xs text-indigo-600 mt-1">
                      Tambahkan skill Anda di{' '}
                      <Link href="/jobseeker/profile/edit" className="underline font-medium">profil</Link>{' '}
                      untuk melihat persentase kecocokan dengan setiap lowongan.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Search and Filter */}
            <div className="mb-6 space-y-4">
              {/* Search Bar - Realtime */}
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Cari berdasarkan judul, perusahaan, lokasi, atau deskripsi..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {isSearching && (
                  <div className="absolute right-10 top-1/2 -translate-y-1/2">
                    <svg className="animate-spin w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                )}
                {searchTerm && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Filter by skill */}
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <label htmlFor="skillFilter" className="text-sm font-medium text-gray-700">
                    Filter Skill:
                  </label>
                  <select
                    id="skillFilter"
                    value={selectedSkill}
                    onChange={handleFilterChange}
                    className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Semua Skill</option>
                    {skills?.map((skill) => (
                      <option key={skill.id} value={skill.id}>
                        {skill.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Active filters */}
                {(searchTerm || selectedSkill) && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>Filter aktif:</span>
                    {searchTerm && (
                      <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                        "{searchTerm}"
                        <button onClick={handleClearSearch} className="ml-1 hover:text-blue-600">×</button>
                      </span>
                    )}
                    {selectedSkill && (
                      <span className="inline-flex items-center px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                        {skills?.find(s => s.id == selectedSkill)?.name}
                        <button onClick={() => handleFilterChange({ target: { value: '' } })} className="ml-1 hover:text-purple-600">×</button>
                      </span>
                    )}
                  </div>
                )}

                <div className="ml-auto text-sm text-gray-500">
                  {jobs?.total || jobsData.length} lowongan ditemukan
                </div>
              </div>
            </div>

            {/* Job list */}
            {jobsData.length === 0 ? (
              <p className="text-gray-600 text-center py-8">No jobs found.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobsData.map((job) => (
                  <div
                    key={job.id}
                    className={`border rounded-xl p-5 shadow-sm hover:shadow-lg transition-shadow duration-200 ${job.matchPercentage > 0 ? getMatchBgColor(job.matchPercentage) : 'bg-white border-gray-200'
                      }`}
                  >
                    {/* Match Percentage Badge */}
                    {jobSeekerSkills.length > 0 && (
                      <div className="flex justify-between items-start mb-3">
                        <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold text-white ${getMatchColor(job.matchPercentage)}`}>
                          {job.matchPercentage}% Match
                        </div>
                        {job.matchingSkills > 0 && (
                          <span className="text-xs text-gray-500">
                            {job.matchingSkills}/{job.totalSkills} skills
                          </span>
                        )}
                      </div>
                    )}

                    <h2 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{job.title}</h2>
                    <p className="text-gray-700 text-sm font-medium mb-1">{job.company?.company_name || job.company?.name || 'Company'}</p>
                    <p className="text-gray-600 text-sm mb-3 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {job.location || 'Location not specified'}
                    </p>

                    {/* Job Skills Preview */}
                    {job.skills && job.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {job.skills.slice(0, 3).map((skill) => (
                          <span
                            key={skill.id}
                            className={`px-2 py-0.5 text-xs rounded-full ${jobSeekerSkills.includes(skill.id)
                              ? 'bg-green-100 text-green-800 font-medium'
                              : 'bg-gray-100 text-gray-600'
                              }`}
                          >
                            {skill.name}
                          </span>
                        ))}
                        {job.skills.length > 3 && (
                          <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-500">
                            +{job.skills.length - 3}
                          </span>
                        )}
                      </div>
                    )}

                    <Link
                      href={`/jobseeker/jobs/${job.id}`}
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
            {jobs?.last_page > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                {Array.from({ length: jobs.last_page }, (_, i) => i + 1).map((page) => {
                  const params = new URLSearchParams();
                  params.set('page', page);
                  if (selectedSkill) params.set('skill_id', selectedSkill);
                  if (searchTerm) params.set('search', searchTerm);

                  return (
                    <Link
                      key={page}
                      href={`/jobseeker/jobs?${params.toString()}`}
                      preserveState
                      className={`px-4 py-2 border rounded-md font-medium transition-colors ${page === jobs.current_page
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                        }`}
                    >
                      {page}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
