import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const MyComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchComplaints = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/complaints', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      if (response.ok) {
        setComplaints(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#ffc107';
      case 'in_progress': return '#17a2b8';
      case 'resolved': return '#28a745';
      case 'closed': return '#6c757d';
      default: return '#6c757d';
    }
  };

  return (
    <div style={{ background: '#fff', minHeight: 'calc(100vh - 60px)', padding: '3rem 2rem' }}>
      <h2 style={{ textAlign: 'center', fontSize: '2rem', color: '#212529', marginBottom: '3rem', fontWeight: 'bold' }}>
        My Complaints
      </h2>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>Loading complaints...</p>
        </div>
      ) : complaints.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p style={{ color: '#6c757d', marginBottom: '1.5rem' }}>No complaints found.</p>
          <button onClick={() => navigate('/lodge-complaint')} style={{ background: '#007bff', color: '#fff', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '4px', cursor: 'pointer', fontWeight: '600' }}>
            Lodge a Complaint
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem', maxWidth: '1100px', margin: '0 auto' }}>
          {complaints.map((c) => (
            <div 
              key={c._id} 
              style={{ 
                background: '#fff', 
                border: `2px solid ${getStatusColor(c.status)}`, 
                borderRadius: '8px', 
                padding: '1.5rem 2rem', 
                boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.6rem'
              }}
            >
              <div style={{ fontWeight: 'bold', fontSize: '1.05rem', color: '#212529', textAlign: 'center', marginBottom: '0.4rem' }}>
                ID: {c._id}
              </div>
              
              <div style={{ fontSize: '0.95rem', color: '#495057' }}>
                <strong>Complaint:</strong> {c.description}
              </div>
              
              <div style={{ fontSize: '0.95rem', color: '#495057' }}>
                <strong>Date:</strong> {new Date(c.createdAt).toLocaleDateString()}
              </div>
              
              <div style={{ fontSize: '0.95rem', color: '#495057' }}>
                <strong>Status:</strong>{' '}
                <span style={{ color: getStatusColor(c.status), fontWeight: 'bold' }}>
                  {c.status}
                </span>
              </div>

              <div style={{ borderTop: '1px solid #e9ecef', marginTop: '0.8rem', paddingTop: '0.8rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', color: '#6c757d' }}>
                  Agent: {c.agent?.firstName ? `${c.agent.firstName} ${c.agent.lastName}` : 'Unassigned'}
                </span>
                {c.agent && (
                  <button 
                    onClick={() => navigate(`/chat/${c._id}`)} 
                    style={{ background: '#007bff', color: '#fff', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600' }}
                  >
                    Chat
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyComplaints;
