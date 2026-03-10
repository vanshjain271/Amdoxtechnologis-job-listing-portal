import useAuth from "../hooks/useAuth";

const Applications = () => {
  const { user } = useAuth();
  const isEmployer = user?.role === "employer";

  const employerFeatures = [
    "View all applications across your job listings",
    "Filter by status: new, reviewing, shortlisted, rejected",
    "Download or preview attached resumes",
    "Send interview invitations directly from the dashboard",
    "Export applicant data as CSV for ATS integration",
  ];

  const seekerFeatures = [
    "See all jobs you've applied to in one place",
    "Track real-time status updates from employers",
    "Withdraw applications before they are reviewed",
    "Receive email notifications on status changes",
    "View feedback if the employer leaves a note",
  ];

  return (
    <div className="px-4 sm:px-6 py-12 max-w-3xl mx-auto animate-fade-in">
      <div className="text-center mb-12">
        <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20
                        flex items-center justify-center text-3xl mx-auto mb-5">
          📄
        </div>
        <h2 className="font-display text-3xl font-bold text-white tracking-tight mb-3">
          {isEmployer ? "Manage Applications" : "My Applications"}
        </h2>
        <p className="text-slate-400 text-sm leading-relaxed max-w-md mx-auto">
          {isEmployer
            ? "Review and manage all applications submitted to your job listings in one streamlined view."
            : "Track every job you've applied to. Stay on top of your application pipeline and next steps."}
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <p className="text-xs font-bold uppercase tracking-widest text-slate-600 mb-4">
          Planned Features
        </p>
        <ul className="space-y-3">
          {(isEmployer ? employerFeatures : seekerFeatures).map((f, i) => (
            <li key={i} className="flex items-center gap-3 text-sm text-slate-400">
              <span className="w-5 h-5 rounded-md bg-slate-800 border border-slate-700
                               flex items-center justify-center text-indigo-400/60 text-xs shrink-0">
                {i + 1}
              </span>
              {f}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 flex justify-center">
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full
                         bg-slate-900 border border-slate-800 text-slate-500 text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-indigo-400/60 animate-pulse-slow" />
          Module scaffolded — implementation coming next sprint
        </span>
      </div>
    </div>
  );
};

export default Applications;
