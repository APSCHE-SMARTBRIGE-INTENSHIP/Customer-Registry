import { useState, useEffect } from 'react';
import api from '../utils/api';

const CustomerDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [newComplaint, setNewComplaint] = useState({ title: '', description: '' });
  const [loading, setLoading] = useState(true);

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

  const [messageInputs, setMessageInputs] = useState({});
  const [feedbackInputs, setFeedbackInputs] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/complaints', newComplaint);
      setNewComplaint({ title: '', description: '' });
      fetchComplaints();
    } catch (error) {
      console.error('Failed to create complaint', error);
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

  const handleSubmitFeedback = async (complaintId) => {
    const feedback = feedbackInputs[complaintId];
    if (!feedback || !feedback.rating) return;
    try {
      await api.put(`/complaints/${complaintId}/close`, feedback);
      fetchComplaints();
    } catch (error) {
      console.error('Failed to submit feedback', error);
    }
  };

  return (
    <div className="container animate-fade-in">
      <div className="glass-panel" style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>Raise a New Complaint</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Complaint Title"
            className="input-field"
            value={newComplaint.title}
            onChange={(e) => setNewComplaint({ ...newComplaint, title: e.target.value })}
            required
          />
          <textarea
            placeholder="Describe your issue..."
            className="input-field"
            rows="4"
            value={newComplaint.description}
            onChange={(e) => setNewComplaint({ ...newComplaint, description: e.target.value })}
            required
          />
          <button type="submit" className="btn" style={{ width: 'auto' }}>Submit Complaint</button>
        </form>
      </div>

      <h2>Your Complaints</h2>
      {loading ? <p>Loading...</p> : (
        <div className="grid" style={{ marginTop: '1.5rem' }}>
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
              
              {/* Messages Section */}
              <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <h4 style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>Discussion</h4>
                <div style={{ maxHeight: '150px', overflowY: 'auto', marginBottom: '1rem', paddingRight: '0.5rem' }}>
                  {c.messages && c.messages.map((msg, idx) => (
                    <div key={idx} style={{ marginBottom: '0.5rem', textAlign: msg.role === 'Customer' ? 'right' : 'left' }}>
                      <div style={{ 
                        display: 'inline-block', 
                        padding: '0.5rem 0.8rem', 
                        borderRadius: '12px',
                        background: msg.role === 'Customer' ? 'var(--primary-color)' : 'rgba(255,255,255,0.1)',
                        fontSize: '0.85rem'
                      }}>
                        <strong style={{ display: 'block', fontSize: '0.75rem', color: msg.role === 'Customer' ? 'rgba(255,255,255,0.8)' : 'var(--primary-color)' }}>{msg.senderName}</strong>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  {(!c.messages || c.messages.length === 0) && <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No messages yet.</p>}
                </div>
                
                {c.status !== 'Resolved' && c.status !== 'Closed' && (
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input 
                      type="text" 
                      className="input-field" 
                      style={{ marginBottom: 0, padding: '0.5rem', flex: 1 }}
                      placeholder="Type a message..." 
                      value={messageInputs[c._id] || ''}
                      onChange={(e) => setMessageInputs({ ...messageInputs, [c._id]: e.target.value })}
                    />
                    <button className="btn" style={{ width: 'auto', padding: '0.5rem 1rem' }} onClick={() => handleSendMessage(c._id)}>Send</button>
                  </div>
                )}
              </div>

              {/* Feedback Section */}
              {c.status === 'Resolved' && !c.feedback?.rating && (
                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                  <h4 style={{ fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--success-color)' }}>Leave Feedback</h4>
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    {[1, 2, 3, 4, 5].map(star => (
                      <span 
                        key={star} 
                        style={{ 
                          cursor: 'pointer', 
                          fontSize: '1.2rem', 
                          color: (feedbackInputs[c._id]?.rating || 0) >= star ? '#ffb74d' : 'rgba(255,255,255,0.2)' 
                        }}
                        onClick={() => setFeedbackInputs({ ...feedbackInputs, [c._id]: { ...feedbackInputs[c._id], rating: star } })}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder="Optional comment..." 
                    style={{ marginBottom: '0.5rem', padding: '0.5rem' }}
                    value={feedbackInputs[c._id]?.comment || ''}
                    onChange={(e) => setFeedbackInputs({ ...feedbackInputs, [c._id]: { ...feedbackInputs[c._id], comment: e.target.value } })}
                  />
                  <button className="btn" style={{ width: 'auto', padding: '0.5rem 1rem' }} onClick={() => handleSubmitFeedback(c._id)}>Submit Feedback</button>
                </div>
              )}
              
              {c.status === 'Closed' && c.feedback?.rating && (
                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                  <p style={{ fontSize: '0.85rem', color: 'var(--success-color)' }}>
                    You rated this: <span style={{ color: '#ffb74d' }}>{'★'.repeat(c.feedback.rating)}</span>
                    {c.feedback.comment && <span> - "{c.feedback.comment}"</span>}
                  </p>
                </div>
              )}

              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '1rem' }}>
                Created on {new Date(c.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerDashboard;
