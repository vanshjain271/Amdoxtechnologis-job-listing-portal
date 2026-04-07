import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import {
  getJobSeekerProfile,
  updateJobSeekerProfile,
  getEmployerProfile,
  updateEmployerProfile,
  uploadResume,
} from "../services/profileService";

// ─────────────────────────────────────────────
// SHARED FIELD COMPONENTS (same as CreateProfile)
// ─────────────────────────────────────────────

const FormField = ({ label, id, error, required, hint, children }) => (
  <div className="flex flex-col gap-1.5">
    <label htmlFor={id} className="text-xs font-bold uppercase tracking-widest text-slate-500">
      {label} {required && <span className="text-amber-400">*</span>}
    </label>
    {children}
    {hint && !error && <p className="text-xs text-slate-600">{hint}</p>}
    {error && <p className="text-xs text-red-400 mt-0.5">{error}</p>}
  </div>
);

const inputCls = (err) =>
  `w-full bg-slate-800/60 border ${
    err ? "border-red-500/60" : "border-slate-700"
  } text-slate-100 placeholder-slate-500 rounded-xl px-4 py-3 text-sm
  focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400/50
  transition-all duration-200`;

const textareaCls = () =>
  `w-full bg-slate-800/60 border border-slate-700 text-slate-100 placeholder-slate-500
  rounded-xl px-4 py-3 text-sm resize-none
  focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400/50
  transition-all duration-200`;

// ─────────────────────────────────────────────
// EDIT JOB SEEKER FORM
// Pre-populated from existing profile data
// ─────────────────────────────────────────────

const EditJobSeekerForm = ({ profile, onSubmit, loading, serverError }) => {
  const [form, setForm] = useState({
    fullName: profile?.fullName || "",
    phone: profile?.phone || "",
    location: profile?.location || "",
    skills: Array.isArray(profile?.skills) ? profile.skills.join(", ") : "",
    experience: profile?.experience || "",
    education: profile?.education || "",
    linkedin: profile?.linkedin || "",
    github: profile?.github || "",
    portfolio: profile?.portfolio || "",
  });
  const [onAutoFill, setOnAutoFill] = useState(false);

  const handleResumeChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setResumeFile(file);

    // AI Parsing trigger
    setOnAutoFill(true);
    try {
      const data = await uploadResume(file, (pe) => {
        setUploadProgress(Math.round((pe.loaded * 100) / pe.total));
      });
      if (data.success && data.parsedData) {
        const pd = data.parsedData;
        setForm(prev => ({
          ...prev,
          fullName: pd.fullName || prev.fullName,
          phone: pd.phone || prev.phone,
          location: pd.location || prev.location,
          skills: Array.isArray(pd.skills) ? pd.skills.join(", ") : pd.skills || prev.skills,
          experience: pd.experience || prev.experience,
          education: pd.education || prev.education,
          linkedin: pd.linkedin || prev.linkedin,
          github: pd.github || prev.github,
        }));
        setUploadProgress(100);
      }
    } catch (err) {
      console.error("Auto-fill error:", err);
    } finally {
      setTimeout(() => setOnAutoFill(false), 2000);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    // Pass null as resumeFile since we already uploaded it above
    await onSubmit(form, null, setUploadProgress);
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {onAutoFill && (
        <div className="bg-amber-400/10 border border-amber-400/30 text-amber-400 px-4 py-3 rounded-xl text-sm flex items-center gap-3 animate-pulse">
          <Sparkles size={16} />
          <span>AI is parsing your resume and pre-filling the form...</span>
        </div>
      )}
      {serverError && (
        <div className="flex items-center gap-2.5 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm">
          <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {serverError}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <FormField label="Full Name" id="fullName" error={errors.fullName} required>
          <input id="fullName" name="fullName" type="text" placeholder="Jane Doe"
            value={form.fullName} onChange={handleChange}
            className={inputCls(errors.fullName)} disabled={loading} />
        </FormField>

        <FormField label="Phone" id="phone">
          <input id="phone" name="phone" type="tel" placeholder="+1 555 000 0000"
            value={form.phone} onChange={handleChange}
            className={inputCls()} disabled={loading} />
        </FormField>

        <FormField label="Location" id="location">
          <input id="location" name="location" type="text" placeholder="City, Country"
            value={form.location} onChange={handleChange}
            className={inputCls()} disabled={loading} />
        </FormField>

        <FormField label="Skills" id="skills" hint="Comma-separated, e.g. React, Node.js">
          <input id="skills" name="skills" type="text"
            placeholder="React, Node.js, MongoDB"
            value={form.skills} onChange={handleChange}
            className={inputCls()} disabled={loading} />
        </FormField>
      </div>

      <FormField label="Experience" id="experience">
        <textarea id="experience" name="experience" rows={4}
          placeholder="Work experience, roles, and achievements..."
          value={form.experience} onChange={handleChange}
          className={textareaCls()} disabled={loading} />
      </FormField>

      <FormField label="Education" id="education">
        <textarea id="education" name="education" rows={3}
          placeholder="Degree, institution, year..."
          value={form.education} onChange={handleChange}
          className={textareaCls()} disabled={loading} />
      </FormField>

      {/* Resume Upload - NOW WITH AUTO FILL */}
      <FormField
        label="Smart Resume Upload"
        id="resume"
        hint="Upload to automatically pre-fill your profile using AI"
      >
        <div className={`${inputCls()} flex items-center gap-3 cursor-pointer relative group border-dashed border-2 hover:border-amber-400/50 transition-all`}>
          <label htmlFor="resume" className="cursor-pointer flex items-center justify-center gap-3 w-full py-2">
            <div className="w-10 h-10 rounded-full bg-amber-400/10 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
              <Zap size={20} />
            </div>
            <div className="text-left">
              <p className="text-sm font-bold text-slate-200">
                {resumeFile ? resumeFile.name : "Select Resume"}
              </p>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">PDF, DOC (MAX 5MB)</p>
            </div>
          </label>
          <input id="resume" type="file" accept=".pdf,.doc,.docx"
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={handleResumeChange}
            disabled={loading} />
        </div>
        {uploadProgress > 0 && (
          <div className="mt-3">
            <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-amber-400 transition-all duration-300"
                style={{ width: `${uploadProgress}%` }} />
            </div>
            <div className="flex justify-between items-center mt-1">
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                {uploadProgress === 100 ? "Ready to save" : "Uploading & Parsing..."}
              </p>
              <p className="text-[10px] text-amber-400 font-bold">{uploadProgress}%</p>
            </div>
          </div>
        )}
      </FormField>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <FormField label="LinkedIn" id="linkedin">
          <input id="linkedin" name="linkedin" type="url"
            placeholder="https://linkedin.com/in/..."
            value={form.linkedin} onChange={handleChange}
            className={inputCls()} disabled={loading} />
        </FormField>
        <FormField label="GitHub" id="github">
          <input id="github" name="github" type="url"
            placeholder="https://github.com/..."
            value={form.github} onChange={handleChange}
            className={inputCls()} disabled={loading} />
        </FormField>
        <FormField label="Portfolio" id="portfolio">
          <input id="portfolio" name="portfolio" type="url"
            placeholder="https://yoursite.com"
            value={form.portfolio} onChange={handleChange}
            className={inputCls()} disabled={loading} />
        </FormField>
      </div>

      <button type="submit" disabled={loading}
        className="w-full bg-amber-400 hover:bg-amber-300 text-slate-900 font-semibold
                   py-3 px-6 rounded-xl text-sm tracking-wide transition-all duration-200
                   active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed
                   focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:ring-offset-2 focus:ring-offset-slate-900">
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-slate-700 border-t-slate-900 rounded-full animate-spin" />
            Saving Changes...
          </span>
        ) : "Save Changes"}
      </button>
    </form>
  );
};

// ─────────────────────────────────────────────
// EDIT EMPLOYER FORM
// ─────────────────────────────────────────────

const EditEmployerForm = ({ profile, onSubmit, loading, serverError }) => {
  const [form, setForm] = useState({
    companyName: profile?.companyName || "",
    companyWebsite: profile?.companyWebsite || "",
    companySize: profile?.companySize || "",
    industry: profile?.industry || "",
    location: profile?.location || "",
    description: profile?.description || "",
    contactEmail: profile?.contactEmail || "",
    contactPhone: profile?.contactPhone || "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.companyName.trim()) e.companyName = "Company name is required.";
    if (form.contactEmail && !/^\S+@\S+\.\S+$/.test(form.contactEmail))
      e.contactEmail = "Please enter a valid email.";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    await onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {serverError && (
        <div className="flex items-center gap-2.5 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm">
          <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {serverError}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <FormField label="Company Name" id="companyName" error={errors.companyName} required>
          <input id="companyName" name="companyName" type="text" placeholder="Acme Corp"
            value={form.companyName} onChange={handleChange}
            className={inputCls(errors.companyName)} disabled={loading} />
        </FormField>

        <FormField label="Website" id="companyWebsite">
          <input id="companyWebsite" name="companyWebsite" type="url"
            placeholder="https://company.com"
            value={form.companyWebsite} onChange={handleChange}
            className={inputCls()} disabled={loading} />
        </FormField>

        <FormField label="Industry" id="industry">
          <input id="industry" name="industry" type="text"
            placeholder="e.g. Software, Finance, Healthcare"
            value={form.industry} onChange={handleChange}
            className={inputCls()} disabled={loading} />
        </FormField>

        <FormField label="Company Size" id="companySize">
          <select id="companySize" name="companySize"
            value={form.companySize} onChange={handleChange}
            className={`${inputCls()} appearance-none cursor-pointer`} disabled={loading}>
            <option value="">Select size...</option>
            <option value="1-10">1 – 10 employees</option>
            <option value="11-50">11 – 50 employees</option>
            <option value="51-200">51 – 200 employees</option>
            <option value="201-500">201 – 500 employees</option>
            <option value="501-1000">501 – 1,000 employees</option>
            <option value="1000+">1,000+ employees</option>
          </select>
        </FormField>

        <FormField label="Location" id="location">
          <input id="location" name="location" type="text" placeholder="City, Country"
            value={form.location} onChange={handleChange}
            className={inputCls()} disabled={loading} />
        </FormField>

        <FormField label="Contact Email" id="contactEmail" error={errors.contactEmail}>
          <input id="contactEmail" name="contactEmail" type="email"
            placeholder="hr@company.com"
            value={form.contactEmail} onChange={handleChange}
            className={inputCls(errors.contactEmail)} disabled={loading} />
        </FormField>

        <div className="sm:col-span-2">
          <FormField label="Contact Phone" id="contactPhone">
            <input id="contactPhone" name="contactPhone" type="tel"
              placeholder="+1 555 000 0000"
              value={form.contactPhone} onChange={handleChange}
              className={inputCls()} disabled={loading} />
          </FormField>
        </div>
      </div>

      <FormField label="Company Description" id="description">
        <textarea id="description" name="description" rows={5}
          placeholder="Tell job seekers about your company's mission, culture, and what you're building..."
          value={form.description} onChange={handleChange}
          className={textareaCls()} disabled={loading} />
      </FormField>

      <button type="submit" disabled={loading}
        className="w-full bg-amber-400 hover:bg-amber-300 text-slate-900 font-semibold
                   py-3 px-6 rounded-xl text-sm tracking-wide transition-all duration-200
                   active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed
                   focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:ring-offset-2 focus:ring-offset-slate-900">
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-slate-700 border-t-slate-900 rounded-full animate-spin" />
            Saving Changes...
          </span>
        ) : "Save Changes"}
      </button>
    </form>
  );
};

// ─────────────────────────────────────────────
// EDIT PROFILE PAGE
// Loads existing profile data first, then renders
// the appropriate pre-filled form for the user's role.
// ─────────────────────────────────────────────

const EditProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loadError, setLoadError] = useState("");

  const isJobSeeker = user?.role === "jobseeker";

  // Load existing profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = isJobSeeker
          ? await getJobSeekerProfile()
          : await getEmployerProfile();

        if (data.success) {
          setProfile(data.profile);
        } else {
          // No profile yet — redirect to create
          navigate("/create-profile");
        }
      } catch (err) {
        if (err.response?.status === 404) {
          navigate("/create-profile");
        } else {
          setLoadError("Failed to load profile. Please refresh.");
        }
      } finally {
        setPageLoading(false);
      }
    };
    fetchProfile();
  }, [isJobSeeker, navigate]);

  /**
   * Handles Job Seeker profile update:
   * 1. PUT updated profile data
   * 2. If a new resume file was selected, upload it separately
   */
  const handleJobSeekerUpdate = async (formData, resumeFile, setUploadProgress) => {
    setSubmitLoading(true);
    setServerError("");
    try {
      await updateJobSeekerProfile(formData);

      if (resumeFile) {
        await uploadResume(resumeFile, (progressEvent) => {
          const pct = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(pct);
        });
      }

      setSuccess(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
      setTimeout(() => navigate("/dashboard/profile"), 1800);
    } catch (err) {
      setServerError(
        err.response?.data?.message || "Failed to update profile. Please try again."
      );
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleEmployerUpdate = async (formData) => {
    setSubmitLoading(true);
    setServerError("");
    try {
      await updateEmployerProfile(formData);
      setSuccess(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
      setTimeout(() => navigate("/dashboard/profile"), 1800);
    } catch (err) {
      setServerError(
        err.response?.data?.message || "Failed to update profile. Please try again."
      );
    } finally {
      setSubmitLoading(false);
    }
  };

  // ── Loading state ──
  if (pageLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-slate-800 border-t-amber-400 rounded-full animate-spin" />
          <p className="text-slate-600 text-xs font-mono">Loading profile...</p>
        </div>
      </div>
    );
  }

  // ── Load error state ──
  if (loadError) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-red-400 text-sm mb-4">{loadError}</p>
          <button onClick={() => window.location.reload()}
            className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-sm hover:bg-slate-700 transition-colors">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-start justify-center px-4 py-12">
      <div className="w-full max-w-2xl animate-fade-in">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold mb-4
              ${isJobSeeker
                ? "bg-indigo-500/15 text-indigo-300 border border-indigo-500/30"
                : "bg-amber-400/15 text-amber-300 border border-amber-400/30"
              }`}>
              {isJobSeeker ? "💼 Job Seeker" : "🏢 Employer"}
            </div>
            <h1 className="font-display text-3xl font-bold text-white tracking-tight">
              Edit Profile
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Keep your information current to get the best results.
            </p>
          </div>
          <button
            onClick={() => navigate("/dashboard/profile")}
            className="shrink-0 mt-1 px-3 py-2 rounded-xl border border-slate-700
                       text-slate-400 hover:text-slate-200 text-sm transition-colors"
          >
            ← Back
          </button>
        </div>

        {/* Success banner */}
        {success && (
          <div className="flex items-center gap-2.5 bg-emerald-500/10 border border-emerald-500/30
                          text-emerald-400 px-4 py-3 rounded-xl text-sm mb-6 animate-fade-in">
            <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Profile updated successfully! Redirecting...
          </div>
        )}

        {/* Form card */}
        <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
          {/*
           * Role-based form rendering:
           * Both forms receive the existing `profile` object so they
           * can pre-populate all fields with the current saved values.
           */}
          {isJobSeeker ? (
            <EditJobSeekerForm
              profile={profile}
              onSubmit={handleJobSeekerUpdate}
              loading={submitLoading}
              serverError={serverError}
            />
          ) : (
            <EditEmployerForm
              profile={profile}
              onSubmit={handleEmployerUpdate}
              loading={submitLoading}
              serverError={serverError}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default EditProfile;