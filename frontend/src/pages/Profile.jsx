import useAuth from "../hooks/useAuth";

const FieldRow = ({ label, value, mono }) => (
  <div className="flex flex-col sm:flex-row sm:items-center py-4 border-b border-slate-800/60 last:border-0 gap-1 sm:gap-0">
    <span className="text-xs font-bold uppercase tracking-widest text-slate-600 sm:w-36 shrink-0">
      {label}
    </span>
    <span className={`text-sm text-slate-300 ${mono ? "font-mono" : "font-medium"}`}>
      {value}
    </span>
  </div>
);

const Profile = () => {
  const { user } = useAuth();
  const isEmployer = user?.role === "employer";

  const joinDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        weekday: "long", year: "numeric", month: "long", day: "numeric",
      })
    : "—";

  const lastLogin = user?.lastLogin
    ? new Date(user.lastLogin).toLocaleString("en-US", {
        year: "numeric", month: "short", day: "numeric",
        hour: "2-digit", minute: "2-digit",
      })
    : "—";

  return (
    <div className="px-4 sm:px-6 py-8 max-w-2xl mx-auto animate-fade-in">
      {/* Avatar + name header */}
      <div className="flex items-center gap-5 mb-8">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500
                        flex items-center justify-center text-white text-2xl font-bold shadow-xl">
          {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
        </div>
        <div>
          <h2 className="font-display text-2xl font-bold text-white tracking-tight">
            {user?.fullName}
          </h2>
          <div className="flex items-center gap-2 mt-1.5">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold
              ${isEmployer
                ? "bg-amber-400/15 text-amber-300 border border-amber-400/30"
                : "bg-indigo-500/15 text-indigo-300 border border-indigo-500/30"
              }`}>
              {isEmployer ? "Employer" : "Job Seeker"}
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold
                             bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Active
            </span>
          </div>
        </div>
      </div>

      {/* Account info card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl px-5 mb-5">
        <p className="text-xs font-bold uppercase tracking-widest text-slate-600 pt-4 pb-2">
          Account Information
        </p>
        <FieldRow label="Full Name"   value={user?.fullName || "—"} />
        <FieldRow label="Email"       value={user?.email || "—"} mono />
        <FieldRow label="Role"        value={isEmployer ? "Employer" : "Job Seeker"} />
        <FieldRow label="Member Since" value={joinDate} />
        <FieldRow label="Last Login"  value={lastLogin} mono />
        <FieldRow label="User ID"     value={user?.id || "—"} mono />
      </div>

      {/* Edit profile CTA */}
      <div className="bg-slate-900 border border-dashed border-slate-700 rounded-2xl p-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-300">Profile editing</p>
          <p className="text-xs text-slate-500 mt-0.5">
            Update name, password, avatar, and{" "}
            {isEmployer ? "company details" : "resume & skills"} — coming next sprint.
          </p>
        </div>
        <button
          disabled
          className="shrink-0 px-4 py-2 rounded-xl bg-slate-800 text-slate-500 text-sm font-semibold
                     border border-slate-700 cursor-not-allowed"
        >
          Edit Profile
        </button>
      </div>

      {/* Security card */}
      <div className="mt-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-300">Password & Security</p>
          <p className="text-xs text-slate-500 mt-0.5">
            Change password, enable 2FA, manage active sessions.
          </p>
        </div>
        <button
          disabled
          className="shrink-0 px-4 py-2 rounded-xl bg-slate-800 text-slate-500 text-sm font-semibold
                     border border-slate-700 cursor-not-allowed"
        >
          Manage
        </button>
      </div>
    </div>
  );
};

export default Profile;
