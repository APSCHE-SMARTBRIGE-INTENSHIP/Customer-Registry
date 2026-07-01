import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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
    <div style={{ background: '#fff', minHeight: 'calc(100vh - 60px)', padding: '3rem 2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', maxWidth: '1100px', margin: '0 auto 2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2c3e50' }}>Complaints Management</h1>
          <p style={{ color: '#7f8c8d' }}>Review complaints and assign them to support agents for resolution.</p>
        </div>
        <button onClick={fetchData} style={{ background: '#6c757d', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}>
          Refresh
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem', maxWidth: '1100px', margin: '0 auto 2rem' }}>
        <div style={{ border: '1px solid #dee2e6', borderRadius: '6px', padding: '1rem', textAlign: 'center' }}>
          <div style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>{stats.total}</div>
          <div style={{ fontSize: '0.85rem', color: '#6c757d' }}>Total Tickets</div>
        </div>
        <div style={{ border: '1px solid #dee2e6', borderRadius: '6px', padding: '1rem', textAlign: 'center', borderLeft: '4px solid #ffc107' }}>
          <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#ffc107' }}>{stats.pending}</div>
          <div style={{ fontSize: '0.85rem', color: '#6c757d' }}>Pending</div>
        </div>
        <div style={{ border: '1px solid #dee2e6', borderRadius: '6px', padding: '1rem', textAlign: 'center', borderLeft: '4px solid #17a2b8' }}>
          <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#17a2b8' }}>{stats.inProgress}</div>
          <div style={{ fontSize: '0.85rem', color: '#6c757d' }}>In Progress</div>
        </div>
        <div style={{ border: '1px solid #dee2e6', borderRadius: '6px', padding: '1rem', textAlign: 'center', borderLeft: '4px solid #28a745' }}>
          <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#28a745' }}>{stats.resolved}</div>
          <div style={{ fontSize: '0.85rem', color: '#6c757d' }}>Resolved</div>
        </div>
        <div style={{ border: '1px solid #dee2e6', borderRadius: '6px', padding: '1rem', textAlign: 'center', borderLeft: '4px solid #6c757d' }}>
          <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#6c757d' }}>{stats.closed}</div>
          <div style={{ fontSize: '0.85rem', color: '#6c757d' }}>Closed</div>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p>Loading complaints...</p>
        </div>
      ) : (
        <div className="table-container" style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <table>
            <thead>
              <tr>
                <th>Customer Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Complaint Details</th>
                <th>Status</th>
                <th>Assigned Agent</th>
                <th>Chat</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map((c) => (
                <tr key={c._id}>
                  <td>{c.name}</td>
                  <td>{c.phone}</td>
                  <td>{c.email}</td>
                  <td style={{ maxWidth: '250px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                    {c.description}
                  </td>
                  <td>
                    <span className={`badge badge-${c.status}`} style={{ textTransform: 'capitalize' }}>
                      {c.status}
                    </span>
                  </td>
                  <td>
                    {c.status === 'closed' || c.status === 'resolved' ? (
                      <span>{c.agent ? `${c.agent.firstName} ${c.agent.lastName}` : 'N/A'}</span>
                    ) : (
                      <select
                        className="form-control"
                        value={c.agent?._id || ''}
                        onChange={(e) => handleAssignAgent(c._id, e.target.value)}
                        style={{ padding: '0.3rem 0.5rem', fontSize: '0.9rem', width: '150px', background: '#fff', color: '#495057' }}
                      >
                        <option value="">Assign Agent...</option>
                        {agents.map((a) => (
                          <option key={a._id} value={a._id}>{a.name}</option>
                        ))}
                      </select>
                    )}
                  </td>
                  <td>
                    {c.agent && (
                      <button 
                        onClick={() => navigate(`/chat/${c._id}`)} 
                        style={{ background: '#007bff', color: '#fff', border: 'none', padding: '0.3rem 0.7rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }}
                      >
                        Chat
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {complaints.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: '#6c757d' }}>
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
