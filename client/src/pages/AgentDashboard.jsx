import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AgentDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();

  const fetchAssignedComplaints = async () => {
    setRefreshing(true);
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
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAssignedComplaints();
  }, []);

  const handleStatusChange = async (complaintId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:8000/api/complaints/${complaintId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (response.ok) {
        fetchAssignedComplaints();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ background: '#fff', minHeight: 'calc(100vh - 60px)', padding: '3rem 2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', maxWidth: '1000px', margin: '0 auto 2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2c3e50' }}>Agent Dashboard</h1>
          <p style={{ color: '#7f8c8d' }}>Manage complaints assigned to you. Message customers and resolve issues.</p>
        </div>
        <button onClick={fetchAssignedComplaints} style={{ background: '#6c757d', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }} disabled={refreshing}>
          Refresh
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p>Loading assigned complaints...</p>
        </div>
      ) : complaints.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#7f8c8d' }}>
          <p>No complaints have been assigned to you yet.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '1000px', margin: '0 auto' }}>
          {complaints.map((c) => (
            <div key={c._id} style={{ background: '#fff', border: '1px solid #dee2e6', borderRadius: '8px', padding: '2rem', boxShadow: '0 2px 4px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <span className={`badge badge-${c.status}`} style={{ textTransform: 'capitalize', marginRight: '0.8rem' }}>{c.status}</span>
                  <span style={{ fontSize: '0.85rem', color: '#6c757d' }}>ID: {c._id}</span>
                </div>
                <div style={{ fontSize: '0.85rem', color: '#6c757d' }}>
                  {new Date(c.createdAt).toLocaleDateString()}
                </div>
              </div>

              <div style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '6px', marginBottom: '1.5rem', border: '1px solid #e9ecef' }}>
                <div style={{ fontSize: '0.85rem', color: '#6c757d', marginBottom: '0.2rem' }}>
                  Customer Details:
                </div>
                <div style={{ fontSize: '1rem', fontWeight: 'bold', color: '#495057' }}>{c.name}</div>
                <div style={{ fontSize: '0.85rem', color: '#6c757d' }}>Email: {c.email} | Phone: {c.phone}</div>
              </div>

              <p style={{ fontSize: '0.95rem', color: '#212529', marginBottom: '1.5rem', whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                {c.description}
              </p>

              <div style={{ borderTop: '1px solid #e9ecef', paddingTop: '1.2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                  <label htmlFor={`status-${c._id}`} style={{ margin: 0, fontSize: '0.9rem', fontWeight: '500' }}>Update Status:</label>
                  {c.status === 'closed' ? (
                    <span className="badge badge-closed">Closed</span>
                  ) : (
                    <select
                      id={`status-${c._id}`}
                      className="form-control"
                      value={c.status}
                      onChange={(e) => handleStatusChange(c._id, e.target.value)}
                      style={{ padding: '0.3rem 0.5rem', fontSize: '0.9rem', background: '#fff', color: '#495057' }}
                    >
                      <option value="in_progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                    </select>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button onClick={() => navigate(`/chat/${c._id}`)} style={{ background: '#007bff', color: '#fff', border: 'none', padding: '0.5rem 1.2rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '600' }}>
                    Open Chat
                  </button>
                </div>
              </div>

              {c.status === 'closed' && c.feedback && (
                <div style={{ marginTop: '1.5rem', padding: '1.2rem', background: '#d4edda', border: '1px solid #c3e6cb', borderRadius: '6px', color: '#155724' }}>
                  <h4 style={{ marginBottom: '0.3rem', fontSize: '0.9rem' }}>Feedback Received</h4>
                  <div style={{ fontSize: '0.85rem' }}>Rating: {c.feedback.rating} / 5</div>
                  {c.feedback.comments && <p style={{ fontStyle: 'italic', fontSize: '0.9rem', marginTop: '0.3rem', marginBottom: 0 }}>"{c.feedback.comments}"</p>}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AgentDashboard;
