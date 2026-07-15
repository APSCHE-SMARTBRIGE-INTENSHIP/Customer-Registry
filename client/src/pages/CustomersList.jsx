import { useState, useEffect } from 'react';
import api from '../utils/api';

const CustomersList = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await api.get('/auth/customers');
      setCustomers(res.data);
    } catch (error) {
      console.error('Failed to fetch customers', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container animate-fade-in">
      <h2 style={{ marginBottom: '1.5rem' }}>All Customers</h2>
      {loading ? <p>Loading...</p> : (
        <div className="grid">
          {customers.length === 0 ? <p>No customers found.</p> : customers.map(customer => (
            <div key={customer._id} className="card">
              <h3 style={{ marginBottom: '0.5rem', color: 'var(--primary-color)' }}>
                {customer.firstName} {customer.lastName}
              </h3>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                <p><strong>Username:</strong> {customer.username}</p>
                <p><strong>Email:</strong> {customer.email}</p>
                <p><strong>Joined:</strong> {new Date(customer.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomersList;
