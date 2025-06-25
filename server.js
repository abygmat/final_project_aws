// Load environment variables from .env
require('dotenv').config();
console.log("MONGODB_URI is:", process.env.MONGODB_URI);

const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const cors = require('cors');
const path = require('path');

const app = express();

// ✅ CORS (adjust if using a different frontend port)
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// ✅ Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Session setup
app.use(session({
  secret: 'your_secret_key', // you can also move this to .env
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false, // true if using HTTPS
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  }
}));

// ✅ Serve static frontend files
app.use(express.static(path.join(__dirname, 'public')));

// ✅ MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: 'awswebpage2'
})
  .then(() => {
    console.log('✅ Connected to MongoDB');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch(err => console.error('❌ DB Connection Error:', err));

// ✅ Load route files
const authRoutes = require('./routes/auth');
const contactRoutes = require('./routes/contact');
const orderRoutes = require('./routes/order');
const uploadRoutes = require('./routes/upload');
const productRoutes = require('./routes/product');

app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api', uploadRoutes);
app.use('/api', productRoutes);

// ✅ Middleware: check if user is logged in
function isAuthenticated(req, res, next) {
  if (req.session.userId) return next();
  return res.redirect('/login.html');
}

// ✅ Middleware: check if user is admin
function isAdmin(req, res, next) {
  if (req.session.isAdmin) return next();
  return res.status(403).send('⛔ Access denied: Admins only');
}

// ✅ Protected pages
app.get('/protected/:page', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, `public/protected/${req.params.page}`));
});

// ✅ Admin-protected page
app.get('/protected/admin.html', isAuthenticated, isAdmin, (req, res) => {
  res.sendFile(path.join(__dirname, 'public/protected/admin.html'));
});

// ✅ Debug: check session info
app.get('/api/debug/session', (req, res) => {
  res.json({ session: req.session });
});

// ✅ Default route
app.get('/', (req, res) => {
  res.redirect('/login.html');
});
