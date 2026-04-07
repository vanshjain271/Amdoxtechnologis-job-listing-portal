import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import jobService from "../services/jobService";

const inputCls = "w-full bg-slate-800 border border-slate-700/50 text-slate-100 placeholder-slate-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400/50 transition-all duration-200 outline-none";
const labelCls = "text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 block";

const EditJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    qualifications: "",
    responsibilities: "",
    location: "",
    salaryRange: "",
    jobType: "full-time",
    experience: "",
    skills: "",
  });

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const data = await jobService.getJobById(id);
        const job = data.job;
        setFormData({
          title: job.title,
          description: job.description,
          qualifications: job.qualifications,
          responsibilities: job.responsibilities,
          location: job.location,
          salaryRange: job.salaryRange,
          jobType: job.jobType,
          experience: job.experience || "",
          skills: job.skills?.join(", ") || "",
        });
      } catch (err) {
        setError("Failed to load job details.");
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setError("");

    try {
      const payload = {
        ...formData,
        skills: formData.skills.split(",").map(s => s.trim()).filter(Boolean),
      };
      await jobService.updateJob(id, payload);
      navigate("/dashboard/jobs");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update job listing.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="w-10 h-10 border-2 border-slate-800 border-t-amber-400 rounded-full animate-spin" />
      <p className="text-slate-600 text-xs font-mono tracking-wider">Loading job details...</p>
    </div>
  );

  return (
    <div className="px-4 sm:px-6 py-8 max-w-3xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h2 className="font-display text-3xl font-bold text-white tracking-tight">Edit Job Listing</h2>
        <p className="text-slate-500 text-sm mt-2">Adjust the details of your posting.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 card-surface p-8">
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className={labelCls}>Job Title</label>
            <input type="text" name="title" required placeholder="e.g. Senior Frontend Developer"
              value={formData.title} onChange={handleChange} className={inputCls} />
          </div>

          <div>
            <label className={labelCls}>Location</label>
            <input type="text" name="location" required placeholder="e.g. Remote, NY, London"
              value={formData.location} onChange={handleChange} className={inputCls} />
          </div>

          <div>
            <label className={labelCls}>Job Type</label>
            <select name="jobType" value={formData.jobType} onChange={handleChange} className={inputCls}>
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="contract">Contract</option>
              <option value="freelance">Freelance</option>
              <option value="internship">Internship</option>
            </select>
          </div>

          <div>
            <label className={labelCls}>Salary Range</label>
            <input type="text" name="salaryRange" required placeholder="e.g. $80k - $120k"
              value={formData.salaryRange} onChange={handleChange} className={inputCls} />
          </div>

          <div>
            <label className={labelCls}>Experience Level</label>
            <input type="text" name="experience" required placeholder="e.g. 3+ years"
              value={formData.experience} onChange={handleChange} className={inputCls} />
          </div>
        </div>

        <div>
          <label className={labelCls}>Skills (comma separated)</label>
          <input type="text" name="skills" placeholder="React, Node.js, TypeScript"
            value={formData.skills} onChange={handleChange} className={inputCls} />
        </div>

        <div>
          <label className={labelCls}>Job Description</label>
          <textarea name="description" required rows={5} placeholder="Describe the role..."
            value={formData.description} onChange={handleChange} className={inputCls + " resize-none"} />
        </div>

        <div>
          <label className={labelCls}>Qualifications</label>
          <textarea name="qualifications" required rows={4} placeholder="What background are you looking for?"
            value={formData.qualifications} onChange={handleChange} className={inputCls + " resize-none"} />
        </div>

        <div>
          <label className={labelCls}>Responsibilities</label>
          <textarea name="responsibilities" required rows={4} placeholder="What will they be doing?"
            value={formData.responsibilities} onChange={handleChange} className={inputCls + " resize-none"} />
        </div>

        <div className="flex items-center gap-4 pt-4">
          <button type="submit" disabled={updating} className="btn-primary flex-1">
            {updating ? "Updating..." : "Update Job Listing"}
          </button>
          <button type="button" onClick={() => navigate(-1)} className="btn-ghost flex-1">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditJob;
