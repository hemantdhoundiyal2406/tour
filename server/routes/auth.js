const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const router = express.Router();

// ✅ GET: Login Page
router.get('/login', (req, res) => {
  res.render('auth/login');
});

// ✅ POST: Handle Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.send('Invalid username or password');
    }

    req.session.user = user; // set session
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// ✅ GET: Register Page
router.get('/register', (req, res) => {
  res.render('auth/register');
});

// ✅ POST: Handle Registration
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.send('Username already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });

    await newUser.save();
    req.session.user = newUser; // Auto-login
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// ✅ GET: Logout
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});


router.post('/logout', (req, res) => {
  res.clearCookie('token'); // clear JWT cookie
  res.redirect('/login');   // redirect to login
});

module.exports = router;


