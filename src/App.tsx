import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import DashboardLayout from './components/Layout/DashboardLayout';
import LoginForm from './components/Auth/LoginForm';
import RegisterForm from './components/Auth/RegisterForm';
import ForgotPasswordForm from './components/Auth/ForgotPasswordForm';
import ResetPasswordForm from './components/Auth/ResetPasswordForm';
import FarmerDashboard from './components/Dashboard/FarmerDashboard';
import OfficerDashboard from './components/Dashboard/OfficerDashboard';
import AdminDashboard from './components/Dashboard/AdminDashboard';
import AlertsPage from './components/Pages/AlertsPage';
import WeatherPage from './components/Pages/WeatherPage';
import ProfilePage from './components/Pages/ProfilePage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/forgot-password" element={<ForgotPasswordForm />} />
          <Route path="/reset-password" element={<ResetPasswordForm />} />
          
          {/* Protected routes */}
          <Route path="/dashboard" element={
            <PrivateRoute>
              <DashboardLayout>
                <DashboardRouter />
              </DashboardLayout>
            </PrivateRoute>
          } />
          
          {/* Additional protected routes */}
          <Route path="/alerts" element={
            <PrivateRoute>
              <DashboardLayout>
                <AlertsPage setToast={() => {}} />
              </DashboardLayout>
            </PrivateRoute>
          } />
          <Route path="/weather" element={<PrivateRoute><DashboardLayout><WeatherPage /></DashboardLayout></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><DashboardLayout><ProfilePage /></DashboardLayout></PrivateRoute>} />
          <Route path="/system-stats" element={<PrivateRoute><DashboardLayout><SystemStats /></DashboardLayout></PrivateRoute>} />

          {/* Oficer pages*/}
          <Route path="/region-stats" element={<PrivateRoute><DashboardLayout><RegionStatsPage /></DashboardLayout></PrivateRoute>} />
<Route path="/send-alerts" element={<PrivateRoute><DashboardLayout><SendAlertsPage /></DashboardLayout></PrivateRoute>} />
<Route path="/weather-data" element={<PrivateRoute><DashboardLayout><WeatherPage /></DashboardLayout></PrivateRoute>} />
<Route path="/farmers" element={<PrivateRoute><DashboardLayout><FarmersPage /></DashboardLayout></PrivateRoute>} />

          
          {/* Placeholder routes for other pages */}
          <Route path="/advisories" element={<PrivateRoute><DashboardLayout>
            <AdvisoriesPage/>
            </DashboardLayout></PrivateRoute>} />

            <Route path="/locations" element={<PrivateRoute><DashboardLayout>
            <AddLocationPage/>
            </DashboardLayout></PrivateRoute>} />

            <Route path="/system-health" element={<PrivateRoute><DashboardLayout>
            <SystemStats/>
            </DashboardLayout></PrivateRoute>} />

            <Route path="/users" element={<PrivateRoute><DashboardLayout>
            <Usermanagement/>
            </DashboardLayout></PrivateRoute>} />
          <Route path="*" element={<PrivateRoute><DashboardLayout><div className="p-6"><h1 className="text-2xl font-bold">Page Not Found</h1></div></DashboardLayout></PrivateRoute>} />
          
          {/* Redirect root to dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

// Component to handle dashboard routing based on user role
const DashboardRouter: React.FC = () => {
  return <RoleDashboard />;
};

const RoleDashboard: React.FC = () => {
  const { user } = useAuth();
  
  switch (user?.role) {
    case 'farmer':
      return <FarmerDashboard />;
    case 'officer':
      return <OfficerDashboard />;
    case 'admin':
      return <AdminDashboard />;
    default:
      return <FarmerDashboard />; // Default fallback
  }
};

// Import useAuth hook
import { useAuth } from './contexts/AuthContext';
import SystemStats from './components/Pages/SystemStats';
import RegionStatsPage from './components/Pages/officer/RegionStatsPage';
import SendAlertsPage from './components/Pages/officer/SendAlertsPage';
import FarmersPage from './components/Pages/officer/FarmersPage';
import AdvisoriesPage from './components/Pages/AdvisoryPage';
import Usermanagement from './components/Pages/admin/Usermanagement';
import AddLocationPage from './components/Pages/admin/AddLocationPage';

export default App;