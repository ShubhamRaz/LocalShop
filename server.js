const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error(err));

// Models
const User     = require('./models/User');
const Retailer = require('./models/Retailer');
const Shop     = require('./models/Shop');
const Product  = require('./models/Product');

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
    if (await User.findOne({ email })) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    const user = new User({ email, password });
    await user.save();
    const token = generateToken(user._id, 'user');
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
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });
    const token = generateToken(user._id, 'user');
    res.json({ token });
  } catch {
    res.status(500).json({ message: 'Login failed' });
  }
});


// ── Retailer Registration ──
app.post('/api/retailers/register', async (req, res) => {
    try {
      const { email, password } = req.body;
      if (await Retailer.findOne({ email })) {
        return res.status(400).json({ message: 'Email already exists' });
      }
      const retailer = new Retailer({ email, password });
      await retailer.save();
      const token = generateToken(retailer._id, 'retailer');
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
    const retailer = await Retailer.findOne({ email });
    if (!retailer) return res.status(401).json({ message: 'Invalid credentials' });
    const isMatch = await bcrypt.compare(password, retailer.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });
    const token = generateToken(retailer._id, 'retailer');
    res.json({ token });
  } catch {
    res.status(500).json({ message: 'Login failed' });
  }
});

// ── Create Shop ──
app.post('/api/shops', authRetailer, async (req, res) => {
  try {
    const shop = await Shop.create({
      name: req.body.name,
      description: req.body.description,
      retailer: req.retailerId
    });
    res.json(shop);
  } catch {
    res.status(500).json({ message: 'Error creating shop' });
  }
});

// ── Add Product ──
app.post('/api/products', authRetailer, async (req, res) => {
  try {
    const product = await Product.create({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      imageUrl: req.body.imageUrl || '',
      retailer: req.retailerId
    });
    res.json(product);
  } catch {
    res.status(500).json({ message: 'Error adding product' });
  }
});

// ── View Retailer's Products ──
app.get('/api/products', authRetailer, async (req, res) => {
  try {
    const products = await Product.find({ retailer: req.retailerId });
    res.json(products);
  } catch {
    res.status(500).json({ message: 'Error fetching products' });
  }
});

// ── Featured Products ──
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
