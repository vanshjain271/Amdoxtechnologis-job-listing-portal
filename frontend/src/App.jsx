import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./components/DashboardLayout";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Jobs from "./pages/Jobs";
import Applications from "./pages/Applications";
import Profile from "./pages/Profile";
import CreateProfile from "./pages/CreateProfile";
import EditProfile from "./pages/EditProfile";
import CreateJob from "./pages/CreateJob"; // ← Added
import EditJob from "./pages/EditJob";     // ← Added
import JobDetails from "./pages/JobDetails"; // ← Added

const PublicLayout = ({ children }) => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-1">{children}</main>
  </div>
);

const ProtectedDashboard = ({ children }) => (
  <ProtectedRoute>{children}</ProtectedRoute>
);

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/login"    element={<PublicLayout><Login /></PublicLayout>} />
          <Route path="/register" element={<PublicLayout><Register /></PublicLayout>} />

          {/* Standalone protected pages (no sidebar layout) */}
          <Route path="/create-profile"
            element={<ProtectedDashboard><CreateProfile /></ProtectedDashboard>} />

          {/* Dashboard with sidebar */}
          <Route path="/dashboard"
            element={<ProtectedDashboard><DashboardLayout /></ProtectedDashboard>}>
            <Route index              element={<Dashboard />} />
            <Route path="jobs"        element={<Jobs />} />
            <Route path="jobs/create" element={<CreateJob />} />
            <Route path="jobs/edit/:id" element={<EditJob />} />
            <Route path="jobs/:id"    element={<JobDetails />} />
            <Route path="applications" element={<Applications />} />
            <Route path="profile"     element={<Profile />} />
            <Route path="edit-profile" element={<EditProfile />} />
            <Route path="settings"    element={<Navigate to="/dashboard/profile" replace />} />
          </Route>

          <Route path="/"  element={<Navigate to="/dashboard" replace />} />
          <Route path="*"  element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;