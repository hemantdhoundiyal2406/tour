const express = require('express');
const router = express.Router();
const Article = require('../models/Article');
const upload = require('../multer/upload');
const multer = require('multer');
const slugify = require('slugify');

// Get all articles (Dashboard)
router.get('/all-article', async (req, res) => {
    try {
        const articlesData = await Article.find();
        res.render('admin/all-article', { articlesData });
    } catch (error) {
        console.log(error);
        res.status(500).send("Error loading dashboard");
    }
});

// Get Add Article Page
router.get('/add-article', async (req, res) => {
    try {
        const articlesData = await Article.find();
        res.render('admin/add-article', { articlesData });
    } catch (error) {
        console.log(error);   
    }
});

// Add Article (POST)
router.put('/edit-article/:id', upload.fields([
  { name: 'articleImage', maxCount: 1 },
  { name: 'articleBannerImage', maxCount: 1 },
]), async (req, res) => {
  try {
    // 🔍 1. Get existing article
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).send("Article not found");
    }

    // 🧾 2. Prepare update data
    const updateData = {
      articleTitle: req.body.articleTitle || article.articleTitle,
      articleSubTitle: req.body.articleSubTitle || article.articleSubTitle,
      articleBody: req.body.articleBody || article.articleBody,
      articleImage: article.articleImage,
      articleBannerImage: article.articleBannerImage,
      slug: req.body.articleTitle
        ? slugify(req.body.articleTitle, { lower: true, strict: true })
        : article.slug,
      updatedAt: new Date(),
    };

    // 🖼️ 3. Update image fields if new files uploaded
    if (req.files?.articleImage?.[0]) {
      updateData.articleImage = req.files.articleImage[0].filename;
    }

    if (req.files?.articleBannerImage?.[0]) {
      updateData.articleBannerImage = req.files.articleBannerImage[0].filename;
    }

    // 💾 4. Update in DB
    await Article.findByIdAndUpdate(req.params.id, updateData);

    res.redirect('/all-article');
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).send("Server Error");
  }
});


  


// ✅ Get Edit Article Page
router.get('/edit-article/:id', async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);
        res.render('admin/edit-article', { article });
    } catch (error) {
        console.log(error);
        res.status(500).send("Error loading article");
    }
});

// ✅ Update Article (POST or PUT)
router.put('/edit-article/:id', upload.fields([
  { name: 'articleImage', maxCount: 1 },
  { name: 'articleBannerImage', maxCount: 1 },
]), async (req, res) => {
  try {
    // 1️⃣ Get existing post
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).send("Post not found");
    }

    // 2️⃣ Debugging: log uploaded files
    console.log("FILES RECEIVED:", req.files);

    // 3️⃣ Prepare updateData
    const updateArticleData = {
    
      articleTitle: req.body.articleTitle || article.title,
      articleSubTitle: req.body.articleSubTitle || article.articleSubTitle,
      articleBody: req.body.articleBody || article.articleBody,
      articleImage: article.articleImage,
      articleBannerImage: article.articleBannerImage,
      slug: slugify(req.body.title, { lower: true, strict: true }),  // <-- Yaha slug add kia
      createdAt: new Date(),
    };

    // 4️⃣ Check and update images if uploaded
    if (req.files?.articleImage?.[0]) {
      updateArticleData.articleImage = req.files.image[0].filename;
    }

    if (req.files?.articleBannerImage?.[0]) {
      updateArticleData.articleBannerImage = req.files.articleBannerImage[0].filename;
    }

    // 5️⃣ Update post
    await Article.findByIdAndUpdate(req.params.id, updateArticleData);

    res.redirect("/all-article");
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).send("Server Error");
  }
});
  

  

// ✅ Delete Article
router.get('/delete-article/:id', async (req, res) => {
    try {
        await Article.findByIdAndDelete(req.params.id);
        res.redirect('/all-article');
    } catch (error) {
        console.log(error);
        res.status(500).send("Error deleting article");
    }
});

// ✅ Copy Article (Duplicate)
// ✅ Copy Article (Duplicate)
router.get('/copy-article/:slug', async (req, res) => {
    try {
        const article = await Article.findById(req.params.slug);

        const copiedArticle = new Article({
            articleTitle: article.articleTitle + ' (Copy)',
            articleSubTitle: article.articleSubTitle,
            articleBody: article.articleBody, // Ensure body is copied
            articleImage: article.articleImage,
            articleBannerImage: article.articleBannerImage,
            slug: slugify(article.articleTitle + '-copy', { lower: true, strict: true }),
            createdAt: new Date()
        });

        await copiedArticle.save();
        res.redirect('/all-article'); // You had /dashboard, but your list view seems to be /all-article
    } catch (error) {
        console.log(error);
        res.status(500).send("Error copying article");
    }
});


module.exports = router;
