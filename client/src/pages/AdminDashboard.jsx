import { useState, useEffect } from 'react';
import api from '../utils/api';

const AdminDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [agents, setAgents] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [compRes, agentRes, analyticsRes] = await Promise.all([
        api.get('/complaints'),
        api.get('/auth/agents'),
        api.get('/complaints/analytics')
      ]);
      setComplaints(compRes.data);
      setAgents(agentRes.data);
      setAnalytics(analyticsRes.data);
    } catch (error) {
      console.error('Failed to fetch data', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async (complaintId, agentId) => {
    if (!agentId) return;
    try {
      await api.patch(`/complaints/${complaintId}/assign`, { agentId });
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Failed to assign agent', error);
    }
  };

  return (
    <div className="container animate-fade-in">
      {analytics && (
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ marginBottom: '1rem' }}>Dashboard Overview</h2>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))' }}>
            <div className="card" style={{ textAlign: 'center' }}>
              <h3 style={{ fontSize: '2rem', color: 'var(--primary-color)' }}>{analytics.total}</h3>
              <p style={{ color: 'var(--text-muted)' }}>Total Tickets</p>
            </div>
            <div className="card" style={{ textAlign: 'center' }}>
              <h3 style={{ fontSize: '2rem', color: '#ffb74d' }}>{analytics.pending}</h3>
              <p style={{ color: 'var(--text-muted)' }}>Pending</p>
            </div>
            <div className="card" style={{ textAlign: 'center' }}>
              <h3 style={{ fontSize: '2rem', color: '#4fc3f7' }}>{analytics.inProgress}</h3>
              <p style={{ color: 'var(--text-muted)' }}>In Progress</p>
            </div>
            <div className="card" style={{ textAlign: 'center' }}>
              <h3 style={{ fontSize: '2rem', color: 'var(--success-color)' }}>{analytics.resolved}</h3>
              <p style={{ color: 'var(--text-muted)' }}>Resolved</p>
            </div>
            <div className="card" style={{ textAlign: 'center' }}>
              <h3 style={{ fontSize: '2rem', color: '#e040fb' }}>{analytics.avgRating} <span style={{fontSize: '1rem'}}>★</span></h3>
              <p style={{ color: 'var(--text-muted)' }}>Avg Rating</p>
            </div>
          </div>
        </div>
      )}

      <h2 style={{ marginBottom: '1.5rem' }}>All System Complaints</h2>
      {loading ? <p>Loading...</p> : (
        <div className="grid">
          {complaints.length === 0 ? <p>No complaints found.</p> : complaints.map(c => (
            <div key={c._id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span style={{ fontWeight: 'bold', color: 'var(--primary-color)' }}>{c.complaintId}</span>
                <span className={`badge ${c.status === 'Pending' ? 'badge-pending' : c.status === 'In Progress' ? 'badge-progress' : c.status === 'Resolved' ? 'badge-resolved' : 'badge-closed'}`}>
                  {c.status}
                </span>
              </div>
              <h3 style={{ marginBottom: '0.5rem' }}>{c.title}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>{c.description}</p>
              <div style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                <strong>Customer:</strong> {c.customer?.name} ({c.customer?.email})
              </div>
              
              <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                {c.agent ? (
                  <p style={{ fontSize: '0.85rem', color: 'var(--success-color)' }}>
                    Assigned to: {c.agent.name}
                  </p>
                ) : (
                  <select 
                    className="input-field" 
                    style={{ marginBottom: 0, padding: '0.5rem' }}
                    onChange={(e) => handleAssign(c._id, e.target.value)}
                    defaultValue=""
                  >
                    <option value="" disabled>Assign an Agent...</option>
                    {agents.map(agent => (
                      <option key={agent._id} value={agent._id}>{agent.name}</option>
                    ))}
                  </select>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
