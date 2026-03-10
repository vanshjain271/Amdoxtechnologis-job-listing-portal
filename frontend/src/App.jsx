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

// Public layout wrapper (with top Navbar)
const PublicLayout = ({ children }) => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-1">{children}</main>
  </div>
);

// Protected layout wrapper
const ProtectedDashboard = ({ children }) => (
  <ProtectedRoute>{children}</ProtectedRoute>
);

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* --- Public routes (with Navbar) --- */}
          <Route
            path="/login"
            element={<PublicLayout><Login /></PublicLayout>}
          />
          <Route
            path="/register"
            element={<PublicLayout><Register /></PublicLayout>}
          />

          {/* --- Protected dashboard routes (with Sidebar layout) --- */}
          <Route
            path="/dashboard"
            element={
              <ProtectedDashboard>
                <DashboardLayout />
              </ProtectedDashboard>
            }
          >
            {/* Nested routes — rendered via <Outlet /> in DashboardLayout */}
            <Route index          element={<Dashboard />} />
            <Route path="jobs"         element={<Jobs />} />
            <Route path="applications" element={<Applications />} />
            <Route path="profile"      element={<Profile />} />
            {/* Settings placeholder — redirects to profile until built */}
            <Route path="settings"     element={<Navigate to="/dashboard/profile" replace />} />
          </Route>

          {/* --- Redirects --- */}
          <Route path="/"  element={<Navigate to="/dashboard" replace />} />
          <Route path="*"  element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
