import { useState } from "react";
import { useNavigate } from "react-router-dom";
import jobService from "../services/jobService";

const inputCls = "w-full bg-slate-800 border border-slate-700/50 text-slate-100 placeholder-slate-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400/50 transition-all duration-200 outline-none";
const labelCls = "text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 block";

const CreateJob = () => {
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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = {
        ...formData,
        skills: formData.skills.split(",").map(s => s.trim()).filter(Boolean),
      };
      await jobService.createJob(payload);
      navigate("/dashboard/jobs");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create job listing.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 sm:px-6 py-8 max-w-3xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h2 className="font-display text-3xl font-bold text-white tracking-tight">Post a New Job</h2>
        <p className="text-slate-500 text-sm mt-2">Find the perfect candidate for your company.</p>
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
          <button type="submit" disabled={loading} className="btn-primary flex-1">
            {loading ? "Posting..." : "Publish Job Listing"}
          </button>
          <button type="button" onClick={() => navigate(-1)} className="btn-ghost flex-1">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateJob;
