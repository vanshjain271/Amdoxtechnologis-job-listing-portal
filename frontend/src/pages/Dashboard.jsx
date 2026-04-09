import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import axios from "axios";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from "recharts";
import { 
  TrendingUp, Users, Briefcase, CheckCircle, Clock, 
  ChevronRight, Sparkles, Zap, MessageSquare, ShieldCheck 
} from "lucide-react";

/**
 * Dashboard Component
 * Highlights:
 * 1. AI-Powered Job Recommendations (for Seekers)
 * 2. Visual Analytics (Charts for both roles)
 * 3. Real-time Status Overview
 */
const Dashboard = () => {
  const { user, token } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  const isEmployer = user?.role === "employer";
  const firstName = user?.fullName?.split(" ")[0] || "there";

  const fetchData = async () => {
    try {
      const rolePath = isEmployer ? "employer" : "seeker";
      const [analyticsRes, recoRes] = await Promise.all([
        axios.get(`http://localhost:5001/api/analytics/${rolePath}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        !isEmployer ? axios.get("http://localhost:5001/api/jobs/recommended", {
          headers: { Authorization: `Bearer ${token}` },
        }) : Promise.resolve({ data: { jobs: [] } })
      ]);

      setAnalytics(analyticsRes.data.data);
      if (!isEmployer) setRecommendations(recoRes.data.jobs);
    } catch (err) {
      console.error("Dashboard data fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token, isEmployer]);

  if (loading) return (
    <div className="p-8 text-center text-slate-400">
      <div className="animate-pulse flex flex-col items-center">
        <div className="h-8 w-48 bg-slate-800 rounded mb-4"></div>
        <div className="grid grid-cols-3 gap-4 w-full max-w-4xl">
          <div className="h-32 bg-slate-800 rounded-2xl"></div>
          <div className="h-32 bg-slate-800 rounded-2xl"></div>
          <div className="h-32 bg-slate-800 rounded-2xl"></div>
        </div>
      </div>
    </div>
  );

  const COLORS = ["#fbbf24", "#818cf8", "#34d399", "#f87171"];

  return (
    <div className="px-4 sm:px-6 py-8 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 rounded-md bg-amber-400/10 text-amber-400 text-[10px] font-bold uppercase tracking-widest">
              Dashboard Overview
            </span>
          </div>
          <h1 className="text-4xl font-bold text-white tracking-tight">
            Welcome back, <span className="text-amber-400">{firstName}</span>
          </h1>
          <p className="text-slate-400 mt-1 max-w-md">
            {isEmployer 
              ? "Your recruitment pipeline is looking healthy. Check your latest analytics below."
              : "We've found several jobs that match your skillset perfectly."}
          </p>
        </div>
        
        <div className="flex items-center gap-4 bg-slate-900/50 p-4 rounded-2xl border border-slate-800 backdrop-blur-xl">
          <div className="text-right">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Daily Activity</p>
            <p className="text-white font-bold">+24% Increase</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-400/10 flex items-center justify-center text-emerald-400">
            <TrendingUp size={20} />
          </div>
        </div>
      </div>

      {/* Primary Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {isEmployer ? (
          <>
            <StatCard icon={<Briefcase />} label="Total Postings" value={analytics?.totalJobs || 0} color="amber" />
            <StatCard icon={<Users />} label="Total Applicants" value={analytics?.totalApplications || 0} color="indigo" />
            <StatCard icon={<CheckCircle />} label="Hired" value={analytics?.applicationsByStatus?.find(s => s._id === 'hired')?.count || 0} color="emerald" />
            <StatCard icon={<Clock />} label="Pending Review" value={analytics?.applicationsByStatus?.find(s => s._id === 'pending')?.count || 0} color="purple" />
          </>
        ) : (
          <>
            <StatCard icon={<Briefcase />} label="Applied Jobs" value={analytics?.totalApplications || 0} color="amber" />
            <StatCard icon={<Zap />} label="Profile Strength" value="85%" color="indigo" />
            <StatCard icon={<CheckCircle />} label="Shortlisted" value={analytics?.applicationsByStatus?.find(s => s._id === 'shortlisted')?.count || 0} color="emerald" />
            <StatCard icon={<ShieldCheck />} label="Match Score" value="A+" color="purple" />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Charts Section */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <BarChart3 size={20} className="text-amber-400" />
              {isEmployer ? "Applications Distribution" : "Application Status History"}
            </h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics?.applicationsByStatus || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="_id" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: "12px" }}
                    itemStyle={{ color: "#fbbf24" }}
                  />
                  <Bar dataKey="count" fill="#fbbf24" radius={[6, 6, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* AI Recommendations (for Job Seekers) */}
          {!isEmployer && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Sparkles size={20} className="text-amber-400" />
                  AI Recommended for You
                </h3>
                <NavLink to="/dashboard/jobs" className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors">
                  View All Recommendations <ChevronRight size={14} />
                </NavLink>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recommendations.slice(0, 4).map((job) => (
                  <NavLink
                    key={job._id}
                    to={`/dashboard/jobs/${job._id}`}
                    className="bg-slate-900 border border-slate-800 p-4 rounded-2xl hover:border-amber-400/30 group transition-all"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="px-2 py-1 bg-amber-400/10 text-amber-400 text-[9px] font-bold rounded uppercase">
                        {job.matchScore}% Match
                      </div>
                      <span className="text-[10px] text-slate-500 font-medium tracking-tight">
                        {job.jobType}
                      </span>
                    </div>
                    <h4 className="font-bold text-white group-hover:text-amber-400 transition-colors truncate">{job.title}</h4>
                    <p className="text-xs text-slate-500 truncate mt-0.5">{job.employerId?.companyName || "Global Tech"}</p>
                    <div className="mt-3 flex items-center gap-2">
                      {job.skills.slice(0, 2).map((s, i) => (
                        <span key={i} className="text-[9px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full border border-slate-700">
                          {s}
                        </span>
                      ))}
                    </div>
                  </NavLink>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Actions */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-6 rounded-3xl text-white shadow-xl shadow-indigo-500/10 relative overflow-hidden group">
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-2">Build your profile</h3>
              <p className="text-indigo-100 text-sm mb-4 opacity-90 leading-relaxed">
                Connect your LinkedIn or upload your latest resume for 50% better visibility.
              </p>
              <NavLink 
                to="/dashboard/edit-profile" 
                className="bg-white text-indigo-700 px-5 py-2.5 rounded-xl font-bold text-sm inline-flex items-center gap-2 hover:bg-slate-50 transition-all active:scale-95"
              >
                Get Started <ChevronRight size={16} />
              </NavLink>
            </div>
            <Sparkles className="absolute -right-4 -bottom-4 text-white/10 w-32 h-32 rotate-12 group-hover:scale-110 transition-transform duration-500" />
          </div>

          <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl backdrop-blur-xl">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 mb-4">Quick Shortcuts</h4>
            <div className="space-y-3">
              <ShortcutLink to="/dashboard/chat" icon={<MessageSquare size={16} />} label="Unread Messages" badge={2} />
              <ShortcutLink to="/dashboard/applications" icon={<Clock size={16} />} label="App Status" />
              <ShortcutLink to="/dashboard/profile" icon={<Users size={16} />} label="My Network" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, color }) => {
  const colorMap = {
    amber: "bg-amber-400/5 text-amber-400 border-amber-400/10",
    indigo: "bg-indigo-400/5 text-indigo-400 border-indigo-400/10",
    emerald: "bg-emerald-400/5 text-emerald-400 border-emerald-400/10",
    purple: "bg-purple-400/5 text-purple-400 border-purple-400/10",
  };

  return (
    <div className={`bg-slate-900 border ${colorMap[color]} p-5 rounded-2xl transition-all hover:scale-[1.02] cursor-default`}>
      <div className="flex items-center gap-3 mb-2 opacity-80">
        <div className="p-2 rounded-lg bg-slate-900/80">{icon}</div>
        <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
      </div>
      <div className="text-2xl font-bold text-white tracking-tight">{value}</div>
    </div>
  );
};

const ShortcutLink = ({ to, icon, label, badge }) => (
  <NavLink to={to} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-800 group transition-all transition-colors border border-transparent hover:border-slate-700">
    <div className="flex items-center gap-3">
      <div className="text-slate-400 group-hover:text-amber-400 transition-colors">{icon}</div>
      <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">{label}</span>
    </div>
    {badge && <span className="bg-amber-400 text-slate-900 text-[10px] font-bold px-1.5 py-0.5 rounded-full">{badge}</span>}
  </NavLink>
);

const BarChart3 = ({ size, className }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/>
  </svg>
);

export default Dashboard;
