import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import jobService from "../services/jobService";
import applicationService from "../services/applicationService";

const Section = ({ title, content }) => (
  <div className="mb-8">
    <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">{title}</h3>
    <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{content}</div>
  </div>
);

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [job, setJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [applying, setApplying] = useState(false);
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [applied, setApplied] = useState(false);

  const isEmployer = user?.role === "employer";
  const isOwner = job?.postedBy?.toString() === user?.id?.toString();

  const fetchData = async () => {
    setLoading(true);
    try {
      const jobData = await jobService.getJobById(id);
      setJob(jobData.job);
      
      if (isEmployer && jobData.job.postedBy.toString() === user.id.toString()) {
        const appsData = await applicationService.getJobApplications(id);
        setApplications(appsData.applications);
      }
    } catch (err) {
      setError("Failed to load job details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id, user.id]);

  const handleApply = async (e) => {
    e.preventDefault();
    setApplying(true);
    try {
      await applicationService.applyToJob(id, coverLetter);
      setApplied(true);
      setShowApplyForm(false);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to submit application.");
    } finally {
      setApplying(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this job listing?")) {
      try {
        await jobService.deleteJob(id);
        navigate("/dashboard/jobs");
      } catch (err) {
        alert("Failed to delete job.");
      }
    }
  };

  const handleStatusUpdate = async (appId, status) => {
    try {
      await applicationService.updateApplicationStatus(appId, status);
      fetchData(); // Refresh apps
    } catch (err) {
      alert("Failed to update status.");
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="w-10 h-10 border-2 border-slate-800 border-t-amber-400 rounded-full animate-spin" />
      <p className="text-slate-600 text-xs font-mono tracking-wider">Loading job details...</p>
    </div>
  );

  if (error || !job) return (
    <div className="px-4 py-20 text-center">
      <p className="text-red-400 font-semibold">{error || "Job not found"}</p>
      <Link to="/dashboard/jobs" className="btn-ghost mt-4 inline-block">Back to Jobs</Link>
    </div>
  );

  return (
    <div className="px-4 sm:px-6 py-8 max-w-5xl mx-auto animate-fade-in">
      {/* Header Card */}
      <div className="card-surface p-8 mb-8">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white tracking-tight mb-2">{job.title}</h1>
            <div className="flex flex-wrap items-center gap-4">
              <span className="text-amber-400 font-semibold text-sm">
                {job.employerId?.companyName}
              </span>
              <span className="w-1 h-1 rounded-full bg-slate-700" />
              <span className="text-slate-400 text-sm">{job.location}</span>
              <span className="w-1 h-1 rounded-full bg-slate-700" />
              <span className="text-slate-400 text-sm uppercase font-mono tracking-wider text-[10px]">
                {job.jobType}
              </span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {isEmployer ? (
              isOwner && (
                <>
                  <Link to={`/dashboard/jobs/edit/${id}`} className="btn-ghost px-6">Edit</Link>
                  <button onClick={handleDelete} className="px-6 py-2.5 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all font-semibold text-sm">
                    Delete
                  </button>
                </>
              )
            ) : applied ? (
              <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Applied Successfuly
              </span>
            ) : (
              <button 
                onClick={() => setShowApplyForm(true)} 
                className="btn-primary px-8"
                disabled={applied}
              >
                Apply Now
              </button>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-8 border-t border-slate-800/60">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-1">Salary</p>
            <p className="text-white font-semibold">{job.salaryRange}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-1">Experience</p>
            <p className="text-white font-semibold">{job.experience || "N/A"}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-1">Posted</p>
            <p className="text-white font-semibold">{new Date(job.createdAt).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-1">Applicants</p>
            <p className="text-white font-semibold">{applications.length}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-2">
          <div className="card-surface p-8">
            <Section title="Description" content={job.description} />
            <Section title="Responsibilities" content={job.responsibilities} />
            <Section title="Qualifications" content={job.qualifications} />
            
            <div className="mb-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {job.skills?.map(skill => (
                  <span key={skill} className="px-3 py-1 bg-slate-800 text-slate-300 border border-slate-700 rounded-lg text-xs">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Applications list for Employer */}
          {isEmployer && isOwner && (
            <div className="card-surface p-8 mt-8">
              <h3 className="text-lg font-bold text-white mb-6">Applicants ({applications.length})</h3>
              {applications.length === 0 ? (
                <p className="text-slate-500 text-sm py-4 text-center border border-dashed border-slate-800 rounded-xl">
                  No one has applied yet.
                </p>
              ) : (
                <div className="space-y-4">
                  {applications.map(app => (
                    <div key={app._id} className="p-5 bg-slate-950/50 border border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3">
                          <p className="text-white font-semibold">{app.applicantId.fullName}</p>
                          <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                            app.status === 'accepted' ? 'bg-emerald-500/10 text-emerald-400' :
                            app.status === 'rejected' ? 'bg-red-500/10 text-red-400' :
                            'bg-amber-400/10 text-amber-400'
                          }`}>
                            {app.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">{app.applicantId.email} • {app.applicantId.phone}</p>
                        <a href={`http://localhost:5001${app.resumeURL}`} target="_blank" rel="noreferrer" 
                           className="text-xs text-amber-400/70 hover:text-amber-400 mt-2 inline-block font-semibold">
                          View Resume ↗
                        </a>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleStatusUpdate(app._id, 'accepted')} 
                                className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded-lg transition-all border border-emerald-500/20">
                          Shortlist
                        </button>
                        <button onClick={() => handleStatusUpdate(app._id, 'rejected')} 
                                className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-[10px] font-bold rounded-lg transition-all border border-red-500/20">
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="card-surface p-6">
            <h3 className="text-sm font-bold text-white mb-4">About the Company</h3>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-xl">
                🏢
              </div>
              <div>
                <p className="text-white font-bold">{job.employerId?.companyName}</p>
                <p className="text-xs text-slate-500">{job.employerId?.industry}</p>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed line-clamp-4">
              {job.employerId?.description}
            </p>
            {job.employerId?.companyWebsite && (
              <a href={job.employerId.companyWebsite} target="_blank" rel="noreferrer" 
                 className="btn-ghost w-full mt-4 text-[10px] py-2 text-center block">
                Visit Website ↗
              </a>
            )}
          </div>
          
          {/* Apply Modal/Inline Form for Seeker */}
          {showApplyForm && !isEmployer && (
            <div className="card-surface p-6 border-amber-400/30 animate-scale-in">
              <h3 className="text-sm font-bold text-white mb-4">Ready to apply?</h3>
              <form onSubmit={handleApply} className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 block">
                    Cover Letter (Optional)
                  </label>
                  <textarea 
                    rows={4}
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    placeholder="Tell the employer why you're a great fit..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-300 resize-none outline-none focus:border-amber-400/50 transition-all shadow-inner"
                  />
                </div>
                <div className="flex gap-2">
                  <button type="submit" disabled={applying} className="btn-primary flex-1 py-2 text-xs">
                    {applying ? "Submitting..." : "Submit Application"}
                  </button>
                  <button type="button" onClick={() => setShowApplyForm(false)} className="btn-ghost flex-1 py-2 text-xs">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
