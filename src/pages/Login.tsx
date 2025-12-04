import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Auth.css';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [userType, setUserType] = useState<'customer' | 'retailer'>('customer');
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(formData.email, formData.password, userType);
      navigate(userType === 'retailer' ? '/retailer-dashboard' : '/');
    } catch (err) {
      setError('Invalid credentials. Try retailer1@shop.com for retailer login.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1>Login</h1>
        <p className="subtitle">Welcome back! Please login to your account</p>

        <div className="user-type-toggle">
          <button
            className={userType === 'customer' ? 'active' : ''}
            onClick={() => setUserType('customer')}
          >
            Customer
          </button>
          <button
            className={userType === 'retailer' ? 'active' : ''}
            onClick={() => setUserType('retailer')}
          >
            Retailer
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password *</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" className="submit-btn">Login</button>
        </form>

        <p className="auth-footer">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>

        {userType === 'retailer' && (
          <div className="demo-credentials">
            <p><strong>Demo Retailer Logins:</strong></p>
            <p>retailer1@shop.com to retailer20@shop.com (any password)</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
