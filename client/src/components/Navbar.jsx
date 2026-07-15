import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <h1>Care</h1>
      <div className="nav-links">
        <Link to="/">Home</Link>
        {user?.role === 'Admin' && (
          <>
            <Link to="/admin">Complaints</Link>
            <Link to="/admin/customers">Customers</Link>
            <Link to="/admin/agents">Agents</Link>
          </>
        )}
        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
