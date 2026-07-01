import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [roleInput, setRoleInput] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const normalizedRole = roleInput.trim().toLowerCase();
    if (!['admin', 'user', 'agent'].includes(normalizedRole)) {
      setError("Role must be exactly 'admin', 'user', or 'agent'");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          lastName,
          username,
          email,
          password,
          role: normalizedRole
        })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      if (data.user.role === 'admin') navigate('/admin-dashboard');
      else if (data.user.role === 'agent') navigate('/agent-dashboard');
      else navigate('/my-complaints');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: '#f8f9fa', minHeight: 'calc(100vh - 60px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ background: '#fff', border: '1px solid #dee2e6', borderRadius: '8px', padding: '2.5rem', width: '100%', maxWidth: '420px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
        <h2 style={{ textAlign: 'center', fontSize: '1.8rem', color: '#212529', marginBottom: '2rem', fontWeight: 'bold' }}>Sign Up</h2>
        
        {error && (
          <div style={{ background: '#f8d7da', border: '1px solid #f5c6cb', padding: '0.8rem', borderRadius: '4px', color: '#721c24', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            <label style={{ fontSize: '0.9rem', fontWeight: '500', color: '#495057' }}>First Name</label>
            <input
              type="text"
              placeholder="Enter first name"
              style={{ padding: '0.55rem 0.75rem', border: '1px solid #ced4da', borderRadius: '4px', fontSize: '0.95rem', outline: 'none' }}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div style={{ marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            <label style={{ fontSize: '0.9rem', fontWeight: '500', color: '#495057' }}>Last Name</label>
            <input
              type="text"
              placeholder="Enter last name"
              style={{ padding: '0.55rem 0.75rem', border: '1px solid #ced4da', borderRadius: '4px', fontSize: '0.95rem', outline: 'none' }}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
          <div style={{ marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            <label style={{ fontSize: '0.9rem', fontWeight: '500', color: '#495057' }}>User Name</label>
            <input
              type="text"
              placeholder="Enter user name"
              style={{ padding: '0.55rem 0.75rem', border: '1px solid #ced4da', borderRadius: '4px', fontSize: '0.95rem', outline: 'none' }}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div style={{ marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            <label style={{ fontSize: '0.9rem', fontWeight: '500', color: '#495057' }}>Email</label>
            <input
              type="email"
              placeholder="Enter email"
              style={{ padding: '0.55rem 0.75rem', border: '1px solid #ced4da', borderRadius: '4px', fontSize: '0.95rem', outline: 'none' }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div style={{ marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            <label style={{ fontSize: '0.9rem', fontWeight: '500', color: '#495057' }}>Password</label>
            <input
              type="password"
              placeholder="Enter password"
              style={{ padding: '0.55rem 0.75rem', border: '1px solid #ced4da', borderRadius: '4px', fontSize: '0.95rem', outline: 'none' }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            <label style={{ fontSize: '0.9rem', fontWeight: '500', color: '#495057' }}>Type (admin, user, agent)</label>
            <input
              type="text"
              placeholder="Enter type (admin, user, agent)"
              style={{ padding: '0.55rem 0.75rem', border: '1px solid #ced4da', borderRadius: '4px', fontSize: '0.95rem', outline: 'none' }}
              value={roleInput}
              onChange={(e) => setRoleInput(e.target.value)}
              required
            />
          </div>
          <button type="submit" style={{ width: '100%', background: '#007bff', color: '#fff', border: 'none', padding: '0.75rem', borderRadius: '4px', fontSize: '1rem', fontWeight: '600', cursor: 'pointer' }} disabled={loading}>
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>
        
        <p style={{ textAlign: 'center', marginTop: '1.2rem', fontSize: '0.9rem', color: '#6c757d' }}>
          Already have an account? <Link to="/login" style={{ color: '#007bff', textDecoration: 'none' }}>Log In</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
