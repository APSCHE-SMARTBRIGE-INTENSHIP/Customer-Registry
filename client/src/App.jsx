import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { useContext } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import HomePage from './pages/HomePage';
import RaiseComplaint from './pages/RaiseComplaint';
import MyComplaints from './pages/MyComplaints';
import AgentDashboard from './pages/AgentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AgentsList from './pages/AgentsList';
import CustomersList from './pages/CustomersList';
import Navbar from './components/Navbar';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" />;
  return children;
};

const DashboardRouter = () => {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/login" />;
  if (user.role === 'Admin') return <Navigate to="/admin" />;
  if (user.role === 'Agent') return <Navigate to="/agent" />;
  return <Navigate to="/home" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/" element={
            <ProtectedRoute>
              <Navbar />
              {/* If Agent/Admin, this logic will need tweaking. Let's let them all see HomePage for simplicity, or we route them in DashboardRouter */}
              <DashboardRouter />
            </ProtectedRoute>
          } />

          <Route path="/home" element={
            <ProtectedRoute allowedRoles={['Customer']}>
              <Navbar />
              <HomePage />
            </ProtectedRoute>
          } />

          <Route path="/customer/raise-complaint" element={
            <ProtectedRoute allowedRoles={['Customer']}>
              <Navbar />
              <RaiseComplaint />
            </ProtectedRoute>
          } />

          <Route path="/customer/complaints" element={
            <ProtectedRoute allowedRoles={['Customer']}>
              <Navbar />
              <MyComplaints />
            </ProtectedRoute>
          } />

          <Route path="/agent" element={
            <ProtectedRoute allowedRoles={['Agent']}>
              <Navbar />
              <AgentDashboard />
            </ProtectedRoute>
          } />

          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <Navbar />
              <AdminDashboard />
            </ProtectedRoute>
          } />

          <Route path="/admin/agents" element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <Navbar />
              <AgentsList />
            </ProtectedRoute>
          } />

          <Route path="/admin/customers" element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <Navbar />
              <CustomersList />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
