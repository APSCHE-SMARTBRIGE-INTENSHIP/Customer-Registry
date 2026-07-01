import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCheck, ShieldAlert, BarChart2, RefreshCw, MessageSquare } from 'lucide-react';

const AdminDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();

  const fetchData = async () => {
    setRefreshing(true);
    try {
      const token = localStorage.getItem('token');
      const compRes = await fetch('http://localhost:8000/api/complaints', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const compData = await compRes.json();
      if (compRes.ok) {
        setComplaints(compData);
      }

      const agentRes = await fetch('http://localhost:8000/api/auth/agents', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const agentData = await agentRes.json();
      if (agentRes.ok) {
        setAgents(agentData);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAssignAgent = async (complaintId, agentId) => {
    if (!agentId) return;
    try {
      const response = await fetch(`http://localhost:8000/api/complaints/${complaintId}/assign`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ agentId })
      });
      if (response.ok) {
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const stats = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === 'pending').length,
    inProgress: complaints.filter(c => c.status === 'in_progress').length,
    resolved: complaints.filter(c => c.status === 'resolved').length,
    closed: complaints.filter(c => c.status === 'closed').length
  };

  return (
    <div className="main-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1>Admin Dashboard</h1>
          <p>Review complaints and assign them to support agents for resolution.</p>
        </div>
        <button onClick={fetchData} className="btn btn-secondary" style={{ width: 'auto', padding: '0.6rem' }} disabled={refreshing}>
          <RefreshCw size={18} className={refreshing ? 'spin' : ''} />
        </button>
      </div>

      <div className="stats-grid" style={{ marginBottom: '2rem' }}>
        <div className="stat-card" style={{ padding: '1.5rem' }}>
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Total Tickets</div>
        </div>
        <div className="stat-card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--warning)' }}>
          <div className="stat-value" style={{ color: 'var(--warning)' }}>{stats.pending}</div>
          <div className="stat-label">Pending</div>
        </div>
        <div className="stat-card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--info)' }}>
          <div className="stat-value" style={{ color: 'var(--info)' }}>{stats.inProgress}</div>
          <div className="stat-label">In Progress</div>
        </div>
        <div className="stat-card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--success)' }}>
          <div className="stat-value" style={{ color: 'var(--success)' }}>{stats.resolved}</div>
          <div className="stat-label">Resolved</div>
        </div>
        <div className="stat-card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--text-dark)' }}>
          <div className="stat-value" style={{ color: 'var(--text-muted)' }}>{stats.closed}</div>
          <div className="stat-label">Closed</div>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p>Loading complaints...</p>
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Subject</th>
                <th>Category</th>
                <th>Status</th>
                <th>Assigned Agent</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map((c) => (
                <tr key={c._id}>
                  <td>
                    <div style={{ fontWeight: '600' }}>{c.customer?.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{c.customer?.email}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: '500' }}>{c.title}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {c.description}
                    </div>
                  </td>
                  <td>{c.category}</td>
                  <td>
                    <span className={`badge badge-${c.status}`}>{c.status.replace('_', ' ')}</span>
                  </td>
                  <td>
                    {c.status === 'closed' || c.status === 'resolved' ? (
                      <span style={{ fontSize: '0.9rem' }}>{c.agent?.name || 'N/A'}</span>
                    ) : (
                      <select
                        className="form-control"
                        value={c.agent?._id || ''}
                        onChange={(e) => handleAssignAgent(c._id, e.target.value)}
                        style={{ padding: '0.4rem 0.6rem', fontSize: '0.9rem', width: '160px', background: '#0b0f19' }}
                      >
                        <option value="">Assign Agent...</option>
                        {agents.map((a) => (
                          <option key={a._id} value={a._id}>{a.name}</option>
                        ))}
                      </select>
                    )}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {c.agent && (
                        <button onClick={() => navigate(`/chat/${c._id}`)} className="btn btn-secondary" style={{ width: 'auto', padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
                          <MessageSquare size={14} />
                          Chat
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {complaints.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                    No complaints registered in the system.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
