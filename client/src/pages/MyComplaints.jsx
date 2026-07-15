import { useState, useEffect } from 'react';
import api from '../utils/api';

const MyComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedComplaintId, setExpandedComplaintId] = useState(null);
  const [messageInputs, setMessageInputs] = useState({});

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const res = await api.get('/complaints');
      setComplaints(res.data);
    } catch (error) {
      console.error('Failed to fetch complaints', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (complaintId) => {
    const text = messageInputs[complaintId];
    if (!text) return;
    try {
      await api.post(`/complaints/${complaintId}/messages`, { text });
      setMessageInputs({ ...messageInputs, [complaintId]: '' });
      fetchComplaints();
    } catch (error) {
      console.error('Failed to send message', error);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ display: 'flex', justifyContent: 'center' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '800px', padding: '3rem' }}>
        <h2 style={{ marginBottom: '2rem', textAlign: 'center', color: '#000' }}>My Complaints</h2>
        
        {loading ? <p style={{ textAlign: 'center' }}>Loading...</p> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {complaints.length === 0 ? <p style={{ textAlign: 'center' }}>No complaints found.</p> : complaints.map(c => {
              const isExpanded = expandedComplaintId === c._id;
              return (
                <div key={c._id} style={{ 
                  border: '1px solid #e9ecef', 
                  borderRadius: '8px', 
                  padding: '1.5rem', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '0.8rem',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                  cursor: 'pointer',
                  background: isExpanded ? '#f8f9fa' : '#fff',
                  transition: 'background 0.2s'
                }} onClick={() => setExpandedComplaintId(isExpanded ? null : c._id)}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <strong style={{ color: '#555', minWidth: '80px' }}>ID:</strong>
                    <span style={{ color: '#000', fontWeight: '500' }}>{c.complaintId || c._id}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <strong style={{ color: '#555', minWidth: '80px' }}>Complaint:</strong>
                    <span style={{ color: '#000' }}>{c.title}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <strong style={{ color: '#555', minWidth: '80px' }}>Date:</strong>
                    <span style={{ color: '#000' }}>{new Date(c.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <strong style={{ color: '#555', minWidth: '80px' }}>Status:</strong>
                    <span style={{ color: c.status === 'Pending' ? '#dc3545' : c.status === 'In Progress' ? '#0d6efd' : '#198754', fontWeight: 'bold' }}>
                      {c.status.toLowerCase()}
                    </span>
                  </div>

                  {/* Expanded Chat Section */}
                  {isExpanded && (
                    <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #dee2e6' }} onClick={e => e.stopPropagation()}>
                      <h4 style={{ marginBottom: '1rem', color: '#000' }}>Discussion</h4>
                      
                      <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '1rem', padding: '1rem', background: '#fff', borderRadius: '8px', border: '1px solid #e9ecef' }}>
                        {/* Original Issue */}
                        <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '1rem' }}>
                          <div style={{ background: '#f8f9fa', color: '#000', padding: '0.8rem 1rem', borderRadius: '12px 12px 12px 0', maxWidth: '80%', border: '1px solid #e9ecef' }}>
                            <div style={{ fontSize: '0.75rem', color: '#6c757d', marginBottom: '0.25rem', fontWeight: 'bold' }}>Original Description</div>
                            <div>{c.description}</div>
                          </div>
                        </div>

                        {c.messages && c.messages.map((msg, idx) => {
                          const isCustomer = msg.role === 'Customer';
                          return (
                            <div key={idx} style={{ display: 'flex', justifyContent: isCustomer ? 'flex-end' : 'flex-start', marginBottom: '1rem' }}>
                              <div style={{ 
                                background: isCustomer ? '#0d6efd' : '#f8f9fa', 
                                color: isCustomer ? '#fff' : '#000',
                                padding: '0.8rem 1rem', 
                                borderRadius: isCustomer ? '12px 12px 0 12px' : '12px 12px 12px 0', 
                                maxWidth: '80%', 
                                border: isCustomer ? 'none' : '1px solid #e9ecef' 
                              }}>
                                <div style={{ fontSize: '0.75rem', color: isCustomer ? 'rgba(255,255,255,0.8)' : '#6c757d', marginBottom: '0.25rem', fontWeight: 'bold' }}>
                                  {msg.senderName}
                                </div>
                                <div>{msg.text}</div>
                              </div>
                            </div>
                          );
                        })}
                        {(!c.messages || c.messages.length === 0) && <p style={{ fontSize: '0.85rem', color: '#6c757d', textAlign: 'center' }}>No agent replies yet.</p>}
                      </div>
                      
                      {c.status !== 'Resolved' && c.status !== 'Closed' && (
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <input 
                            type="text" 
                            className="input-field" 
                            style={{ marginBottom: 0, flex: 1 }}
                            placeholder="Type a message to the agent..." 
                            value={messageInputs[c._id] || ''}
                            onChange={(e) => setMessageInputs({ ...messageInputs, [c._id]: e.target.value })}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(c._id)}
                          />
                          <button 
                            className="btn" 
                            style={{ width: 'auto', padding: '0.5rem 1.5rem', background: '#0d6efd' }} 
                            onClick={() => handleSendMessage(c._id)}
                          >
                            Send
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyComplaints;
