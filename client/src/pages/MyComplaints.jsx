import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Star, Calendar, RefreshCw } from 'lucide-react';

const MyComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedbackRating, setFeedbackRating] = useState({});
  const [feedbackComments, setFeedbackComments] = useState({});
  const navigate = useNavigate();

  const fetchComplaints = async () => {
    setLoading(true);
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

  const handleFeedbackSubmit = async (e, complaintId) => {
    e.preventDefault();
    const rating = feedbackRating[complaintId] || 5;
    const comments = feedbackComments[complaintId] || '';
    try {
      const response = await fetch(`http://localhost:8000/api/complaints/${complaintId}/feedback`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ rating, comments })
      });
      if (response.ok) {
        fetchComplaints();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="main-content">
      <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1>My Registered Complaints</h1>
          <p>Track the progress of your lodged complaints or give feedback upon resolution.</p>
        </div>
        <button onClick={fetchComplaints} className="btn btn-secondary" style={{ width: 'auto', padding: '0.6rem' }}>
          <RefreshCw size={18} />
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p>Loading complaints...</p>
        </div>
      ) : complaints.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p>You haven't lodged any complaints yet.</p>
          <button onClick={() => navigate('/lodge-complaint')} className="btn btn-primary" style={{ width: 'auto', marginTop: '1rem' }}>
            Lodge Your First Complaint
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {complaints.map((c) => (
            <div key={c._id} className="glass-card" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
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

              <p style={{ fontSize: '0.95rem', color: 'var(--text-main)', marginBottom: '1.5rem', whiteSpace: 'pre-wrap' }}>
                {c.description}
              </p>

              <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '1.2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  Assigned Agent:{' '}
                  <span style={{ color: c.agent ? 'var(--text-main)' : 'var(--danger)', fontWeight: '500' }}>
                    {c.agent ? c.agent.name : 'Not Assigned Yet'}
                  </span>
                </div>
                
                <div style={{ display: 'flex', gap: '1rem' }}>
                  {c.agent && c.status !== 'closed' && (
                    <button onClick={() => navigate(`/chat/${c._id}`)} className="btn btn-primary" style={{ width: 'auto', padding: '0.6rem 1.2rem' }}>
                      <MessageSquare size={16} />
                      Chat with Agent
                    </button>
                  )}
                  {c.status === 'closed' && (
                    <button onClick={() => navigate(`/chat/${c._id}`)} className="btn btn-secondary" style={{ width: 'auto', padding: '0.6rem 1.2rem' }}>
                      <MessageSquare size={16} />
                      View Chat History
                    </button>
                  )}
                </div>
              </div>

              {c.status === 'resolved' && (
                <div style={{ marginTop: '1.5rem', padding: '1.5rem', background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '10px' }}>
                  <h4 style={{ color: 'var(--success)', marginBottom: '0.5rem' }}>Provide Feedback to Close Ticket</h4>
                  <form onSubmit={(e) => handleFeedbackSubmit(e, c._id)}>
                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                      <label>Rating</label>
                      <div className="star-rating">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            className={(feedbackRating[c._id] || 5) >= star ? 'active' : ''}
                            onClick={() => setFeedbackRating({ ...feedbackRating, [c._id]: star })}
                          >
                            <Star fill={(feedbackRating[c._id] || 5) >= star ? '#fbbf24' : 'none'} size={20} />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                      <label htmlFor={`comments-${c._id}`}>Comments</label>
                      <input
                        type="text"
                        id={`comments-${c._id}`}
                        className="form-control"
                        placeholder="Share your experience (optional)"
                        value={feedbackComments[c._id] || ''}
                        onChange={(e) => setFeedbackComments({ ...feedbackComments, [c._id]: e.target.value })}
                      />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: 'auto', padding: '0.5rem 1.2rem', background: 'var(--success)', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)' }}>
                      Submit Feedback & Close
                    </button>
                  </form>
                </div>
              )}

              {c.status === 'closed' && c.feedback && (
                <div style={{ marginTop: '1.5rem', padding: '1.2rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)', borderRadius: '10px' }}>
                  <h4 style={{ color: 'var(--text-muted)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Feedback Submitted</h4>
                  <div style={{ display: 'flex', gap: '0.2rem', marginBottom: '0.5rem', color: '#fbbf24' }}>
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

export default MyComplaints;
