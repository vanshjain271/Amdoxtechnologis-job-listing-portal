import { Zap, Sparkles, FileText, UploadCloud } from "lucide-react";

// ... existing components ...

const JobSeekerForm = ({ onSubmit, loading, serverError }) => {
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    location: "",
    skills: "",
    experience: "",
    education: "",
    linkedin: "",
    github: "",
    portfolio: "",
  });
  const [resumeFile, setResumeFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errors, setErrors] = useState({});
  const [onAutoFill, setOnAutoFill] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
  };

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

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = "Full name is required.";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    // Pass null as resumeFile since we already uploaded it above
    await onSubmit(form, null, setUploadProgress);
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {onAutoFill && (
        <div className="bg-amber-400/10 border border-amber-400/30 text-amber-400 px-4 py-3 rounded-xl text-sm flex items-center gap-3 animate-in slide-in-from-top-2 duration-300">
          <Sparkles size={16} className="animate-spin-slow" />
          <span className="font-medium font-display">AI is analyzing your resume to pre-fill your profile...</span>
        </div>
      )}

      {/* Smart Resume Upload First */}
      <div className="mb-6">
        <FormField label="Smart Resume Upload" id="resume">
          <div className={`${inputCls()} flex flex-col items-center justify-center gap-4 py-8 border-dashed border-2 hover:border-amber-400/50 group transition-all relative overflow-hidden bg-slate-900/40`}>
            <div className="w-16 h-16 rounded-3xl bg-amber-400/10 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform duration-500 shadow-xl shadow-amber-400/5">
              <UploadCloud size={32} />
            </div>
            <div className="text-center group-hover:translate-y-[-2px] transition-transform duration-500">
              <p className="text-sm font-bold text-slate-200">
                {resumeFile ? resumeFile.name : "Drop resume here or click to upload"}
              </p>
              <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-bold mt-1">Get profile data extracted with AI</p>
            </div>
            <input id="resume" type="file" accept=".pdf,.doc,.docx"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={handleResumeChange}
              disabled={loading} />
          </div>
          {uploadProgress > 0 && (
            <div className="mt-4 animate-in fade-in duration-500">
              <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-amber-400 transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }} />
              </div>
              <div className="flex justify-between items-center mt-2">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-2">
                  {uploadProgress === 100 ? (
                    <span className="text-emerald-400 flex items-center gap-1"><Zap size={10} /> AI Extraction Complete</span>
                  ) : "Uploading & Processing..."}
                </p>
                <p className="text-[10px] text-amber-400 font-bold">{uploadProgress}%</p>
              </div>
            </div>
          )}
        </FormField>
      </div>

      <div className="h-px bg-slate-800/50 w-full mb-6" />

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

        <FormField label="Skills" id="skills">
          <input id="skills" name="skills" type="text"
            placeholder="React, Node.js, MongoDB (comma separated)"
            value={form.skills} onChange={handleChange}
            className={inputCls()} disabled={loading} />
        </FormField>
      </div>

      <FormField label="Experience" id="experience">
        <textarea id="experience" name="experience" rows={4}
          placeholder="Describe your work experience, roles, and achievements..."
          value={form.experience} onChange={handleChange}
          className={textareaCls()} disabled={loading} />
      </FormField>

      <FormField label="Education" id="education">
        <textarea id="education" name="education" rows={3}
          placeholder="Degree, institution, year..."
          value={form.education} onChange={handleChange}
          className={textareaCls()} disabled={loading} />
      </FormField>

      {/* Resume Upload */}
      <FormField label="Resume" id="resume">
        <div className={`${inputCls()} flex items-center gap-3 cursor-pointer relative`}>
          <label htmlFor="resume" className="cursor-pointer flex items-center gap-3 w-full">
            <span className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs font-semibold text-slate-300 transition-colors shrink-0">
              Choose File
            </span>
            <span className="text-slate-500 text-xs truncate">
              {resumeFile ? resumeFile.name : "PDF, DOC, or DOCX — max 5 MB"}
            </span>
          </label>
          <input id="resume" type="file" accept=".pdf,.doc,.docx"
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={(e) => setResumeFile(e.target.files[0] || null)}
            disabled={loading} />
        </div>
        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className="mt-2">
            <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-400 transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-xs text-slate-500 mt-1">Uploading... {uploadProgress}%</p>
          </div>
        )}
      </FormField>

      {/* Social links */}
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
            Creating Profile...
          </span>
        ) : (
          "Create Profile"
        )}
      </button>
    </form>
  );
};

// ─────────────────────────────────────────────
// EMPLOYER FORM
// ─────────────────────────────────────────────

const EmployerForm = ({ onSubmit, loading, serverError }) => {
  const [form, setForm] = useState({
    companyName: "",
    companyWebsite: "",
    companySize: "",
    industry: "",
    location: "",
    description: "",
    contactEmail: "",
    contactPhone: "",
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
            Creating Profile...
          </span>
        ) : (
          "Create Company Profile"
        )}
      </button>
    </form>
  );
};

// ─────────────────────────────────────────────
// CREATE PROFILE PAGE
// Role-based: renders JobSeekerForm or EmployerForm
// based on the role stored in the authenticated user context.
// ─────────────────────────────────────────────

const CreateProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState(false);

  const isJobSeeker = user?.role === "jobseeker";

  /**
   * Handles Job Seeker profile creation:
   * 1. POST profile data first
   * 2. If a resume file is selected, upload it separately
   */
  const handleJobSeekerSubmit = async (formData, resumeFile, setUploadProgress) => {
    setLoading(true);
    setServerError("");
    try {
      await createJobSeekerProfile(formData);

      // Upload resume if provided
      if (resumeFile) {
        await uploadResume(resumeFile, (progressEvent) => {
          const pct = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(pct);
        });
      }

      setSuccess(true);
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err) {
      setServerError(
        err.response?.data?.message || "Failed to create profile. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEmployerSubmit = async (formData) => {
    setLoading(true);
    setServerError("");
    try {
      await createEmployerProfile(formData);
      setSuccess(true);
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err) {
      setServerError(
        err.response?.data?.message || "Failed to create profile. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-start justify-center px-4 py-12">
      <div className="w-full max-w-2xl animate-fade-in">
        {/* Header */}
        <div className="mb-8">
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold mb-4
            ${isJobSeeker
              ? "bg-indigo-500/15 text-indigo-300 border border-indigo-500/30"
              : "bg-amber-400/15 text-amber-300 border border-amber-400/30"
            }`}>
            {isJobSeeker ? "💼 Job Seeker" : "🏢 Employer"}
          </div>
          <h1 className="font-display text-3xl font-bold text-white tracking-tight">
            Complete your profile
          </h1>
          <p className="text-slate-500 text-sm mt-2">
            {isJobSeeker
              ? "Help employers find you. Fill in your skills and experience."
              : "Attract top talent. Tell candidates about your company."}
          </p>
        </div>

        {/* Success banner */}
        {success && (
          <div className="flex items-center gap-2.5 bg-emerald-500/10 border border-emerald-500/30
                          text-emerald-400 px-4 py-3 rounded-xl text-sm mb-6 animate-fade-in">
            <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Profile created! Redirecting to dashboard...
          </div>
        )}

        {/* Card */}
        <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
          {/*
           * Role-based form rendering:
           * The form fields and submit handler differ by role,
           * but both share the same card shell and styling system.
           */}
          {isJobSeeker ? (
            <JobSeekerForm
              onSubmit={handleJobSeekerSubmit}
              loading={loading}
              serverError={serverError}
            />
          ) : (
            <EmployerForm
              onSubmit={handleEmployerSubmit}
              loading={loading}
              serverError={serverError}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateProfile;