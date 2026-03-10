import { NavLink } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const StatCard = ({ icon, label, value, accent, delta }) => (
  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-colors duration-200">
    <div className="flex items-start justify-between">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${accent}`}>
        {icon}
      </div>
      {delta && (
        <span className="text-xs font-mono text-slate-600 bg-slate-800 px-2 py-0.5 rounded-full">
          {delta}
        </span>
      )}
    </div>
    <p className="text-2xl font-display font-bold text-white mt-3 tracking-tight">{value}</p>
    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-1">{label}</p>
  </div>
);

const QuickLink = ({ to, icon, label, description, badge }) => (
  <NavLink
    to={to}
    className="group bg-slate-900 border border-slate-800 rounded-2xl p-5
               hover:border-amber-400/30 hover:bg-slate-900/80 transition-all duration-200
               flex items-start gap-4"
  >
    <div className="w-10 h-10 rounded-xl bg-slate-800 group-hover:bg-amber-400/10
                    flex items-center justify-center text-lg shrink-0 transition-colors duration-200">
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">
          {label}
        </span>
        {badge && (
          <span className="text-[10px] font-mono font-semibold text-amber-400/60 border border-amber-400/20 px-1.5 py-0.5 rounded-full leading-none">
            {badge}
          </span>
        )}
      </div>
      <p className="text-xs text-slate-500 mt-1 leading-relaxed">{description}</p>
    </div>
    <svg className="w-4 h-4 text-slate-700 group-hover:text-amber-400/60 shrink-0 mt-0.5 transition-colors duration-200"
         fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  </NavLink>
);

const Dashboard = () => {
  const { user } = useAuth();
  const isEmployer = user?.role === "employer";
  const firstName = user?.fullName?.split(" ")[0] || "there";

  const joinDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        year: "numeric", month: "long", day: "numeric",
      })
    : "Recently";

  const employerLinks = [
    { to: "/dashboard/jobs",         icon: "📋", label: "Post a Job",          description: "Create listings and attract top talent.", badge: "Soon" },
    { to: "/dashboard/applications", icon: "👥", label: "Review Applications", description: "Manage incoming submissions.",              badge: "Soon" },
    { to: "/dashboard/profile",      icon: "🏢", label: "Company Profile",     description: "Build your employer brand." },
  ];
  const seekerLinks = [
    { to: "/dashboard/jobs",         icon: "🔍", label: "Browse Jobs",     description: "Explore thousands of open positions.", badge: "Soon" },
    { to: "/dashboard/applications", icon: "📄", label: "My Applications", description: "Track the status of jobs you've applied to.", badge: "Soon" },
    { to: "/dashboard/profile",      icon: "👤", label: "Edit Profile",    description: "Update your resume, skills, and preferences." },
  ];
  const quickLinks = isEmployer ? employerLinks : seekerLinks;

  return (
    <div className="px-4 sm:px-6 py-8 max-w-4xl mx-auto animate-fade-in">
      {/* Greeting */}
      <div className="mb-8">
        <p className="text-slate-500 text-sm mb-1">Good to see you,</p>
        <h2 className="font-display text-3xl font-bold text-white tracking-tight">
          {firstName}{" "}
          <span className={`text-2xl font-semibold ${isEmployer ? "text-amber-400" : "text-indigo-400"}`}>
            👋
          </span>
        </h2>
        <div className="flex flex-wrap items-center gap-2 mt-3">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wide
            ${isEmployer
              ? "bg-amber-400/15 text-amber-300 border border-amber-400/30"
              : "bg-indigo-500/15 text-indigo-300 border border-indigo-500/30"
            }`}>
            {isEmployer ? "🏢 Employer" : "💼 Job Seeker"}
          </span>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold
                           bg-slate-800 text-slate-400 border border-slate-700">
            {user?.email}
          </span>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        <StatCard icon="📅" label="Member Since" value={joinDate.split(",")[0]} accent="bg-slate-800" />
        <StatCard icon={isEmployer ? "📋" : "🎯"}
                  label={isEmployer ? "Active Postings" : "Applications"}
                  value="0"
                  accent="bg-amber-400/10"
                  delta="coming soon" />
        <StatCard icon="✅" label="Account Status" value="Active" accent="bg-emerald-500/10" />
      </div>

      {/* Quick access */}
      <div className="mb-6">
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-600 mb-3">
          Quick Access
        </h3>
        <div className="space-y-3">
          {quickLinks.map((link) => (
            <QuickLink key={link.to} {...link} />
          ))}
        </div>
      </div>

      {/* System notice */}
      <div className="mt-8 rounded-2xl border border-dashed border-slate-800 p-5 flex gap-4 items-start">
        <div className="w-9 h-9 rounded-xl bg-amber-400/10 flex items-center justify-center shrink-0 mt-0.5">
          <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-300">Auth system is live ✨</p>
          <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
            JWT authentication, role-based access, and dashboard layout are all wired up.
            Jobs, applications, and search modules are scaffolded and ready for the next sprint.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
