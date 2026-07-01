import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Send, ArrowLeft } from 'lucide-react';

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
    <div style={{ background: '#f8f9fa', minHeight: 'calc(100vh - 60px)', padding: '2rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <button onClick={handleBack} style={{ background: 'none', border: '1px solid #ced4da', borderRadius: '4px', padding: '0.4rem 0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.9rem' }}>
          <ArrowLeft size={16} /> Back
        </button>
        {complaint && (
          <div>
            <h2 style={{ margin: 0, fontSize: '1.3rem', color: '#2c3e50' }}>{complaint.title || complaint.description.substring(0, 30)}</h2>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#6c757d' }}>
              Complainant: {complaint.name} | Status:{' '}
              <span style={{ textTransform: 'capitalize', fontWeight: 'bold' }}>{complaint.status}</span>
            </p>
          </div>
        )}
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', background: '#fff', border: '1px solid #dee2e6', borderRadius: '8px', display: 'flex', flexDirection: 'column', height: '520px', boxShadow: '0 4px 6px rgba(0,0,0,0.03)' }}>
        {complaint && (
          <div style={{ padding: '0.8rem 1.2rem', borderBottom: '1px solid #e9ecef', background: '#f8f9fa', display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#495057' }}>
            <div>
              <strong>Lodge by:</strong> {complaint.name}
            </div>
            <div>
              <strong>Assigned Agent:</strong> {complaint.agent ? `${complaint.agent.firstName} ${complaint.agent.lastName}` : 'Unassigned'}
            </div>
          </div>
        )}

        <div className="chat-messages" style={{ flex: '1', overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          {messages.map((m) => {
            const isMe = user && m.sender?._id === user.id;
            const senderName = m.sender ? `${m.sender.firstName} ${m.sender.lastName}` : 'System';
            return (
              <div
                key={m._id}
                style={{
                  alignSelf: isMe ? 'flex-end' : 'flex-start',
                  background: isMe ? '#007bff' : '#f1f3f5',
                  color: isMe ? '#fff' : '#212529',
                  padding: '0.6rem 1rem',
                  borderRadius: '12px',
                  maxWidth: '70%',
                  borderBottomRightRadius: isMe ? '2px' : '12px',
                  borderBottomLeftRadius: isMe ? '12px' : '2px',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                }}
              >
                {!isMe && (
                  <div style={{ fontSize: '0.75rem', color: '#007bff', fontWeight: 'bold', marginBottom: '0.2rem' }}>
                    {senderName} ({m.sender?.role})
                  </div>
                )}
                <div style={{ fontSize: '0.95rem' }}>{m.text}</div>
                <div style={{ fontSize: '0.65rem', color: isMe ? 'rgba(255,255,255,0.7)' : '#6c757d', marginTop: '0.25rem', textAlign: 'right' }}>
                  {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {complaint && complaint.status === 'closed' ? (
          <div style={{ padding: '1rem', textAlign: 'center', color: '#6c757d', borderTop: '1px solid #e9ecef', background: '#f8f9fa', fontSize: '0.9rem' }}>
            This ticket is closed. Chat is archived.
          </div>
        ) : (
          <form onSubmit={handleSendMessage} style={{ padding: '1rem', borderTop: '1px solid #e9ecef', display: 'flex', gap: '0.8rem' }}>
            <input
              type="text"
              placeholder="Type your message..."
              style={{ flex: '1', padding: '0.6rem 0.8rem', border: '1px solid #ced4da', borderRadius: '4px', fontSize: '0.95rem', outline: 'none' }}
              value={text}
              onChange={(e) => setText(e.target.value)}
              required
            />
            <button type="submit" style={{ background: '#007bff', color: '#fff', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Send size={16} />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ChatRoom;
