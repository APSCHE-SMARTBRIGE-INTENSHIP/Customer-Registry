import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({ firstName: '', lastName: '', username: '', email: '', password: '', role: 'Customer' });
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await register(formData.firstName, formData.lastName, formData.username, formData.email, formData.password, formData.role);
      if (user.role === 'Admin') navigate('/admin');
      else if (user.role === 'Agent') navigate('/agent');
      else navigate('/home');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="auth-container">
      <div className="glass-panel animate-fade-in" style={{ width: '450px', padding: '3rem 2rem', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '2rem', color: '#000', fontWeight: 'bold' }}>Sign Up</h2>
        {error && <p style={{ color: 'var(--danger-color)', marginBottom: '1rem' }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '0' }}>
            <div style={{ flex: 1, textAlign: 'left' }}>
              <div style={{ marginBottom: '0.5rem', color: '#555', fontSize: '0.9rem' }}>First Name</div>
              <input
                type="text"
                name="firstName"
                placeholder="Enter first name"
                className="input-field"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div style={{ flex: 1, textAlign: 'left' }}>
              <div style={{ marginBottom: '0.5rem', color: '#555', fontSize: '0.9rem' }}>Last Name</div>
              <input
                type="text"
                name="lastName"
                placeholder="Enter last name"
                className="input-field"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div style={{ textAlign: 'left', marginBottom: '0.5rem', color: '#555', fontSize: '0.9rem' }}>User Name</div>
          <input
            type="text"
            name="username"
            placeholder="Enter user name"
            className="input-field"
            value={formData.username}
            onChange={handleChange}
            required
          />

          <div style={{ textAlign: 'left', marginBottom: '0.5rem', color: '#555', fontSize: '0.9rem' }}>Email</div>
          <input
            type="email"
            name="email"
            placeholder="Enter email"
            className="input-field"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <div style={{ textAlign: 'left', marginBottom: '0.5rem', color: '#555', fontSize: '0.9rem' }}>Password</div>
          <input
            type="password"
            name="password"
            placeholder="Enter password"
            className="input-field"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <div style={{ textAlign: 'left', marginBottom: '0.5rem', color: '#555', fontSize: '0.9rem' }}>Type (admin, user, agent)</div>
          <select name="role" className="input-field" value={formData.role} onChange={handleChange}>
            <option value="Customer">user</option>
            <option value="Agent">agent</option>
            <option value="Admin">admin</option>
          </select>
          <button type="submit" className="btn" style={{ marginTop: '1rem', background: '#0d6efd', borderRadius: '4px' }}>Sign Up</button>
        </form>
        <p style={{ marginTop: '1.5rem', fontSize: '0.9rem', color: '#666' }}>
          Already have an account? <Link to="/login" style={{ color: '#0d6efd', textDecoration: 'none', fontWeight: 'bold' }}>Login in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
