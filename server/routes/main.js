const express = require('express')
const router = express.Router();
const Post = require('../models/Post');
const Destinations  = require('../models/Destinations');
const Article = require('../models/Article');
const HeaderImage = require('../models/Banner');
const slugify = require('slugify');
const FAQ = require('../models/FAQ');



 
// Get All Posts
router.get('', async (req, res) => {
    try {
      const articlesData = await Article.find();
      const data = await Post.find();
      const destinationsdata = await Destinations.find();
      const headerBannerImage = await HeaderImage.find();
      const faqs = await FAQ.find();
      

      res.render('index', {
        articlesData,
        data,
        headerBannerImage,
        destinationsdata,
        faqs
      });

        
    } catch (err) {
      console.log(err);
      res.status(500).send("Server Error");
    }
  });
  


// Get Single Post// Get Single Post
router.get("/post/:slug", async (req, res) => {
  try {
      const slug = req.params.slug;
      
      // Post model se slug ke basis pe data fetch karna
      const data = await Post.findOne({ slug: slug });

      // Articles data (agar alag se fetch karna ho)
      const articlesData = await Article.find();

      // Render karte waqt dono data ko bhej rahe hain
      res.render('post', { data, articlesData });
  }
  catch (error) {
      console.log(error);
      res.status(500).send("Server Error");
  }
});



router.get("/single-Article/:slug", async (req, res) => {
  try {
    const slug = req.params.slug;

    const singleArticle = await Article.findOne({ slug: slug }); // returns a single document, not an array

    const articlesData = await Article.find();

    res.render('single-Article', { singleArticle, articlesData });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

// destination
router.get("/destinations/:slug", async (req, res) => {
  try {
    const slug = req.params.slug;

    // Destination model se slug ke basis pe data fetch karna
    const destinationsdata = await Destinations.findOne({ slug: slug });

     const data = await Post.find();

    // Articles data (agar alag se fetch karna ho)
    const articlesData = await Article.find();
   

    const faqs = await FAQ.find();

    // Render karte waqt dono data ko bhej rahe hain
    res.render('destinations', { destinationsdata, articlesData, data, faqs});
    
  }
  catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
});


// 









// POst All Posts
router.post("", async (req, res) => {
  try {
      const data = await Post.find();


      // Yeh sirf example hai, articleData ko aapke project ke logic ke hisab se laana padega
      const articlesData = await Article.find(); // ya koi aur query jo aap chahte hain


       const destinationsdata = await Destinations.find();

      res.render('index', { data, articlesData, destinationsdata });
  } catch (error) {
      console.log(error);
  }
});



  


module.exports = router; 