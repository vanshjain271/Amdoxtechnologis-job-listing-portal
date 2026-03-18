import { useState, useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import {
  getJobSeekerProfile,
  getEmployerProfile,
} from "../services/profileService";

const FieldRow = ({ label, value, mono, link }) => {
  if (!value) return null;
  return (
    <div className="flex flex-col sm:flex-row sm:items-start py-4 border-b border-slate-800/60 last:border-0 gap-1 sm:gap-0">
      <span className="text-xs font-bold uppercase tracking-widest text-slate-600 sm:w-40 shrink-0 pt-0.5">
        {label}
      </span>
      {link ? (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-amber-400 hover:text-amber-300 underline underline-offset-4 break-all font-medium transition-colors"
        >
          {value}
        </a>
      ) : (
        <span
          className={`text-sm text-slate-300 leading-relaxed ${
            mono ? "font-mono break-all" : "font-medium"
          }`}
        >
          {value}
        </span>
      )}
    </div>
  );
};

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const isJobSeeker = user?.role === "jobseeker";

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = isJobSeeker
          ? await getJobSeekerProfile()
          : await getEmployerProfile();

        if (data.success) {
          setProfile(data.profile);
        }
      } catch (err) {
        if (err.response?.status === 404) {
          navigate("/create-profile");
        } else {
          setError("Failed to load profile.");
        }
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchProfile();
    }
  }, [isJobSeeker, navigate, user]);

  if (!user) return null;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-slate-800 border-t-amber-400 rounded-full animate-spin" />
          <p className="text-slate-600 text-xs font-mono">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 sm:px-6 py-12 text-center">
        <p className="text-red-400 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 py-8 max-w-2xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-8 flex-wrap">
        <div className="flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500
                          flex items-center justify-center text-white text-2xl font-bold shadow-lg"
          >
            {(isJobSeeker
              ? profile?.fullName
              : profile?.companyName)
              ?.charAt(0)
              ?.toUpperCase() || "?"}
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold text-white tracking-tight">
              {isJobSeeker
                ? profile?.fullName
                : profile?.companyName}
            </h2>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold
                ${
                  isJobSeeker
                    ? "bg-indigo-500/15 text-indigo-300 border border-indigo-500/30"
                    : "bg-amber-400/15 text-amber-300 border border-amber-400/30"
                }`}
              >
                {isJobSeeker ? "Job Seeker" : "Employer"}
              </span>
              {profile?.location && (
                <span className="text-xs text-slate-500">
                  📍 {profile.location}
                </span>
              )}
            </div>
          </div>
        </div>

        <NavLink
          to="/dashboard/edit-profile"
          className="shrink-0 px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-900
                     text-sm font-semibold rounded-xl transition-all duration-200 active:scale-[0.98]"
        >
          Edit Profile
        </NavLink>
      </div>

      {/* Profile data card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl px-5 mb-5">
        {isJobSeeker ? (
          <>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-600 pt-4 pb-1">
              Personal Info
            </p>

            <FieldRow label="Phone" value={profile?.phone} />
            <FieldRow label="Location" value={profile?.location} />
            <FieldRow label="Email" value={user?.email} mono />

            {profile?.skills?.length > 0 && (
              <div className="py-4 border-b border-slate-800/60">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-600 block mb-2.5">
                  Skills
                </span>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 bg-indigo-500/10 border border-indigo-500/20
                                 text-indigo-300 text-xs font-semibold rounded-lg"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {profile?.experience && (
              <div className="py-4 border-b border-slate-800/60">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-600 block mb-2">
                  Experience
                </span>
                <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                  {profile.experience}
                </p>
              </div>
            )}

            {profile?.education && (
              <div className="py-4 border-b border-slate-800/60">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-600 block mb-2">
                  Education
                </span>
                <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                  {profile.education}
                </p>
              </div>
            )}

            {profile?.resumeURL && (
              <div className="py-4 border-b border-slate-800/60">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-600 block mb-2">
                  Resume
                </span>

                <a
                  href={`http://localhost:5001${profile.resumeURL}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-2 bg-slate-800
                             hover:bg-slate-700 text-slate-300 text-xs font-semibold
                             rounded-lg border border-slate-700 transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Download Resume
                </a>
              </div>
            )}

            <FieldRow label="LinkedIn" value={profile?.linkedin} link />
            <FieldRow label="GitHub" value={profile?.github} link />
            <FieldRow label="Portfolio" value={profile?.portfolio} link />
          </>
        ) : (
          <>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-600 pt-4 pb-1">
              Company Info
            </p>

            <FieldRow label="Website" value={profile?.companyWebsite} link />
            <FieldRow label="Industry" value={profile?.industry} />
            <FieldRow label="Company Size" value={profile?.companySize} />
            <FieldRow label="Location" value={profile?.location} />
            <FieldRow label="Contact" value={profile?.contactEmail} mono />
            <FieldRow label="Phone" value={profile?.contactPhone} />

            {profile?.description && (
              <div className="py-4">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-600 block mb-2">
                  About
                </span>
                <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                  {profile.description}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;