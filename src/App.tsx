import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AddShop from './pages/AddShop';
import AddProduct from './pages/AddProduct';
import Cart from './pages/Cart';
import CheckAvailability from './pages/CheckAvailability';
import RetailerDashboard from './pages/RetailerDashboard';
import './styles/App.css';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="app">
            <Header />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/add-shop" element={<AddShop />} />
                <Route path="/add-product" element={<AddProduct />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/check-availability" element={<CheckAvailability />} />
                <Route path="/retailer-dashboard" element={<RetailerDashboard />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
