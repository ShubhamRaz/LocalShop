const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

dotenv.config();
const app = express();

// CORS configuration for React development
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? false 
    : ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from React build in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'build')));
}

// In-memory data storage (for demo purposes - replace with a real database later)
const users = [];
const retailers = [];
const shops = [];
const products = [];

// JWT helper
function generateToken(id, type) {
  return jwt.sign({ id, type }, process.env.JWT_SECRET, { expiresIn: '1d' });
}

// Middleware to protect retailer routes
function authRetailer(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.type !== 'retailer') throw new Error();
    req.retailerId = decoded.id;
    next();
  } catch {
    res.status(401).json({ message: 'Unauthorized' });
  }
}

// ── User Registration ──
app.post('/api/users/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (users.find(u => u.email === email)) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = { 
      id: Date.now().toString(), 
      email, 
      password: hashedPassword 
    };
    users.push(user);
    const token = generateToken(user.id, 'user');
    res.status(201).json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Registration failed' });
  }
});

// ── User Login ──
app.post('/api/users/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email);
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });
    const token = generateToken(user.id, 'user');
    res.json({ token });
  } catch {
    res.status(500).json({ message: 'Login failed' });
  }
});

// ── Retailer Registration ──
app.post('/api/retailers/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (retailers.find(r => r.email === email)) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const retailer = { 
      id: Date.now().toString(), 
      email, 
      password: hashedPassword 
    };
    retailers.push(retailer);
    const token = generateToken(retailer.id, 'retailer');
    res.status(201).json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Registration failed' });
  }
});

// ── Retailer Login ──
app.post('/api/retailers/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const retailer = retailers.find(r => r.email === email);
    if (!retailer) return res.status(401).json({ message: 'Invalid credentials' });
    const isMatch = await bcrypt.compare(password, retailer.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });
    const token = generateToken(retailer.id, 'retailer');
    res.json({ token });
  } catch {
    res.status(500).json({ message: 'Login failed' });
  }
});

// ── Create Shop ──
app.post('/api/shops', authRetailer, (req, res) => {
  try {
    const shop = {
      id: Date.now().toString(),
      name: req.body.name,
      description: req.body.description,
      retailer: req.retailerId
    };
    shops.push(shop);
    res.json(shop);
  } catch {
    res.status(500).json({ message: 'Error creating shop' });
  }
});

// ── Add Product ──
app.post('/api/products', authRetailer, (req, res) => {
  try {
    const product = {
      _id: Date.now().toString(),
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      imageUrl: req.body.imageUrl || '',
      retailer: req.retailerId
    };
    products.push(product);
    res.json(product);
  } catch {
    res.status(500).json({ message: 'Error adding product' });
  }
});

// ── View Retailer's Products ──
app.get('/api/products', authRetailer, (req, res) => {
  try {
    const retailerProducts = products.filter(p => p.retailer === req.retailerId);
    res.json(retailerProducts);
  } catch {
    res.status(500).json({ message: 'Error fetching products' });
  }
});

// ── Featured Products ──
app.get('/api/products/featured', (req, res) => {
  res.json(products.slice(0, 4));
});

// Serve React app for all non-API routes (production only)
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✓ Server running on http://localhost:${PORT}`);
  console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`✓ React dev server should run on http://localhost:3000`);
  console.log(`✓ Using in-memory storage (data will reset on restart)`);
});
