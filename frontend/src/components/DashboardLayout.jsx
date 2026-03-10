import { useState } from "react";
import { Outlet, useLocation, NavLink } from "react-router-dom";
import Sidebar from "./Sidebar";
import useAuth from "../hooks/useAuth";

const HamburgerIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

// Breadcrumb map
const pageMeta = {
  "/dashboard":              { title: "Overview",     sub: "Your activity at a glance" },
  "/dashboard/jobs":         { title: "Jobs",         sub: "Browse open positions" },
  "/dashboard/applications": { title: "Applications", sub: "Track your submissions" },
  "/dashboard/profile":      { title: "Profile",      sub: "Manage your account" },
  "/dashboard/settings":     { title: "Settings",     sub: "Preferences & security" },
};

const DashboardLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();
  const location = useLocation();

  const meta = pageMeta[location.pathname] || { title: "Dashboard", sub: "" };

  return (
    <div className="min-h-screen flex bg-slate-950">
      {/* Sidebar */}
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main content — offset by sidebar width */}
      <div
        className={`flex-1 flex flex-col min-h-screen min-w-0
                    transition-all duration-300 ease-in-out
                    lg:${collapsed ? "ml-[68px]" : "ml-60"}`}
        style={{ marginLeft: undefined }} // handled by class below
      >
        {/* Inline margin trick for smooth transition */}
        <style>{`
          @media (min-width: 1024px) {
            .main-offset { margin-left: ${collapsed ? "68px" : "240px"}; transition: margin-left 300ms ease-in-out; }
          }
        `}</style>
        <div className="main-offset flex-1 flex flex-col min-h-screen">
          {/* Top bar */}
          <header className="sticky top-0 z-20 h-16 flex items-center justify-between
                             px-4 sm:px-6 border-b border-slate-800/60
                             bg-slate-950/80 backdrop-blur-md shrink-0">
            <div className="flex items-center gap-4">
              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl
                           text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                aria-label="Open navigation"
              >
                <HamburgerIcon />
              </button>

              {/* Page title */}
              <div>
                <h1 className="font-display text-lg font-bold text-white leading-none tracking-tight">
                  {meta.title}
                </h1>
                {meta.sub && (
                  <p className="text-xs text-slate-500 mt-0.5 hidden sm:block">{meta.sub}</p>
                )}
              </div>
            </div>

            {/* Top-bar right: user pill */}
            <div className="flex items-center gap-3">
              <NavLink
                to="/dashboard/profile"
                className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-xl
                           hover:bg-slate-800 transition-colors duration-150 group"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600
                                flex items-center justify-center text-white text-xs font-bold">
                  {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-xs font-semibold text-slate-300 group-hover:text-white leading-none">
                    {user?.fullName?.split(" ")[0]}
                  </span>
                  <span className={`text-[11px] font-semibold leading-none mt-0.5 ${
                    user?.role === "employer" ? "text-amber-400" : "text-indigo-400"
                  }`}>
                    {user?.role === "employer" ? "Employer" : "Job Seeker"}
                  </span>
                </div>
              </NavLink>
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
