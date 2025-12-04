import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getShopsByRetailer, getProductsByShop, addProduct } from '../services/api';
import { Shop, Product } from '../types';
import '../styles/Dashboard.css';

const RetailerDashboard: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [shops, setShops] = useState<Shop[]>([]);
  const [selectedShop, setSelectedShop] = useState<string>('');
  const [products, setProducts] = useState<Product[]>([]);
  const [showProductForm, setShowProductForm] = useState(false);
  const [productForm, setProductForm] = useState({
    name: '',
    price: '',
    description: '',
    quantity: '',
    inStock: true
  });

  const loadShops = React.useCallback(() => {
    if (user) {
      const retailerShops = getShopsByRetailer(user.id);
      setShops(retailerShops);
      if (retailerShops.length > 0) {
        setSelectedShop(retailerShops[0].id);
        loadProducts(retailerShops[0].id);
      }
    }
  }, [user]);

  useEffect(() => {
    if (!isAuthenticated || user?.type !== 'retailer') {
      navigate('/login');
      return;
    }
    loadShops();
  }, [isAuthenticated, user, navigate, loadShops]);

  const loadProducts = (shopId: string) => {
    const shopProducts = getProductsByShop(shopId);
    setProducts(shopProducts);
  };

  const handleShopChange = (shopId: string) => {
    setSelectedShop(shopId);
    loadProducts(shopId);
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedShop) {
      alert('Please select a shop');
      return;
    }

    addProduct({
      name: productForm.name,
      shopId: selectedShop,
      price: parseFloat(productForm.price),
      description: productForm.description,
      quantity: parseInt(productForm.quantity),
      inStock: productForm.inStock
    });

    setProductForm({
      name: '',
      price: '',
      description: '',
      quantity: '',
      inStock: true
    });
    setShowProductForm(false);
    loadProducts(selectedShop);
    alert('Product added successfully!');
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <h1>Retailer Dashboard</h1>
        <p className="welcome-text">Welcome, {user?.name}!</p>

        {shops.length === 0 ? (
          <div className="no-shops">
            <p>You don't have any shops yet.</p>
            <button onClick={() => navigate('/add-shop')} className="primary-btn">
              Register Your Shop
            </button>
          </div>
        ) : (
          <>
            <div className="shop-selector">
              <label htmlFor="shop-select">Select Shop:</label>
              <select
                id="shop-select"
                value={selectedShop}
                onChange={(e) => handleShopChange(e.target.value)}
              >
                {shops.map(shop => (
                  <option key={shop.id} value={shop.id}>
                    {shop.name} - {shop.location}
                  </option>
                ))}
              </select>
            </div>

            <div className="products-section">
              <div className="section-header">
                <h2>Products ({products.length})</h2>
                <button
                  onClick={() => setShowProductForm(!showProductForm)}
                  className="add-btn"
                >
                  {showProductForm ? 'Cancel' : '+ Add Product'}
                </button>
              </div>

              {showProductForm && (
                <form onSubmit={handleProductSubmit} className="product-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="name">Product Name *</label>
                      <input
                        type="text"
                        id="name"
                        value={productForm.name}
                        onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="price">Price (₹) *</label>
                      <input
                        type="number"
                        id="price"
                        value={productForm.price}
                        onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
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
                        value={productForm.quantity}
                        onChange={(e) => setProductForm({ ...productForm, quantity: e.target.value })}
                        min="1"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                      id="description"
                      value={productForm.description}
                      onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                      rows={3}
                    />
                  </div>

                  <div className="form-group checkbox-group">
                    <label>
                      <input
                        type="checkbox"
                        checked={productForm.inStock}
                        onChange={(e) => setProductForm({ ...productForm, inStock: e.target.checked })}
                      />
                      <span>In Stock</span>
                    </label>
                  </div>

                  <button type="submit" className="submit-btn">Add Product</button>
                </form>
              )}

              <div className="products-grid">
                {products.length === 0 ? (
                  <p className="no-products">No products yet. Add your first product!</p>
                ) : (
                  products.map(product => (
                    <div key={product.id} className="product-card">
                      <h3>{product.name}</h3>
                      <p className="product-price">₹{product.price}</p>
                      {product.description && (
                        <p className="product-desc">{product.description}</p>
                      )}
                      <div className="product-meta">
                        <span className="quantity">Qty: {product.quantity}</span>
                        <span className={`stock-badge ${product.inStock ? 'in-stock' : 'out-stock'}`}>
                          {product.inStock ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RetailerDashboard;
