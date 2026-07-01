import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Shield, LogOut, User, FileText, PlusCircle, MessageSquare } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">
        <Shield size={24} />
        <span>CustomerCare</span>
      </Link>
      <div className="nav-links">
        <Link to="/" className={`nav-item ${isActive('/')}`}>Home</Link>
        
        {token && user ? (
          <>
            {user.role === 'customer' && (
              <>
                <Link to="/lodge-complaint" className={`nav-item ${isActive('/lodge-complaint')}`}>
                  <PlusCircle size={16} style={{ marginRight: '4px', verticalAlign: 'text-bottom' }} />
                  Lodge Complaint
                </Link>
                <Link to="/my-complaints" className={`nav-item ${isActive('/my-complaints')}`}>
                  <FileText size={16} style={{ marginRight: '4px', verticalAlign: 'text-bottom' }} />
                  My Complaints
                </Link>
              </>
            )}

            {user.role === 'agent' && (
              <Link to="/agent-dashboard" className={`nav-item ${isActive('/agent-dashboard')}`}>
                <MessageSquare size={16} style={{ marginRight: '4px', verticalAlign: 'text-bottom' }} />
                Agent Dashboard
              </Link>
            )}

            {user.role === 'admin' && (
              <Link to="/admin-dashboard" className={`nav-item ${isActive('/admin-dashboard')}`}>
                <Shield size={16} style={{ marginRight: '4px', verticalAlign: 'text-bottom' }} />
                Admin Dashboard
              </Link>
            )}

            <Link to="/profile" className={`nav-item ${isActive('/profile')}`}>
              <User size={16} style={{ marginRight: '4px', verticalAlign: 'text-bottom' }} />
              Profile
            </Link>

            <button onClick={handleLogout} className="nav-item" style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
              <LogOut size={16} style={{ marginRight: '4px' }} />
              Logout
            </button>

            <span className="badge badge-closed" style={{ border: '1px solid rgba(255,255,255,0.15)', textTransform: 'capitalize' }}>
              {user.name} ({user.role})
            </span>
          </>
        ) : (
          <>
            <Link to="/login" className={`nav-item ${isActive('/login')}`}>Login</Link>
            <Link to="/register" className={`nav-item ${isActive('/register')}`}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
