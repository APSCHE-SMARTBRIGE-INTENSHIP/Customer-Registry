import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Send, ArrowLeft, RefreshCw } from 'lucide-react';

const ChatRoom = () => {
  const { complaintId } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [user, setUser] = useState(null);
  const messagesEndRef = useRef(null);

  const fetchComplaintAndMessages = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const compRes = await fetch(`http://localhost:8000/api/complaints/${complaintId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (compRes.ok) {
        const compData = await compRes.json();
        setComplaint(compData);
      }

      const msgRes = await fetch(`http://localhost:8000/api/messages/${complaintId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (msgRes.ok) {
        const msgData = await msgRes.json();
        setMessages(msgData);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const userData = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
    setUser(userData);
    fetchComplaintAndMessages();

    const interval = setInterval(fetchComplaintAndMessages, 3000);
    return () => clearInterval(interval);
  }, [complaintId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    try {
      const response = await fetch(`http://localhost:8000/api/messages/${complaintId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ text })
      });
      const data = await response.json();
      if (response.ok) {
        setMessages((prev) => [...prev, data]);
        setText('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleBack = () => {
    if (!user) navigate('/');
    else if (user.role === 'admin') navigate('/admin-dashboard');
    else if (user.role === 'agent') navigate('/agent-dashboard');
    else navigate('/my-complaints');
  };

  return (
    <div className="main-content">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <button onClick={handleBack} className="btn btn-secondary" style={{ width: 'auto', padding: '0.5rem 1rem' }}>
          <ArrowLeft size={16} /> Back
        </button>
        {complaint && (
          <div>
            <h2 style={{ margin: 0, fontSize: '1.4rem' }}>{complaint.title}</h2>
            <p style={{ margin: 0, fontSize: '0.85rem' }}>
              Category: {complaint.category} | Ticket Status:{' '}
              <span style={{ textTransform: 'capitalize', fontWeight: '600' }}>{complaint.status.replace('_', ' ')}</span>
            </p>
          </div>
        )}
      </div>

      <div className="glass-card" style={{ padding: '0', display: 'flex', flexDirection: 'column', height: '550px' }}>
        {complaint && (
          <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-glass)', background: 'rgba(255,255,255,0.02)', display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
            <div>
              <strong>Customer:</strong> {complaint.customer?.name}
            </div>
            <div>
              <strong>Agent:</strong> {complaint.agent?.name || 'Waiting to assign...'}
            </div>
          </div>
        )}

        <div className="chat-messages" style={{ flex: '1', overflowY: 'auto', padding: '1.5rem' }}>
          {messages.map((m) => {
            const isMe = user && m.sender?._id === user.id;
            return (
              <div
                key={m._id}
                className={`message-bubble ${isMe ? 'sent' : 'received'}`}
                style={{
                  alignSelf: isMe ? 'flex-end' : 'flex-start',
                  background: isMe ? 'var(--primary)' : 'rgba(255, 255, 255, 0.08)',
                  marginBottom: '1rem'
                }}
              >
                {!isMe && (
                  <div style={{ fontSize: '0.75rem', color: '#a78bfa', fontWeight: '600', marginBottom: '0.2rem', textTransform: 'capitalize' }}>
                    {m.sender?.name} ({m.sender?.role})
                  </div>
                )}
                <div>{m.text}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-dark)', marginTop: '0.2rem', textAlign: 'right' }}>
                  {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {complaint && complaint.status === 'closed' ? (
          <div style={{ padding: '1.2rem', textAlign: 'center', color: 'var(--text-muted)', borderTop: '1px solid var(--border-glass)', background: 'rgba(255,255,255,0.01)' }}>
            This ticket is closed. Chat is archived.
          </div>
        ) : (
          <form onSubmit={handleSendMessage} className="chat-input-area">
            <input
              type="text"
              className="form-control"
              placeholder="Type your message..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              style={{ flex: '1' }}
              required
            />
            <button type="submit" className="btn btn-primary" style={{ width: 'auto', padding: '0.8rem 1.5rem' }}>
              <Send size={16} />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ChatRoom;
