import React, { useState } from 'react';
import { searchProducts } from '../services/api';
import { useCart } from '../context/CartContext';
import { ShopWithProducts, Product } from '../types';
import '../styles/Home.css';

const Home: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<ShopWithProducts[]>([]);
  const [searched, setSearched] = useState(false);
  const { addToCart } = useCart();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const searchResults = searchProducts(searchQuery);
      setResults(searchResults);
      setSearched(true);
    }
  };

  const handleAddToCart = (product: Product, shopName: string) => {
    addToCart({
      productId: product.id,
      productName: product.name,
      price: product.price,
      quantity: 1,
      shopId: product.shopId,
      shopName
    });
    alert(`${product.name} added to cart!`);
  };

  return (
    <div className="home-page">
      <div className="hero-section">
        <h1>Find Products from Local Shops</h1>
        <p className="hero-subtitle">Search products and discover nearby shops</p>
        
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search for products... (e.g., tomatoes, mouse)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-btn">Search</button>
        </form>
      </div>

      <div className="results-container">
        {searched && results.length === 0 && (
          <div className="no-results">
            <p>No products found for "{searchQuery}"</p>
            <p className="suggestion">Try different keywords or ask shops to add products</p>
          </div>
        )}

        {results.map(({ shop, products }) => (
          <div key={shop.id} className="shop-card">
            <div className="shop-header">
              <h2>{shop.name}</h2>
              <span className="shop-category">{shop.category}</span>
            </div>
            <div className="shop-info">
              <p>📍 {shop.location}</p>
              <p>📞 {shop.phone}</p>
            </div>
            
            <div className="products-list">
              <h3>Available Products:</h3>
              {products.map(product => (
                <div key={product.id} className="product-item">
                  <div className="product-details">
                    <h4>{product.name}</h4>
                    {product.description && <p className="product-desc">{product.description}</p>}
                  </div>
                  <div className="product-price-section">
                    <span className="product-price">₹{product.price}</span>
                    <span className={`stock-badge ${product.inStock ? 'in-stock' : 'out-stock'}`}>
                      {product.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                    {product.inStock && (
                      <button
                        onClick={() => handleAddToCart(product, shop.name)}
                        className="add-cart-btn"
                      >
                        Add to Cart
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
