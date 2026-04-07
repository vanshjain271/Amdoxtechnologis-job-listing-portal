import { NavLink, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useNotifications } from "../context/NotificationContext";

// --- Icons ---
const Icon = ({ d, d2 }) => (
  <svg className="w-[18px] h-[18px] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d={d} />
    {d2 && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d={d2} />}
  </svg>
);

const icons = {
  overview:     "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
  jobs:         "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
  applications: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4",
  profile:      "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
  editProfile:  "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
  settings:     "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z",
  logout:       "M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1",
  chat:         "M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z",
  admin:        "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
  chevron:      "M11 19l-7-7 7-7m8 14l-7-7 7-7",
  chevronRight: "M13 5l7 7-7 7M5 5l7 7-7 7",
  close:        "M6 18L18 6M6 6l12 12",
  notification: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
};

const getNavSections = (role) => [
  {
    label: "Main",
    items: [
      { to: "/dashboard", label: "Overview", icon: "overview", end: true },
    ],
  },
  {
    label: "Workspace",
    items: [
      { to: "/dashboard/jobs",         label: "Jobs",         icon: "jobs" },
      { to: "/dashboard/applications", label: "Applications", icon: "applications" },
      { to: "/dashboard/chat",         label: "Messages",     icon: "chat" },
    ],
  },
  {
    label: "Account",
    items: [
      { to: "/dashboard/profile",      label: "Profile",      icon: "profile" },
      { to: "/dashboard/edit-profile", label: "Edit Profile", icon: "editProfile" },
    ],
  },
  ...(role === "admin" ? [{
    label: "Admin",
    items: [
      { to: "/dashboard/admin",       label: "Admin Panel",   icon: "admin" },
    ],
  }] : []),
];

const SidebarLink = ({ to, label, icon, badge, collapsed, end, onClick }) => {
  const baseClass =
    "group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 select-none cursor-pointer";

  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      className={({ isActive }) =>
        isActive
          ? `${baseClass} bg-amber-400/12 text-amber-300 border border-amber-400/20`
          : `${baseClass} text-slate-400 hover:text-slate-200 hover:bg-slate-800/70`
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-amber-400 rounded-full" />
          )}

          <Icon d={icons[icon]} />

          {!collapsed && (
            <>
              <span className="flex-1 truncate">{label}</span>
              {badge > 0 && (
                <span className="bg-amber-400 text-slate-900 text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[1.4rem] text-center">
                  {badge}
                </span>
              )}
            </>
          )}

          {collapsed && badge > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-amber-400 rounded-full border border-slate-900" />
          )}

          {collapsed && (
            <span className="pointer-events-none absolute left-full ml-3 px-2.5 py-1.5 bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-50 shadow-xl">
              {label}
            </span>
          )}
        </>
      )}
    </NavLink>
  );
};

const Sidebar = ({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) => {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const closeMobile = () => setMobileOpen(false);
  const sections = getNavSections(user?.role);

  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-900">
      <div className={`flex items-center h-16 shrink-0 border-b border-slate-800/70 px-4 ${collapsed ? "justify-center" : "justify-between"}`}>
        {!collapsed && (
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-amber-400 rounded-lg flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icons.jobs} />
              </svg>
            </div>
            <span className="font-display text-lg font-bold text-white tracking-tight">
              Job<span className="text-amber-400">Vault</span>
            </span>
          </div>
        )}
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="hidden lg:flex w-7 h-7 items-center justify-center rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-all duration-150"
        >
          <Icon d={collapsed ? icons.chevronRight : icons.chevron} />
        </button>
        <button
          onClick={closeMobile}
          className="lg:hidden flex w-7 h-7 items-center justify-center rounded-lg text-slate-500 hover:text-slate-300"
        >
          <Icon d={icons.close} />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {sections.map((section) => (
          <div key={section.label}>
            {!collapsed && (
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-600 px-3 mb-1.5">
                {section.label}
              </p>
            )}
            {collapsed && (
              <div className="h-px bg-slate-800/70 mx-1 mb-2" />
            )}
            <ul className="space-y-0.5">
              {section.items.map((item) => (
                <li key={item.to}>
                  <SidebarLink 
                    {...item} 
                    collapsed={collapsed} 
                    onClick={closeMobile}
                    badge={item.icon === "chat" ? unreadCount : 0}
                  />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="shrink-0 border-t border-slate-800/70 p-3">
        {!collapsed ? (
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
              {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-200 truncate leading-none mb-0.5">
                {user?.fullName}
              </p>
              <span className={`text-[11px] font-semibold ${user?.role === "employer" ? "text-amber-400" : "text-indigo-400"}`}>
                {user?.role === "employer" ? "Employer" : "Job Seeker"}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-all duration-150"
              title="Logout"
            >
              <Icon d={icons.logout} />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
              {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <button
              onClick={handleLogout}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-all duration-150"
              title="Logout"
            >
              <Icon d={icons.logout} />
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      <aside
        className={`hidden lg:flex flex-col fixed left-0 top-0 h-screen bg-slate-900 border-r border-slate-800/70 z-30 transition-all duration-300 ease-in-out ${collapsed ? "w-[68px]" : "w-60"}`}
      >
        {sidebarContent}
      </aside>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40" onClick={closeMobile} />
      )}

      <aside
        className={`lg:hidden fixed left-0 top-0 h-screen w-72 z-50 bg-slate-900 border-r border-slate-800/70 transform transition-transform duration-300 ease-in-out ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {sidebarContent}
      </aside>
    </>
  );
};

export default Sidebar;