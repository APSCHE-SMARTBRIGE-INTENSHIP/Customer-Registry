import React from 'react';
import { useNavigate } from 'react-router-dom';
import heroImage from '../assets/hero.png';

const Home = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;

  const handleAction = () => {
    if (token && user) {
      if (user.role === 'user') navigate('/lodge-complaint');
      else if (user.role === 'agent') navigate('/agent-dashboard');
      else navigate('/admin-dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <div style={{ background: '#fff', minHeight: 'calc(100vh - 60px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ maxWidth: '1100px', width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center' }}>
        <div style={{ textAlign: 'left' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#2c3e50', marginBottom: '1rem', background: 'none', WebkitTextFillColor: 'initial', WebkitBackgroundClip: 'initial' }}>
            Welcome to Customer Care Registry
          </h1>
          <p style={{ fontSize: '1.05rem', color: '#7f8c8d', marginBottom: '2rem', lineHeight: '1.6' }}>
            Click the "Raise Complaint" button to resolve your doubts or seek assistance from our support team.
          </p>
          <button onClick={handleAction} style={{ background: '#007bff', color: '#fff', border: 'none', padding: '0.8rem 1.8rem', borderRadius: '4px', fontSize: '1rem', fontWeight: '600', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,123,255,0.2)' }}>
            Raise Complaint
          </button>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <img src={heroImage} alt="Customer Support Representation" style={{ maxWidth: '100%', height: 'auto', maxHeight: '420px' }} />
        </div>
      </div>
    </div>
  );
};

export default Home;
