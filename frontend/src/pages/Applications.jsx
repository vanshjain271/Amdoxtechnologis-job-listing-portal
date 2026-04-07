import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import applicationService from "../services/applicationService";

const StatusBadge = ({ status }) => {
  const styles = {
    pending: "bg-amber-400/10 text-amber-400 border-amber-400/20",
    reviewed: "bg-blue-400/10 text-blue-400 border-blue-400/20",
    accepted: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    rejected: "bg-red-500/10 text-red-400 border-red-500/20",
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${styles[status] || styles.pending}`}>
      {status}
    </span>
  );
};

const Applications = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const isEmployer = user?.role === "employer";

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const data = isEmployer 
          ? { applications: [] } // For now, employers view apps per job in JobDetails, or we could add a global view
          : await applicationService.getMyApplications();
        setApplications(data.applications || []);
      } catch (err) {
        setError("Failed to load applications.");
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, [isEmployer]);

  if (isEmployer) {
    return (
      <div className="px-4 sm:px-6 py-12 max-w-4xl mx-auto animate-fade-in text-center">
        <div className="card-surface p-12">
          <div className="text-4xl mb-4">💼</div>
          <h2 className="text-2xl font-bold text-white mb-2">Applicant Management</h2>
          <p className="text-slate-500 mb-8 max-w-md mx-auto">
            Applications are managed per job listing. Go to your jobs to see who applied.
          </p>
          <Link to="/dashboard/jobs" className="btn-primary inline-flex items-center gap-2">
            View My Jobs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 py-8 max-w-4xl mx-auto animate-fade-in">
      <div className="mb-10">
        <h2 className="font-display text-3xl font-bold text-white tracking-tight">My Applications</h2>
        <p className="text-slate-500 text-sm mt-2">Track the progress of your job search.</p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-10 h-10 border-2 border-slate-800 border-t-amber-400 rounded-full animate-spin" />
        </div>
      ) : error ? (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-6 rounded-2xl text-center">
          {error}
        </div>
      ) : applications.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/50 border border-dashed border-slate-800 rounded-3xl">
          <div className="text-4xl mb-4">📄</div>
          <p className="text-slate-300 font-semibold">No applications yet</p>
          <p className="text-slate-500 text-sm mt-1">Start applying to jobs to see them here.</p>
          <Link to="/dashboard/jobs" className="btn-ghost mt-6 inline-block">Browse Jobs</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div key={app._id} className="group bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-all">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors">
                    {app.jobId?.title}
                  </h3>
                  <div className="flex items-center gap-3 mt-1">
                    <p className="text-sm font-semibold text-slate-400">
                      {app.jobId?.employerId?.companyName}
                    </p>
                    <span className="text-slate-700">•</span>
                    <p className="text-xs text-slate-500">{app.jobId?.location}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-6">
                  <div className="text-right">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-1">Status</p>
                    <StatusBadge status={app.status} />
                  </div>
                  <Link 
                    to={`/dashboard/jobs/${app.jobId?._id}`}
                    className="p-2 bg-slate-800 hover:bg-amber-400 text-slate-500 hover:text-slate-900 rounded-lg transition-all"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-800/50 flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-600">
                  Applied on {new Date(app.appliedAt).toLocaleDateString()}
                </span>
                <span className="text-[10px] text-slate-500 italic">
                  {app.status === 'pending' ? 'Employer will review this soon' : 'Status updated recently'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Applications;
