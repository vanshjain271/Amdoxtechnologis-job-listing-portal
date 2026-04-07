import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import jobService from "../services/jobService";

const JobCard = ({ job }) => (
  <Link
    to={`/dashboard/jobs/${job._id}`}
    className="group block bg-slate-900 border border-slate-800 rounded-2xl p-6
               hover:border-amber-400/30 hover:bg-slate-900/80 transition-all duration-200"
  >
    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors truncate">
          {job.title}
        </h3>
        <p className="text-sm font-semibold text-slate-400 mt-1">
          {job.employerId?.companyName || "Unknown Company"}
        </p>
        
        <div className="flex flex-wrap items-center gap-3 mt-4">
          <span className="flex items-center gap-1.5 text-xs text-slate-500">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {job.location}
          </span>
          <span className="flex items-center gap-1.5 text-xs text-slate-500">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {job.jobType}
          </span>
          <span className="flex items-center gap-1.5 text-xs text-slate-500">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {job.salaryRange}
          </span>
        </div>
      </div>
      
      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2">
        <span className="bg-slate-800 text-slate-400 text-[10px] font-mono px-2 py-0.5 rounded-full">
          {new Date(job.createdAt).toLocaleDateString()}
        </span>
        <button className="sm:mt-auto px-4 py-1.5 bg-slate-800 group-hover:bg-amber-400 text-slate-300 group-hover:text-slate-900 
                         text-xs font-bold rounded-lg transition-all duration-200">
          View Details
        </button>
      </div>
    </div>
  </Link>
);

const Jobs = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    keyword: "",
    location: "",
    jobType: "",
  });

  const isEmployer = user?.role === "employer";

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const data = isEmployer 
        ? await jobService.getMyJobs() 
        : await jobService.getJobs(filters);
      setJobs(data.jobs);
    } catch (err) {
      setError("Failed to load jobs.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(fetchJobs, 300); // Debounce
    return () => clearTimeout(timer);
  }, [filters, isEmployer]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="px-4 sm:px-6 py-8 max-w-5xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
        <div>
          <h2 className="font-display text-3xl font-bold text-white tracking-tight">
            {isEmployer ? "My Job Listings" : "Find Your Next Role"}
          </h2>
          <p className="text-slate-500 text-sm mt-2">
            {isEmployer 
              ? "Manage and track the positions you've posted." 
              : "Discover opportunities that match your expertise."}
          </p>
        </div>
        
        {isEmployer && (
          <Link to="/dashboard/jobs/create" className="btn-primary flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Post New Job
          </Link>
        )}
      </div>

      {/* Search & Filters (only for seekers) */}
      {!isEmployer && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="md:col-span-2 relative">
            <input
              type="text"
              name="keyword"
              placeholder="Search title, skills, or keywords..."
              value={filters.keyword}
              onChange={handleFilterChange}
              className="input-field pl-10"
            />
            <svg className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            name="location"
            placeholder="Location..."
            value={filters.location}
            onChange={handleFilterChange}
            className="input-field"
          />
          <select
            name="jobType"
            value={filters.jobType}
            onChange={handleFilterChange}
            className="input-field cursor-pointer"
          >
            <option value="">All Job Types</option>
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="contract">Contract</option>
            <option value="freelance">Freelance</option>
            <option value="internship">Internship</option>
          </select>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-10 h-10 border-2 border-slate-800 border-t-amber-400 rounded-full animate-spin" />
          <p className="text-slate-600 text-xs font-mono tracking-wider">Fetching opportunities...</p>
        </div>
      ) : error ? (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-6 rounded-2xl text-center">
          {error}
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/50 border border-dashed border-slate-800 rounded-3xl">
          <div className="text-4xl mb-4">🔍</div>
          <p className="text-slate-300 font-semibold">No jobs found</p>
          <p className="text-slate-500 text-sm mt-1">Try adjusting your filters or check back later.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {jobs.map(job => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Jobs;
