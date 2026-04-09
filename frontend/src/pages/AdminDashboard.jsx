import React, { useState, useEffect } from "react";
import axios from "axios";
import useAuth from "../hooks/useAuth";
import { Users, Briefcase, Trash2, ShieldCheck, ShieldAlert, BarChart3, Search, MoreVertical } from "lucide-react";

/**
 * AdminDashboard: Centralized management for users and jobs.
 * Accessible only by users with 'admin' role.
 */
const AdminDashboard = () => {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("users");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchData = async () => {
    try {
      const [usersRes, jobsRes] = await Promise.all([
        axios.get("http://localhost:5001/api/admin/users", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://localhost:5001/api/admin/jobs", {
          headers: { Authorization: `Bearer ${token}` },
        })
      ]);
      setUsers(usersRes.data.users);
      setJobs(jobsRes.data.jobs);
    } catch (err) {
      console.error("Error fetching admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user? This action is permanent.")) return;
    try {
      await axios.delete(`http://localhost:5001/api/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter((u) => u._id !== userId));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete user");
    }
  };

  const handleToggleJob = async (jobId, currentStatus) => {
    const newStatus = currentStatus === "active" ? "closed" : "active";
    try {
      await axios.patch(
        `http://localhost:5001/api/admin/jobs/${jobId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setJobs(jobs.map((j) => (j._id === jobId ? { ...j, status: newStatus } : j)));
    } catch (err) {
      alert("Failed to update job status");
    }
  };

  const filteredUsers = users.filter((u) =>
    u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredJobs = jobs.filter((j) =>
    j.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    j.employerId?.companyName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="p-8 text-center text-slate-400">Loading admin dashboard...</div>;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header & Stats Overview */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Admin Control Panel</h1>
          <p className="text-slate-400 text-sm">System oversight and user moderation</p>
        </div>
        <div className="flex items-center gap-3 bg-slate-800/50 p-1.5 rounded-xl border border-slate-700">
          <button 
            onClick={() => setActiveTab("users")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === "users" ? "bg-amber-400 text-slate-900" : "text-slate-400 hover:text-white"}`}
          >
            Users ({users.length})
          </button>
          <button 
            onClick={() => setActiveTab("jobs")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === "jobs" ? "bg-amber-400 text-slate-900" : "text-slate-400 hover:text-white"}`}
          >
            Jobs ({jobs.length})
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard icon={<Users size={20} />} label="Total Users" value={users.length} color="amber" />
        <StatCard icon={<Briefcase size={20} />} label="Active Jobs" value={jobs.filter(j => j.status === 'active').length} color="indigo" />
        <StatCard icon={<BarChart3 size={20} />} label="Employes" value={users.filter(u => u.role === 'employer').length} color="emerald" />
        <StatCard icon={<ShieldCheck size={20} />} label="Admins" value={users.filter(u => u.role === 'admin').length} color="purple" />
      </div>

      {/* Main Table View */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-800/20">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder={`Search ${activeTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-800/50 border border-slate-700 text-slate-200 pl-10 pr-4 py-2 rounded-xl text-sm focus:outline-none focus:border-amber-400 transition-all"
            />
          </div>
          <button className="text-slate-500 hover:text-white p-2">
            <MoreVertical size={18} />
          </button>
        </div>

        {activeTab === "users" ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-800/40 text-slate-400 uppercase text-[10px] tracking-wider font-bold">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Created</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredUsers.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-800/20 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 font-bold group-hover:bg-slate-700 transition-colors">
                          {u.fullName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-white leading-none mb-1">{u.fullName}</p>
                          <p className="text-xs text-slate-500">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider
                        ${u.role === 'admin' ? 'bg-purple-500/10 text-purple-400' : u.role === 'employer' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-blue-500/10 text-blue-400'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-xs">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-emerald-400 font-medium text-xs">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Active
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleDeleteUser(u._id)}
                        className="text-slate-500 hover:text-red-400 transition-colors p-2"
                        title="Delete User"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-800/40 text-slate-400 uppercase text-[10px] tracking-wider font-bold">
                <tr>
                  <th className="px-6 py-4">Job Title</th>
                  <th className="px-6 py-4">Employer</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredJobs.map((j) => (
                  <tr key={j._id} className="hover:bg-slate-800/20 transition-colors group">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-white leading-none mb-1">{j.title}</p>
                      <p className="text-xs text-slate-500 truncate max-w-[200px]">{j.location}</p>
                    </td>
                    <td className="px-6 py-4 text-slate-300">
                      {j.employerId?.companyName || "Unknown"}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider
                        ${j.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                        {j.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleToggleJob(j._id, j.status)}
                        className={`transition-colors p-2 ${j.status === 'active' ? 'text-slate-500 hover:text-red-400' : 'text-slate-500 hover:text-emerald-400'}`}
                        title={j.status === 'active' ? 'Deactivate Job' : 'Activate Job'}
                      >
                        {j.status === 'active' ? <ShieldAlert size={16} /> : <ShieldCheck size={16} />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, color }) => {
  const colorMap = {
    amber: "from-amber-400/20 to-amber-400/5 text-amber-400 border-amber-400/20",
    indigo: "from-indigo-400/20 to-indigo-400/5 text-indigo-400 border-indigo-400/20",
    emerald: "from-emerald-400/20 to-emerald-400/5 text-emerald-400 border-emerald-400/20",
    purple: "from-purple-400/20 to-purple-400/5 text-purple-400 border-purple-400/20",
  };

  return (
    <div className={`bg-gradient-to-br ${colorMap[color]} border p-5 rounded-2xl`}>
      <div className="flex items-center gap-3 mb-3">
        <div className={`p-2 rounded-lg bg-slate-900/50`}>{icon}</div>
        <span className="text-xs font-bold uppercase tracking-wider opacity-80">{label}</span>
      </div>
      <div className="text-2xl font-bold text-white">{value}</div>
    </div>
  );
};

export default AdminDashboard;
