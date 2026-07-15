import { useState, useEffect } from 'react';
import api from '../utils/api';

const AgentDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedComplaintId, setSelectedComplaintId] = useState(null);
  const [messageInputs, setMessageInputs] = useState({});

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const res = await api.get('/complaints');
      setComplaints(res.data);
      if (res.data.length > 0 && !selectedComplaintId) {
        setSelectedComplaintId(res.data[0]._id);
      }
    } catch (error) {
      console.error('Failed to fetch complaints', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (complaintId, status) => {
    try {
      await api.patch(`/complaints/${complaintId}/status`, { status });
      fetchComplaints();
    } catch (error) {
      console.error('Failed to update status', error);
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

  const selectedComplaint = complaints.find(c => c._id === selectedComplaintId);

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 70px)' }}>
      {/* Sidebar */}
      <div style={{ width: '300px', borderRight: '1px solid #e9ecef', background: '#f8f9fa', overflowY: 'auto' }}>
        <div style={{ padding: '1rem', borderBottom: '1px solid #e9ecef', fontWeight: 'bold' }}>
          Complaint Details
        </div>
        <div style={{ display: 'flex', gap: '1rem', padding: '1rem', borderBottom: '1px solid #e9ecef', fontSize: '0.9rem' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: '#6c757d' }}>Total solved</div>
            <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
              {complaints.filter(c => c.status === 'Resolved').length}
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: '#6c757d' }}>Pending</div>
            <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
              {complaints.filter(c => c.status === 'Pending').length}
            </div>
          </div>
        </div>
        
        {loading ? <div style={{ padding: '1rem' }}>Loading...</div> : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {complaints.map(c => (
              <div 
                key={c._id} 
                style={{ 
                  padding: '1rem', 
                  borderBottom: '1px solid #e9ecef', 
                  cursor: 'pointer',
                  background: selectedComplaintId === c._id ? '#e9ecef' : 'transparent',
                  transition: 'background 0.2s'
                }}
                onClick={() => setSelectedComplaintId(c._id)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span style={{ fontWeight: 'bold', fontSize: '0.95rem' }}>{c.customer?.firstName ? `${c.customer.firstName} ${c.customer.lastName}` : c.customer?.username}</span>
                  <span style={{ fontSize: '0.8rem', color: '#6c757d' }}>
                    {new Date(c.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div style={{ fontSize: '0.85rem', color: '#6c757d', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {c.title}
                </div>
              </div>
            ))}
            {complaints.length === 0 && <div style={{ padding: '1rem', color: '#6c757d' }}>No assigned complaints</div>}
          </div>
        )}
      </div>

      {/* Main Chat Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#fff' }}>
        {selectedComplaint ? (
          <>
            {/* Header */}
            <div style={{ padding: '1rem', borderBottom: '1px solid #e9ecef', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#0f172a', color: '#fff' }}>
              <div>
                <span style={{ fontWeight: 'bold' }}>{selectedComplaint.customer?.firstName ? `${selectedComplaint.customer.firstName} ${selectedComplaint.customer.lastName}` : selectedComplaint.customer?.username}</span>
                <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)' }}>{selectedComplaint.complaintId} - {selectedComplaint.title}</div>
              </div>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <select 
                  className="input-field" 
                  style={{ marginBottom: 0, padding: '0.3rem 0.5rem', width: 'auto', background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }}
                  value={selectedComplaint.status}
                  onChange={(e) => handleStatusUpdate(selectedComplaint._id, e.target.value)}
                >
                  <option style={{ color: '#000' }} value="Pending">Pending</option>
                  <option style={{ color: '#000' }} value="In Progress">In Progress</option>
                  <option style={{ color: '#000' }} value="Resolved">Resolved</option>
                  {selectedComplaint.status === 'Closed' && <option style={{ color: '#000' }} value="Closed" disabled>Closed</option>}
                </select>
              </div>
            </div>

            {/* Chat Messages */}
            <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', background: 'url(https://www.transparenttextures.com/patterns/cubes.png), linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)' }}>
              {/* Initial Issue Message */}
              <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '1rem' }}>
                <div style={{ background: '#fff', padding: '0.8rem 1rem', borderRadius: '12px 12px 12px 0', maxWidth: '70%', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
                  <div style={{ fontSize: '0.8rem', color: '#6c757d', marginBottom: '0.25rem', fontWeight: 'bold' }}>Original Complaint</div>
                  <div style={{ color: '#000' }}>{selectedComplaint.description}</div>
                </div>
              </div>

              {selectedComplaint.messages && selectedComplaint.messages.map((msg, idx) => {
                const isAgent = msg.role === 'Agent';
                return (
                  <div key={idx} style={{ display: 'flex', justifyContent: isAgent ? 'flex-end' : 'flex-start', marginBottom: '1rem' }}>
                    <div style={{ 
                      background: isAgent ? '#0d6efd' : '#fff', 
                      color: isAgent ? '#fff' : '#000',
                      padding: '0.8rem 1rem', 
                      borderRadius: isAgent ? '12px 12px 0 12px' : '12px 12px 12px 0', 
                      maxWidth: '70%', 
                      boxShadow: '0 1px 2px rgba(0,0,0,0.1)' 
                    }}>
                      <div style={{ fontSize: '0.75rem', color: isAgent ? 'rgba(255,255,255,0.8)' : '#6c757d', marginBottom: '0.25rem', fontWeight: 'bold' }}>
                        {msg.senderName}
                      </div>
                      <div>{msg.text}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Message Input */}
            {selectedComplaint.status !== 'Resolved' && selectedComplaint.status !== 'Closed' && (
              <div style={{ padding: '1rem', borderTop: '1px solid #e9ecef', background: '#f8f9fa', display: 'flex', gap: '0.5rem' }}>
                <input 
                  type="text" 
                  className="input-field" 
                  style={{ marginBottom: 0, flex: 1, background: '#fff' }}
                  placeholder="Type a message..." 
                  value={messageInputs[selectedComplaint._id] || ''}
                  onChange={(e) => setMessageInputs({ ...messageInputs, [selectedComplaint._id]: e.target.value })}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(selectedComplaint._id)}
                />
                <button 
                  className="btn" 
                  style={{ width: 'auto', padding: '0.5rem 1.5rem', background: '#0d6efd', borderRadius: '4px' }} 
                  onClick={() => handleSendMessage(selectedComplaint._id)}
                >
                  ➤
                </button>
              </div>
            )}
          </>
        ) : (
          <div style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center', color: '#6c757d' }}>
            Select a complaint from the sidebar to view details.
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentDashboard;
