import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import complaintsImage from '../assets/complaints.png';

const Complaints = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userString = localStorage.getItem('user');
    if (userString) {
      const user = JSON.parse(userString);
      setName(user.name || '');
      setEmail(user.email || '');
    }
  }, []);

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
        body: JSON.stringify({ name, phone, email, description })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to lodge complaint');
      }
      navigate('/my-complaints');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: '#f8f9fa', minHeight: 'calc(100vh - 60px)', padding: '3rem 2rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ background: '#fff', border: '1px solid #dee2e6', borderRadius: '8px', padding: '3rem', width: '100%', maxWidth: '1100px', display: 'grid', gridTemplateColumns: '1.1fr 1.2fr', gap: '4rem', alignItems: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.03)' }}>
        
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <img src={complaintsImage} alt="Write Complaint Illustration" style={{ maxWidth: '100%', height: 'auto', borderRadius: '6px' }} />
        </div>

        <div>
          <h2 style={{ fontSize: '1.8rem', color: '#212529', marginBottom: '2rem', fontWeight: '600', textAlign: 'center' }}>
            Write Your Complaint
          </h2>
          
          {error && (
            <div style={{ background: '#f8d7da', border: '1px solid #f5c6cb', padding: '0.8rem', borderRadius: '4px', color: '#721c24', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.9rem', fontWeight: '500', color: '#495057' }}>Name</label>
              <input
                type="text"
                placeholder="Enter name"
                style={{ padding: '0.6rem 0.8rem', border: '1px solid #ced4da', borderRadius: '4px', fontSize: '0.95rem', outline: 'none' }}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.9rem', fontWeight: '500', color: '#495057' }}>Phone</label>
              <input
                type="text"
                placeholder="Enter phone"
                style={{ padding: '0.6rem 0.8rem', border: '1px solid #ced4da', borderRadius: '4px', fontSize: '0.95rem', outline: 'none' }}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.9rem', fontWeight: '500', color: '#495057' }}>Email</label>
              <input
                type="email"
                placeholder="Enter email"
                style={{ padding: '0.6rem 0.8rem', border: '1px solid #ced4da', borderRadius: '4px', fontSize: '0.95rem', outline: 'none' }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.9rem', fontWeight: '500', color: '#495057' }}>Complaint Details</label>
              <textarea
                rows="5"
                placeholder="Describe your complaint here..."
                style={{ padding: '0.6rem 0.8rem', border: '1px solid #ced4da', borderRadius: '4px', fontSize: '0.95rem', outline: 'none', resize: 'vertical', fontFamily: 'inherit' }}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <button type="submit" style={{ background: '#007bff', color: '#fff', border: 'none', padding: '0.7rem 2.2rem', borderRadius: '4px', fontSize: '0.95rem', fontWeight: '600', cursor: 'pointer' }} disabled={loading}>
                {loading ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
};

export default Complaints;
