import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import '../styles/Header.css';

const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <h1>🏪 LocalShop Finder</h1>
        </Link>
        <nav className="nav">
          <Link to="/" className="nav-link">Search</Link>
          
          {isAuthenticated ? (
            <>
              {user?.type === 'retailer' ? (
                <>
                  <Link to="/retailer-dashboard" className="nav-link">Dashboard</Link>
                  <Link to="/add-shop" className="nav-link">Add Shop</Link>
                </>
              ) : (
                <Link to="/cart" className="nav-link cart-link">
                  Cart {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                </Link>
              )}
              <span className="user-name">Hi, {user?.name}</span>
              <button onClick={handleLogout} className="nav-link logout-btn">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="nav-link">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
