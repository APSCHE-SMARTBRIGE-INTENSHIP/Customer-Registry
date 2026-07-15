import { useState } from 'react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';

const RaiseComplaint = () => {
  const [newComplaint, setNewComplaint] = useState({ title: '', phone: '', description: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/complaints', newComplaint);
      navigate('/customer/complaints');
    } catch (error) {
      console.error('Failed to create complaint', error);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ display: 'flex', justifyContent: 'center' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '600px', padding: '3rem' }}>
        <h2 style={{ marginBottom: '2rem', textAlign: 'center', color: '#000' }}>Write Your Complaint</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '0.5rem', color: '#555', fontSize: '0.9rem' }}>Complaint Title</div>
          <input
            type="text"
            placeholder="Network error, etc."
            className="input-field"
            value={newComplaint.title}
            onChange={(e) => setNewComplaint({ ...newComplaint, title: e.target.value })}
            required
          />
          <div style={{ marginBottom: '0.5rem', color: '#555', fontSize: '0.9rem' }}>Phone</div>
          <input
            type="text"
            placeholder="Enter phone number"
            className="input-field"
            value={newComplaint.phone}
            onChange={(e) => setNewComplaint({ ...newComplaint, phone: e.target.value })}
            required
          />
          <div style={{ marginBottom: '0.5rem', color: '#555', fontSize: '0.9rem' }}>Complaint Details</div>
          <textarea
            placeholder="Describe your complaint here..."
            className="input-field"
            rows="5"
            value={newComplaint.description}
            onChange={(e) => setNewComplaint({ ...newComplaint, description: e.target.value })}
            required
          />
          <div style={{ textAlign: 'right' }}>
            <button type="submit" className="btn" style={{ width: 'auto', background: '#0d6efd', borderRadius: '4px' }}>Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RaiseComplaint;
