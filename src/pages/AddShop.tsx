import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { addShop } from '../services/api';
import '../styles/AddShop.css';

const AddShop: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    phone: '',
    category: ''
  });

  useEffect(() => {
    if (!isAuthenticated || user?.type !== 'retailer') {
      alert('Please login as a retailer to add shops');
      navigate('/login');
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    addShop({
      ...formData,
      retailerId: user.id
    });
    alert('Shop added successfully!');
    navigate('/');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="add-shop-page">
      <div className="add-shop-container">
        <h1>Register Your Shop</h1>
        <p className="subtitle">List your shop and products online for local customers</p>
        
        <form onSubmit={handleSubmit} className="shop-form">
          <div className="form-group">
            <label htmlFor="name">Shop Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="location">Location/Address *</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g., Main Street, Downtown"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number *</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="e.g., 555-0101"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category *</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select Category</option>
              <option value="Grocery">Grocery</option>
              <option value="Electronics">Electronics</option>
              <option value="Clothing">Clothing</option>
              <option value="Pharmacy">Pharmacy</option>
              <option value="Bakery">Bakery</option>
              <option value="Hardware">Hardware</option>
              <option value="Books">Books & Stationery</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <button type="submit" className="submit-btn">Register Shop</button>
        </form>
      </div>
    </div>
  );
};

export default AddShop;
