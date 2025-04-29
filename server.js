const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve front-end
app.use(express.static(path.join(__dirname, 'public')));

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// Models
const User = require('./models/User');
const Retailer = require('./models/Retailer');
const Shop = require('./models/Shop');
const Product = require('./models/Product');

// JWT utilities
const jwt = require('jsonwebtoken');
function generateToken(id, type) {
  return jwt.sign({ id, type }, process.env.JWT_SECRET, { expiresIn: '1d' });
}

// Middleware to protect retailer routes
function authRetailer(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
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

// Register a new user
app.post('/api/users/register', async (req, res) => {
    const { email, password } = req.body;
    // Check for existing
    if (await User.findOne({ email })) {
      return res.status(400).json({ message: 'Email already in use' });
    }
    // Create & hash password in model pre-save
    const user = await User.create({ email, password });
    const token = generateToken(user._id, 'user');
    res.status(201).json({ token });
  });
  

// Routes
// User login
app.post('/api/users/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const token = generateToken(user._id, 'user');
  res.json({ token });
});

// Retailer login
app.post('/api/retailers/login', async (req, res) => {
  const { email, password } = req.body;
  const retailer = await Retailer.findOne({ email });
  if (!retailer || !(await retailer.comparePassword(password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const token = generateToken(retailer._id, 'retailer');
  res.json({ token });
});

// Create Shop
app.post('/api/shops', authRetailer, async (req, res) => {
  const shop = await Shop.create({
    name: req.body.name,
    description: req.body.description,
    retailer: req.retailerId
  });
  res.json(shop);
});

// Add Product
app.post('/api/products', authRetailer, async (req, res) => {
  const product = await Product.create({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    imageUrl: req.body.imageUrl || '',
    retailer: req.retailerId
  });
  res.json(product);
});

// View Retailer's Products
app.get('/api/products', authRetailer, async (req, res) => {
  const products = await Product.find({ retailer: req.retailerId });
  res.json(products);
});

// Featured Products
app.get('/api/products/featured', async (req, res) => {
  const products = await Product.find().limit(4);
  res.json(products);
});

// Fallback to front-end
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));