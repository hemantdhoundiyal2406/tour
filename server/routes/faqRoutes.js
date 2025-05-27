const express = require('express');
const router = express.Router();
const FAQ = require('../models/FAQ');
const slugify = require('slugify');

// Authentication middleware
function isAuthenticated(req, res, next) {
  if (req.session.user) {
    return next();
  }
  res.redirect('/login');
  
}

router.get('/dashboard', async (req, res) => {
  try {
    const faqs = await FAQ.find();
    res.render('admin/dashboard', { faqs });
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal Server Error');
  }
});


// get all
router.get('/all-faq', async (req, res) => {
  try {
    const faqs = await FAQ.find()
    res.render('admin/all-faq', { faqs });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Show all FAQs in Admin Panel
router.get('/add-faq', async (req, res) => {
  try {
    const faqs = await FAQ.find();
    res.render('admin/add-faq', { faqs });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Create new FAQ
router.post('/add-faq', async (req, res) => {
  try {
    const { question, answer } = req.body;
    const slug = slugify(question, { lower: true, strict: true });
    await FAQ.create({ question, answer, slug });
    res.redirect('/add-faq');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Get edit FAQ page
router.get('/edit-faq/:id', async (req, res) => {
  try {
    const faq = await FAQ.findById(req.params.id);
    res.render('/edit-faq', { faq });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Update FAQ
router.post('/edit-faq/:id', async (req, res) => {
  try {
    const { question, answer } = req.body;
    const slug = slugify(question, { lower: true, strict: true });
    await FAQ.findByIdAndUpdate(req.params.id, { question, answer, slug, updatedAt: Date.now() });
    res.redirect('/add-faq');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Delete FAQ
router.get('/delete-faq/:id', async (req, res) => {
  try {
    await FAQ.findByIdAndDelete(req.params.id);
    res.redirect('/add-faq');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
