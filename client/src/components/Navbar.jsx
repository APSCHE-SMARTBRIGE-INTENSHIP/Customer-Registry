import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="navbar" style={{ padding: '0.8rem 2rem', background: '#f8f9fa', borderBottom: '1px solid #e9ecef', color: '#495057' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Link to="/" style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#007bff', marginRight: '2rem' }}>
          Care
        </Link>
        <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'center' }}>
          <Link to="/" style={{ color: location.pathname === '/' ? '#007bff' : '#6c757d', fontWeight: location.pathname === '/' ? '600' : '400' }}>
            Home
          </Link>
          
          {token && user ? (
            <>
              {user.role === 'admin' && (
                <>
                  <Link to="/admin-dashboard" style={{ color: location.pathname === '/admin-dashboard' ? '#007bff' : '#6c757d', fontWeight: location.pathname === '/admin-dashboard' ? '600' : '400' }}>
                    Complaints
                  </Link>
                  <Link to="/customers" style={{ color: location.pathname === '/customers' ? '#007bff' : '#6c757d', fontWeight: location.pathname === '/customers' ? '600' : '400' }}>
                    Customers
                  </Link>
                  <Link to="/agents" style={{ color: location.pathname === '/agents' ? '#007bff' : '#6c757d', fontWeight: location.pathname === '/agents' ? '600' : '400' }}>
                    Agents
                  </Link>
                </>
              )}

              {user.role === 'user' && (
                <>
                  <Link to="/my-complaints" style={{ color: '#6c757d' }}>
                    ChatWithAgent
                  </Link>
                  <Link to="/my-complaints" style={{ color: location.pathname === '/my-complaints' ? '#007bff' : '#6c757d', fontWeight: location.pathname === '/my-complaints' ? '600' : '400' }}>
                    MyComplaints
                  </Link>
                </>
              )}

              {user.role === 'agent' && (
                <>
                  <Link to="/agent-dashboard" style={{ color: location.pathname === '/agent-dashboard' ? '#007bff' : '#6c757d', fontWeight: location.pathname === '/agent-dashboard' ? '600' : '400' }}>
                    Complaints
                  </Link>
                </>
              )}
            </>
          ) : (
            <>
              <Link to="/login" style={{ color: location.pathname === '/login' ? '#007bff' : '#6c757d' }}>
                Login
              </Link>
              <Link to="/register" style={{ color: location.pathname === '/register' ? '#007bff' : '#6c757d' }}>
                Register
              </Link>
            </>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'center' }}>
        {token && user && (
          <>
            <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: '#6c757d', cursor: 'pointer', fontSize: '0.95rem' }}>
              Logout
            </button>
            <div style={{ position: 'relative' }}>
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)} 
                style={{ background: 'none', border: 'none', color: '#6c757d', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.95rem' }}
              >
                Dropdown <span style={{ fontSize: '0.75rem' }}>▼</span>
              </button>
                  {dropdownOpen && (
                    <div style={{ position: 'absolute', right: 0, top: '100%', background: '#fff', border: '1px solid #dee2e6', borderRadius: '4px', padding: '0.5rem 0', minWidth: '120px', zIndex: 1000, boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                  <Link to="/profile" onClick={() => setDropdownOpen(false)} style={{ display: 'block', padding: '0.4rem 1rem', color: '#212529', textDecoration: 'none', fontSize: '0.9rem' }}>
                    Profile
                  </Link>
                  <hr style={{ margin: '0.3rem 0', border: 'none', borderTop: '1px solid #e9ecef' }} />
                  <button onClick={() => { setDropdownOpen(false); handleLogout(); }} style={{ display: 'block', width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: '0.4rem 1rem', color: '#dc3545', cursor: 'pointer', fontSize: '0.9rem' }}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
