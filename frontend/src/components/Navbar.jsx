import { Link, useNavigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const BriefcaseIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 bg-amber-400 rounded-lg flex items-center justify-center
                          group-hover:bg-amber-300 transition-colors duration-200">
            <BriefcaseIcon />
          </div>
          <span className="font-display text-xl font-bold text-white tracking-tight">
            Job<span className="text-amber-400">Vault</span>
          </span>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              {/* User info chip */}
              <div className="hidden sm:flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600
                                flex items-center justify-center text-white text-xs font-semibold">
                  {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-slate-200 leading-none">
                    {user?.fullName?.split(" ")[0]}
                  </span>
                  <span className={`text-xs mt-0.5 font-semibold ${
                    user?.role === "employer" ? "text-amber-400" : "text-indigo-400"
                  }`}>
                    {user?.role === "employer" ? "Employer" : "Job Seeker"}
                  </span>
                </div>
              </div>

              <Link
                to="/dashboard"
                className={`text-sm font-medium px-3 py-1.5 rounded-lg transition-colors duration-200 ${
                  isActive("/dashboard")
                    ? "text-amber-400 bg-amber-400/10"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Dashboard
              </Link>

              <button
                onClick={handleLogout}
                className="text-sm font-medium px-4 py-2 rounded-xl border border-slate-700
                           text-slate-400 hover:text-red-400 hover:border-red-500/40
                           transition-all duration-200"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className={`text-sm font-medium px-3 py-1.5 rounded-lg transition-colors duration-200 ${
                  isActive("/login")
                    ? "text-amber-400"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="text-sm font-semibold px-4 py-2 rounded-xl
                           bg-amber-400 hover:bg-amber-300 text-slate-900
                           transition-all duration-200 active:scale-[0.98]"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
