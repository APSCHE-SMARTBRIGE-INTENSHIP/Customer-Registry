import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Complaints from './pages/Complaints';
import MyComplaints from './pages/MyComplaints';
import AdminDashboard from './pages/AdminDashboard';
import AgentDashboard from './pages/AgentDashboard';
import ChatRoom from './pages/ChatRoom';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/profile" element={
            <ProtectedRoute allowedRoles={['customer', 'agent', 'admin']}>
              <Profile />
            </ProtectedRoute>
          } />
          
          <Route path="/lodge-complaint" element={
            <ProtectedRoute allowedRoles={['customer']}>
              <Complaints />
            </ProtectedRoute>
          } />
          
          <Route path="/my-complaints" element={
            <ProtectedRoute allowedRoles={['customer']}>
              <MyComplaints />
            </ProtectedRoute>
          } />
          
          <Route path="/admin-dashboard" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/agent-dashboard" element={
            <ProtectedRoute allowedRoles={['agent']}>
              <AgentDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/chat/:complaintId" element={
            <ProtectedRoute allowedRoles={['customer', 'agent', 'admin']}>
              <ChatRoom />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
