const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Contact = require('../models/Contact');

// Signup
router.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: 'User exists' });

  const user = new User({ email, password }); // by default isAdmin: false
  await user.save();
  res.status(201).json({ message: 'Signup successful' });
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && user.password === password) {
    req.session.userId = user._id;
    req.session.isAdmin = user.isAdmin || false; // ✅ store isAdmin

    res.status(200).json({ 
      message: 'Login successful',
      isAdmin: user.isAdmin || false // ✅ return isAdmin to frontend
    });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login.html');
  });
});

// Save contact form
router.post('/contact', async (req, res) => {
  if (!req.session.userId) return res.status(401).json({ message: 'Not logged in' });

  const { name, email, message } = req.body;
  const contact = new Contact({
    name,
    email,
    message,
    userId: req.session.userId
  });

  await contact.save();
  res.status(200).json({ message: 'Contact saved' });
});

// Get user contacts
router.get('/mycontacts', async (req, res) => {
  if (!req.session.userId) return res.status(401).json({ message: 'Not logged in' });

  const contacts = await Contact.find({ userId: req.session.userId });
  res.status(200).json(contacts);
});

// ✅ Session check route (optional)
router.get('/me', (req, res) => {
  console.log('👀 /api/auth/me hit, session:', req.session);
  res.json({
    userId: req.session.userId || null,
    isAdmin: req.session.isAdmin || false
  });
});

module.exports = router;
