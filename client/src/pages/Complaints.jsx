import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, AlertTriangle } from 'lucide-react';

const Complaints = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Technical Issue');
  const [success, setSuccess] = useState(false);
  const [complaintId, setComplaintId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/complaints', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ title, description, category })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to lodge complaint');
      }
      setComplaintId(data._id);
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="main-content">
        <div className="container-sm" style={{ margin: '0 auto' }}>
          <div className="glass-card" style={{ textAlign: 'center' }}>
            <div style={{ color: '#10b981', display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
              <CheckCircle size={64} />
            </div>
            <h2>Complaint Lodged Successfully!</h2>
            <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>
              Your complaint has been successfully registered. The support team will review and assign an agent shortly.
            </p>
            <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '1rem', borderRadius: '8px', margin: '1.5rem 0', fontFamily: 'monospace', fontSize: '0.95rem' }}>
              Complaint ID: <span style={{ color: '#a78bfa' }}>{complaintId}</span>
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <button onClick={() => navigate('/my-complaints')} className="btn btn-primary">
                View My Complaints
              </button>
              <button onClick={() => { setSuccess(false); setTitle(''); setDescription(''); }} className="btn btn-secondary">
                Lodge Another
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content">
      <div className="container-sm" style={{ margin: '0 auto' }}>
        <div className="glass-card">
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <AlertTriangle size={24} style={{ color: '#f59e0b' }} />
            Lodge a Complaint
          </h2>
          
          {error && (
            <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '0.8rem', borderRadius: '8px', color: '#f87171', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                className="form-control"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{ background: '#0b0f19' }}
              >
                <option value="Technical Issue">Technical Issue</option>
                <option value="Billing & Payments">Billing & Payments</option>
                <option value="Account Access">Account Access</option>
                <option value="Product Feedback">Product Feedback</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="title">Subject / Title</label>
              <input
                type="text"
                id="title"
                className="form-control"
                placeholder="e.g. Cannot process credit card payment"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Detailed Description</label>
              <textarea
                id="description"
                className="form-control"
                rows="6"
                placeholder="Describe the problem you are experiencing. Include any error codes if applicable."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                style={{ resize: 'vertical' }}
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ marginTop: '1.5rem' }} disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Complaint'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Complaints;
