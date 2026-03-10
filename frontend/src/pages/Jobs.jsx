import useAuth from "../hooks/useAuth";

const ComingSoonPage = ({ title, description, icon, features }) => (
  <div className="px-4 sm:px-6 py-12 max-w-3xl mx-auto animate-fade-in">
    {/* Hero */}
    <div className="text-center mb-12">
      <div className="w-16 h-16 rounded-2xl bg-amber-400/10 border border-amber-400/20
                      flex items-center justify-center text-3xl mx-auto mb-5">
        {icon}
      </div>
      <h2 className="font-display text-3xl font-bold text-white tracking-tight mb-3">
        {title}
      </h2>
      <p className="text-slate-400 text-sm leading-relaxed max-w-md mx-auto">
        {description}
      </p>
    </div>

    {/* Planned features */}
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      <p className="text-xs font-bold uppercase tracking-widest text-slate-600 mb-4">
        Planned Features
      </p>
      <ul className="space-y-3">
        {features.map((f, i) => (
          <li key={i} className="flex items-center gap-3 text-sm text-slate-400">
            <span className="w-5 h-5 rounded-md bg-slate-800 border border-slate-700
                             flex items-center justify-center text-amber-400/60 text-xs shrink-0">
              {i + 1}
            </span>
            {f}
          </li>
        ))}
      </ul>
    </div>

    {/* Status badge */}
    <div className="mt-6 flex justify-center">
      <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full
                       bg-slate-900 border border-slate-800 text-slate-500 text-xs font-mono">
        <span className="w-2 h-2 rounded-full bg-amber-400/60 animate-pulse-slow" />
        Module scaffolded — implementation coming next sprint
      </span>
    </div>
  </div>
);

const Jobs = () => {
  const { user } = useAuth();
  const isEmployer = user?.role === "employer";

  const employerFeatures = [
    "Create and publish job listings with rich text editor",
    "Set requirements: skills, location, salary range, job type",
    "Manage listing visibility (draft / active / closed)",
    "View applicant count per listing",
    "Promote listings to the top of search results",
  ];

  const seekerFeatures = [
    "Browse and search jobs by title, location, or skill",
    "Filter by salary, job type, and date posted",
    "Save jobs to a personal shortlist",
    "One-click apply with stored profile data",
    "Receive alerts for matching new postings",
  ];

  return (
    <ComingSoonPage
      icon="💼"
      title={isEmployer ? "Job Postings" : "Browse Jobs"}
      description={
        isEmployer
          ? "Create, manage, and promote your job listings to reach thousands of qualified candidates."
          : "Find your next opportunity. Search, filter, and apply to jobs that match your skills and goals."
      }
      features={isEmployer ? employerFeatures : seekerFeatures}
    />
  );
};

export default Jobs;
