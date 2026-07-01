import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, CheckSquare, Calendar, RefreshCw } from 'lucide-react';

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
    <div className="main-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1>Agent Dashboard</h1>
          <p>Manage tickets assigned to you. Communicate with customers and resolve issues.</p>
        </div>
        <button onClick={fetchAssignedComplaints} className="btn btn-secondary" style={{ width: 'auto', padding: '0.6rem' }} disabled={refreshing}>
          <RefreshCw size={18} />
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p>Loading assigned complaints...</p>
        </div>
      ) : complaints.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p>No complaints have been assigned to you yet.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {complaints.map((c) => (
            <div key={c._id} className="glass-card" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <span className="badge badge-closed" style={{ marginRight: '0.8rem', background: 'rgba(255,255,255,0.05)' }}>{c.category}</span>
                  <span className={`badge badge-${c.status}`}>{c.status.replace('_', ' ')}</span>
                  <h3 style={{ marginTop: '0.5rem', fontSize: '1.3rem' }}>{c.title}</h3>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  <Calendar size={14} />
                  {new Date(c.createdAt).toLocaleDateString()}
                </div>
              </div>

              <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                  Customer Details:
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: '600' }}>{c.customer?.name}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Email: {c.customer?.email} | Phone: {c.customer?.phone}</div>
              </div>

              <p style={{ fontSize: '0.95rem', color: 'var(--text-main)', marginBottom: '1.5rem', whiteSpace: 'pre-wrap' }}>
                {c.description}
              </p>

              <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '1.2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                  <label htmlFor={`status-${c._id}`} style={{ margin: 0 }}>Update Status:</label>
                  {c.status === 'closed' ? (
                    <span className="badge badge-closed">Closed</span>
                  ) : (
                    <select
                      id={`status-${c._id}`}
                      className="form-control"
                      value={c.status}
                      onChange={(e) => handleStatusChange(c._id, e.target.value)}
                      style={{ padding: '0.4rem 0.6rem', fontSize: '0.9rem', background: '#0b0f19' }}
                    >
                      <option value="in_progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                    </select>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button onClick={() => navigate(`/chat/${c._id}`)} className="btn btn-primary" style={{ width: 'auto', padding: '0.6rem 1.2rem' }}>
                    <MessageSquare size={16} />
                    Open Chat
                  </button>
                </div>
              </div>

              {c.status === 'closed' && c.feedback && (
                <div style={{ marginTop: '1.5rem', padding: '1.2rem', background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '10px' }}>
                  <h4 style={{ color: 'var(--success)', marginBottom: '0.3rem', fontSize: '0.9rem' }}>Feedback Received</h4>
                  <div style={{ display: 'flex', gap: '0.2rem', marginBottom: '0.3rem', color: '#fbbf24' }}>
                    {Array.from({ length: c.feedback.rating }).map((_, i) => (
                      <Star key={i} fill="#fbbf24" size={14} />
                    ))}
                  </div>
                  {c.feedback.comments && <p style={{ fontStyle: 'italic', fontSize: '0.9rem', marginBottom: 0 }}>"{c.feedback.comments}"</p>}
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
