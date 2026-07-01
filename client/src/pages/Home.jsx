import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Shield, Clock, Users, ArrowRight } from 'lucide-react';

const Home = () => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;

  return (
    <div className="main-content">
      <div className="hero-section">
        <h1 className="hero-title">Experience Seamless Support and Issue Resolution</h1>
        <p style={{ maxWidth: '640px', margin: '0 auto 2.5rem', fontSize: '1.1rem' }}>
          Welcome to the central Customer Care Registry. Lodge tickets, track statuses, and interact in real-time with our support agents.
        </p>
        
        <div>
          {token && user ? (
            user.role === 'customer' ? (
              <Link to="/lodge-complaint" className="btn btn-primary" style={{ width: 'auto', padding: '0.9rem 2rem' }}>
                Lodge a Complaint <ArrowRight size={18} />
              </Link>
            ) : user.role === 'agent' ? (
              <Link to="/agent-dashboard" className="btn btn-primary" style={{ width: 'auto', padding: '0.9rem 2rem' }}>
                Go to Agent Dashboard <ArrowRight size={18} />
              </Link>
            ) : (
              <Link to="/admin-dashboard" className="btn btn-primary" style={{ width: 'auto', padding: '0.9rem 2rem' }}>
                Go to Admin Dashboard <ArrowRight size={18} />
              </Link>
            )
          ) : (
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <Link to="/login" className="btn btn-primary" style={{ width: 'auto', padding: '0.9rem 2rem' }}>
                Get Started
              </Link>
              <Link to="/register" className="btn btn-secondary" style={{ width: 'auto', padding: '0.9rem 2rem' }}>
                Create Account
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem', color: '#8b5cf6' }}>
            <Clock size={32} />
          </div>
          <div className="stat-value">&lt; 2h</div>
          <div className="stat-label">Average Response Time</div>
        </div>
        <div className="stat-card">
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem', color: '#10b981' }}>
            <MessageSquare size={32} />
          </div>
          <div className="stat-value">99%</div>
          <div className="stat-label">Resolution Rate</div>
        </div>
        <div className="stat-card">
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem', color: '#0ea5e9' }}>
            <Users size={32} />
          </div>
          <div className="stat-value">15k+</div>
          <div className="stat-label">Customers Managed</div>
        </div>
        <div className="stat-card">
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem', color: '#f59e0b' }}>
            <Shield size={32} />
          </div>
          <div className="stat-value">100%</div>
          <div className="stat-label">Secure & Certified</div>
        </div>
      </div>

      <div className="glass-card" style={{ marginTop: '2rem' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>How it Works</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2.5rem' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ background: 'rgba(139, 92, 246, 0.1)', width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', color: '#8b5cf6', fontWeight: 'bold' }}>1</div>
            <h3>Lodge Complaint</h3>
            <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>Describe your issue or feedback in detail through our simplified forms.</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ background: 'rgba(14, 165, 233, 0.1)', width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', color: '#0ea5e9', fontWeight: 'bold' }}>2</div>
            <h3>Admin Triage</h3>
            <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>Our administrative team routes your concern to the best-suited support agent.</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ background: 'rgba(16, 185, 129, 0.1)', width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', color: '#10b981', fontWeight: 'bold' }}>3</div>
            <h3>Direct Chat & Resolve</h3>
            <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>Chat directly with your assigned agent until the issue is resolved to your satisfaction.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
