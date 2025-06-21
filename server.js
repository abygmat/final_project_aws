const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();
const app = express();

// ✅ CORS (for frontend on localhost)
app.use(cors({
  origin: 'http://localhost:3000', // update if using a different port
  credentials: true
}));

// ✅ Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Session config
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false,        // ⚠️ Keep false for HTTP (localhost)
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  }
}));

// ✅ Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// ✅ MongoDB connection
mongoose.connect(process.env.MONGO_URI, { dbName: 'awswebpage' })
  .then(() => {
    console.log('✅ Connected to MongoDB');
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch(err => console.error('❌ DB Connection Error:', err));

// ✅ Route files
const authRoutes = require('./routes/auth');
const contactRoutes = require('./routes/contact');
const orderRoutes = require('./routes/order');

app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/orders', orderRoutes);

// ✅ Middleware to protect login-required pages
function isAuthenticated(req, res, next) {
  if (req.session.userId) next();
  else res.redirect('/login.html');
}

// ✅ Admin-only middleware
function isAdmin(req, res, next) {
  if (req.session.isAdmin) next();
  else res.status(403).send('⛔ Access denied: Admins only');
}

// ✅ General protected pages (like home.html)
app.get('/protected/:page', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, `public/protected/${req.params.page}`));
});

// ✅ Admin-protected page
app.get('/protected/admin.html', isAuthenticated, isAdmin, (req, res) => {
  res.sendFile(path.join(__dirname, 'public/protected/admin.html'));
});

// ✅ Debug route to check session (optional)
app.get('/api/debug/session', (req, res) => {
  res.json({ session: req.session });
});

// ✅ Default route
app.get('/', (req, res) => {
  res.redirect('/login.html');
});

// ✅ Upload routes
const uploadRoutes = require('./routes/upload');
app.use('/api', uploadRoutes);

// ✅ Product routes
const productRoutes = require('./routes/product');
app.use('/api', productRoutes);
