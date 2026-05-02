import { Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import Cookies from 'js-cookie';
import { AuthContext, AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import Layout from './layouts/Layout';
import Login from './pages/Login';
import TwoFactorAuth from './pages/TwoFactorAuth';
import Dashboard from './pages/Dashboard';
import EmployeeManagement from './pages/EmployeeManagement';
import EmployeeDetail from './pages/EmployeeDetail';
import Attendance from './pages/Attendance';
import LeaveManagement from './pages/LeaveManagement';
import DepartmentManagement from './pages/DepartmentManagement';
import RoleManagement from './pages/RoleManagement';
import AdminManagement from './pages/AdminManagement';
import Account from './pages/Account';
import About from './pages/About';
import NetworkError from './pages/NetworkError';
import PageNotFound from './pages/PageNotFound';
import BackendWarmupGate from './components/BackendWarmupGate';

function ProtectedRoute({ children }) {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <BackendWarmupGate />;
  if (!user) return <Navigate to="/login" />;

  const requires2FA = Cookies.get('requires2FA');
  if (requires2FA) return <Navigate to="/2fa" />;

  return children;
}

function PublicRoute({ children }) {
  const { user } = useContext(AuthContext);
  const requires2FA = Cookies.get('requires2FA');

  if (requires2FA) return <Navigate to="/2fa" />;
  return !user ? children : <Navigate to="/dashboard" />;
}

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <Routes>
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/2fa" element={<TwoFactorAuth />} />
          <Route path="/network-error" element={<NetworkError />} />
          <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={<Navigate to="/dashboard" />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="employees" element={<EmployeeManagement />} />
            <Route path="employees/:id" element={<EmployeeDetail />} />
            <Route path="attendance" element={<Attendance />} />
            <Route path="leaves" element={<LeaveManagement />} />
            <Route path="departments" element={<DepartmentManagement />} />
            <Route path="roles" element={<RoleManagement />} />
            <Route path="admins" element={<AdminManagement />} />
            <Route path="account" element={<Account />} />
            <Route path="about" element={<About />} />
          </Route>
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
