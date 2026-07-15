import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 70px)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '4rem', maxWidth: '1000px', width: '100%' }}>
        
        {/* Left side text */}
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#000', fontWeight: 'bold' }}>
            Welcome to Customer Care Registry
          </h2>
          <p style={{ fontSize: '1.1rem', color: '#555', marginBottom: '2rem', lineHeight: '1.6' }}>
            Click the "Raise Complaint" button to resolve your doubts or seek assistance from our support team.
          </p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link to="/customer/raise-complaint" className="btn" style={{ display: 'inline-block', textDecoration: 'none', background: '#0d6efd', padding: '0.8rem 2rem', width: 'auto', borderRadius: '4px' }}>
              Raise Complaint
            </Link>
            <Link to="/customer/complaints" className="btn" style={{ display: 'inline-block', textDecoration: 'none', background: '#f8f9fa', color: '#0d6efd', border: '1px solid #0d6efd', padding: '0.8rem 2rem', width: 'auto', borderRadius: '4px' }}>
              View My Complaints
            </Link>
          </div>
        </div>

        {/* Right side illustration */}
        <div style={{ flex: 1, textAlign: 'center' }}>
          <img src="/support_illustration.jpg" alt="Support Agent" style={{ maxWidth: '100%', height: 'auto', borderRadius: '12px' }} />
        </div>

      </div>
    </div>
  );
};

export default HomePage;
