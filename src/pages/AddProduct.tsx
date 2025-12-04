import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { addProduct, getAllShops } from '../services/api';
import { Shop } from '../types';
import '../styles/AddProduct.css';

const AddProduct: React.FC = () => {
  const navigate = useNavigate();
  const [shops, setShops] = useState<Shop[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    shopId: '',
    price: '',
    description: '',
    quantity: '1',
    inStock: true
  });

  useEffect(() => {
    const loadShops = () => {
      const allShops = getAllShops();
      setShops(allShops);
    };
    loadShops();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.shopId) {
      alert('Please select a shop');
      return;
    }
    addProduct({
      ...formData,
      price: parseFloat(formData.price),
      quantity: parseInt(formData.quantity),
      inStock: formData.inStock
    });
    alert('Product added successfully!');
    navigate('/');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  return (
    <div className="add-product-page">
      <div className="add-product-container">
        <h1>Add Product</h1>
        <p className="subtitle">Add products to your shop inventory</p>
        
        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-group">
            <label htmlFor="shopId">Select Shop *</label>
            <select
              id="shopId"
              name="shopId"
              value={formData.shopId}
              onChange={handleChange}
              required
            >
              <option value="">Choose a shop</option>
              {shops.map(shop => (
                <option key={shop.id} value={shop.id}>
                  {shop.name} - {shop.location}
                </option>
              ))}
            </select>
            {shops.length === 0 && (
              <p className="info-text">No shops found. Please add a shop first.</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="name">Product Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Fresh Tomatoes"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="price">Price (₹) *</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              min="0"
              step="0.01"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="quantity">Quantity *</label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              min="1"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder="Product details..."
            />
          </div>

          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="inStock"
                checked={formData.inStock}
                onChange={handleChange}
              />
              <span>In Stock</span>
            </label>
          </div>

          <button type="submit" className="submit-btn">Add Product</button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
