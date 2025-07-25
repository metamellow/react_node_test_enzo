/**
 * Main Application Component
 * 
 * Serves as the root component for the TaskFlow application, handling routing,
 * authentication protection, and layout structure. Implements a comprehensive
 * routing system with protected routes and role-based access control.
 * 
 * @author Senior Full-Stack Engineer
 * @version 1.0.0
 */

import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";

// Layout Components
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";

// Public Pages
import Landing from "./pages/Landing";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import ForgotPassword from "./components/auth/ForgotPassword";
import ResetPassword from "./components/auth/ResetPassword";

// Admin Pages
import Dashboard from "./pages/AdminPages/Dashboard";
import Users from "./pages/AdminPages/Users";
import ManageUsers from "./pages/AdminPages/ManageUsers";
import ManageTasks from "./pages/AdminPages/ManageTasks";
import Settings from "./pages/AdminPages/Settings";
import UserLogPage from "./pages/AdminPages/UserLogPage";

// User Pages
import UserDashboard from "./pages/UserPages/Dashboard";
import UserPage from "./pages/UserPages/UserPage";
import NotificationsPage from "./pages/UserPages/NotificationsPage";
import CalendarPage from "./pages/UserPages/CalendarPage";
import ProfilePage from "./pages/UserPages/ProfilePage";

// Feature Components
import TaskFilter from "./components/tasks/TaskFilter";

// Context Providers
import AuthProvider from "./contexts/AuthContext";
import NotificationProvider from "./contexts/NotificationContext";

/**
 * Simple Dashboard Panel for Logged-Out Users
 * 
 * Shows a basic dashboard panel when users are not authenticated.
 * This implements the requirement: "When they're logged out, only Dashboard panel should to be displayed."
 */
const SimpleDashboardPanel = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-gray-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-2xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Welcome to TaskFlow
          </h1>
          <p className="text-lg text-gray-600">
            Please login to access the full dashboard and task management features.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <h3 className="text-xl font-semibold text-blue-800 mb-3">Team Member</h3>
            <p className="text-blue-600 mb-4">
              Create tasks, track progress, and collaborate with your team.
            </p>
            <button
              onClick={() => window.location.href = '/login?role=user'}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
            >
              Login as User
            </button>
          </div>
          
          <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
            <h3 className="text-xl font-semibold text-purple-800 mb-3">Administrator</h3>
            <p className="text-purple-600 mb-4">
              Manage users, verify tasks, and oversee team operations.
            </p>
            <button
              onClick={() => window.location.href = '/login?role=admin'}
              className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition"
            >
              Login as Admin
            </button>
          </div>
        </div>
        
        <div className="text-center">
          <p className="text-gray-500 mb-4">Don't have an account?</p>
          <div className="space-x-4">
            <button
              onClick={() => window.location.href = '/signup?role=user'}
              className="bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700 transition"
            >
              Sign Up as User
            </button>
            <button
              onClick={() => window.location.href = '/signup?role=admin'}
              className="bg-indigo-600 text-white py-2 px-6 rounded-lg hover:bg-indigo-700 transition"
            >
              Sign Up as Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Protected Route Component
 * 
 * Higher-order component that protects routes requiring authentication.
 * Redirects unauthenticated users to the login page with return path.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render when authenticated
 * @param {string} [props.requiredRole] - Optional role required to access the route
 */
const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, hasRole } = useAuth();
  const location = useLocation();
  
  // Check if user is authenticated
  const isAuthenticated = !!user || !!localStorage.getItem("token");
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  
  // If role is required, check if user has the role
  if (requiredRole) {
    const hasRequiredRole = hasRole(requiredRole);
    
    if (!hasRequiredRole) {
      // Redirect to appropriate dashboard based on user's role
      const userRole = localStorage.getItem("userRole");
      const redirectPath = userRole === "admin" ? "/admin/dashboard" : "/user/dashboard";
      
      return <Navigate to={redirectPath} replace />;
    }
  }
  
  // User is authenticated and has required role (if specified)
  return children;
};

/**
 * Main App Component
 * 
 * Defines the application's routing structure and wraps the app with necessary providers.
 */
function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            
            <main className="flex-grow">
              <Routes>
                {/* Root Route - Shows simple dashboard panel for logged-out users */}
                <Route path="/" element={<SimpleDashboardPanel />} />
                
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                
                {/* Protected Routes - Full Landing Page (only accessible after login) */}
                <Route 
                  path="/landing" 
                  element={
                    <ProtectedRoute>
                      <Landing />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Protected Admin Routes */}
                <Route 
                  path="/admin/dashboard" 
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <Dashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/users" 
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <Users />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/manage-users" 
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <ManageUsers />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/manage-tasks" 
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <ManageTasks />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/settings" 
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <Settings />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/user-logs" 
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <UserLogPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/task-filter" 
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <TaskFilter />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Protected User Routes */}
                <Route 
                  path="/user/dashboard" 
                  element={
                    <ProtectedRoute>
                      <UserDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/user/userpage" 
                  element={
                    <ProtectedRoute>
                      <UserPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/user/notifications" 
                  element={
                    <ProtectedRoute>
                      <NotificationsPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/user/calendar" 
                  element={
                    <ProtectedRoute>
                      <CalendarPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/user/profile" 
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/user/task-filter" 
                  element={
                    <ProtectedRoute>
                      <TaskFilter />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Fallback Route - Redirect to root */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            
            <Footer />
          </div>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
