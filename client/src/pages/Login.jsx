import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
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
      <div style={{ background: '#fff', border: '1px solid #dee2e6', borderRadius: '8px', padding: '2.5rem', width: '100%', maxWidth: '400px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
        <h2 style={{ textAlign: 'center', fontSize: '1.8rem', color: '#212529', marginBottom: '2rem', fontWeight: 'bold' }}>Login</h2>
        
        {error && (
          <div style={{ background: '#f8d7da', border: '1px solid #f5c6cb', padding: '0.8rem', borderRadius: '4px', color: '#721c24', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.9rem', fontWeight: '500', color: '#495057' }}>Email</label>
            <input
              type="email"
              placeholder="Enter email"
              style={{ padding: '0.6rem 0.8rem', border: '1px solid #ced4da', borderRadius: '4px', fontSize: '1rem', outline: 'none' }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.9rem', fontWeight: '500', color: '#495057' }}>Password</label>
            <input
              type="password"
              placeholder="Enter password"
              style={{ padding: '0.6rem 0.8rem', border: '1px solid #ced4da', borderRadius: '4px', fontSize: '1rem', outline: 'none' }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" style={{ width: '100%', background: '#007bff', color: '#fff', border: 'none', padding: '0.75rem', borderRadius: '4px', fontSize: '1rem', fontWeight: '600', cursor: 'pointer' }} disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <p style={{ textAlign: 'center', marginTop: '1.2rem', fontSize: '0.9rem', color: '#6c757d' }}>
          Don't have an account? <Link to="/register" style={{ color: '#007bff', textDecoration: 'none' }}>Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
