import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await login(email, password);
      if (user.role === 'Admin') navigate('/admin');
      else if (user.role === 'Agent') navigate('/agent');
      else navigate('/home');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="auth-container">
      <div className="glass-panel animate-fade-in" style={{ width: '400px', padding: '3rem 2rem', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '2rem', color: '#000', fontWeight: 'bold' }}>Login</h2>
        {error && <p style={{ color: 'var(--danger-color)', marginBottom: '1rem' }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <div style={{ textAlign: 'left', marginBottom: '0.5rem', color: '#555', fontSize: '0.9rem' }}>Email</div>
          <input
            type="email"
            placeholder="Enter email"
            className="input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <div style={{ textAlign: 'left', marginBottom: '0.5rem', color: '#555', fontSize: '0.9rem' }}>Password</div>
          <input
            type="password"
            placeholder="Enter password"
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="btn" style={{ marginTop: '1rem', background: '#0d6efd', borderRadius: '4px' }}>Login</button>
        </form>
        <p style={{ marginTop: '1.5rem', fontSize: '0.9rem', color: '#666' }}>
          Don't have an account? <Link to="/register" style={{ color: '#0d6efd', textDecoration: 'none', fontWeight: 'bold' }}>Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
