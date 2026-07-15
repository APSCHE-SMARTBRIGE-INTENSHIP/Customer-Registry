import { useState, useEffect } from 'react';
import api from '../utils/api';

const AgentsList = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const res = await api.get('/auth/agents');
      setAgents(res.data);
    } catch (error) {
      console.error('Failed to fetch agents', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container animate-fade-in">
      <h2 style={{ marginBottom: '1.5rem' }}>All Agents</h2>
      {loading ? <p>Loading...</p> : (
        <div className="grid">
          {agents.length === 0 ? <p>No agents found.</p> : agents.map(agent => (
            <div key={agent._id} className="card">
              <h3 style={{ marginBottom: '0.5rem', color: 'var(--primary-color)' }}>
                {agent.firstName} {agent.lastName}
              </h3>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                <p><strong>Username:</strong> {agent.username}</p>
                <p><strong>Email:</strong> {agent.email}</p>
                <p><strong>Joined:</strong> {new Date(agent.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AgentsList;
