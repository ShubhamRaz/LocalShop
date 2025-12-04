import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import '../styles/Cart.css';

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount } = useCart();

  const handleCheckAvailability = () => {
    if (cart.length === 0) {
      alert('Your cart is empty');
      return;
    }
    navigate('/check-availability');
  };

  return (
    <div className="cart-page">
      <div className="cart-container">
        <h1>Shopping Cart ({cartCount} items)</h1>

        {cart.length === 0 ? (
          <div className="empty-cart">
            <p>Your cart is empty</p>
            <button onClick={() => navigate('/')} className="primary-btn">
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cart.map(item => (
                <div key={item.productId} className="cart-item">
                  <div className="item-details">
                    <h3>{item.productName}</h3>
                    <p className="shop-name">From: {item.shopName}</p>
                    <p className="item-price">₹{item.price} each</p>
                  </div>

                  <div className="item-actions">
                    <div className="quantity-control">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="qty-btn"
                      >
                        -
                      </button>
                      <span className="quantity">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="qty-btn"
                      >
                        +
                      </button>
                    </div>

                    <p className="item-total">₹{item.price * item.quantity}</p>

                    <button
                      onClick={() => removeFromCart(item.productId)}
                      className="remove-btn"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <div className="summary-row">
                <span>Subtotal:</span>
                <span className="total-amount">₹{cartTotal}</span>
              </div>

              <div className="cart-actions">
                <button onClick={clearCart} className="clear-btn">
                  Clear Cart
                </button>
                <button onClick={handleCheckAvailability} className="check-btn">
                  Check Shop Availability
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
