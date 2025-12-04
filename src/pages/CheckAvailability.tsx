import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { searchShopsByCartItems } from '../services/api';
import { ShopWithProducts } from '../types';
import '../styles/CheckAvailability.css';

const CheckAvailability: React.FC = () => {
  const navigate = useNavigate();
  const { cart } = useCart();
  const [results, setResults] = useState<ShopWithProducts[]>([]);

  useEffect(() => {
    if (cart.length === 0) {
      navigate('/cart');
      return;
    }
    const shopResults = searchShopsByCartItems(cart);
    setResults(shopResults);
  }, [cart, navigate]);

  const getCartItemNames = () => {
    return cart.map(item => item.productName).join(', ');
  };

  return (
    <div className="availability-page">
      <div className="availability-container">
        <h1>Shop Availability</h1>
        <p className="subtitle">Finding shops with your cart items: <strong>{getCartItemNames()}</strong></p>

        {results.length === 0 ? (
          <div className="no-results">
            <p>No shops found with these items in stock.</p>
            <button onClick={() => navigate('/')} className="primary-btn">
              Browse More Products
            </button>
          </div>
        ) : (
          <div className="shops-list">
            {results.map(({ shop, products, availableItems, hasAllItems }) => (
              <div key={shop.id} className={`shop-availability-card ${hasAllItems ? 'all-items' : ''}`}>
                <div className="shop-header">
                  <div>
                    <h2>{shop.name}</h2>
                    <span className="shop-category">{shop.category}</span>
                  </div>
                  {hasAllItems && (
                    <span className="all-items-badge">✓ All Items Available</span>
                  )}
                </div>

                <div className="shop-info">
                  <p>📍 {shop.location}</p>
                  <p>📞 {shop.phone}</p>
                </div>

                <div className="availability-status">
                  <h3>Available Items ({availableItems}/{cart.length}):</h3>
                  <div className="available-products">
                    {products.map(product => (
                      <div key={product.id} className="available-product">
                        <span className="product-name">✓ {product.name}</span>
                        <span className="product-price">₹{product.price}</span>
                        <span className="product-qty">Qty: {product.quantity}</span>
                      </div>
                    ))}
                  </div>

                  {!hasAllItems && (
                    <div className="missing-items">
                      <p className="warning">⚠️ Not all items available at this shop</p>
                    </div>
                  )}
                </div>

                <div className="shop-actions">
                  <button className="visit-btn">Visit Shop</button>
                  <button className="delivery-btn">Request Home Delivery</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckAvailability;
