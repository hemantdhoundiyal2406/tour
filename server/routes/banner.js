const express = require('express');
const router = express.Router();
const HeaderImage = require('../models/Banner');
const upload = require('../multer/upload');



router.get('/dashboard', async (req, res) => {
    try {
        const bannerImage = await HeaderImage.find();
        res.render('admin/add-bannner', { bannerImage });
    } catch (error) {
        console.log(error);
        res.status(500).send("Error loading dashboard");
    }
});

router.get('/add-banner', async (req, res) => {
    try {
        const bannerImage = await HeaderImage.find();
        res.render('admin/add-banner', { bannerImage });
    } catch (error) {
        console.log(error);   
    }
});


router.post('/add-banner', upload.fields([
    { name: 'headerBannerImage_1', maxCount: 1 },
]), async (req, res) => {
    try {
        const existing = await HeaderImage.findOne(); // get first banner
        const image = req.files['headerBannerImage_1']?.[0]?.filename || '';

        if (existing) {
            // Update existing banner
            existing.headerBannerImage_1 = image;
            await existing.save();
        } else {
            // Create new if none exists
            const newHeaderImage = new HeaderImage({
                headerBannerImage_1: image,
            });
            await newHeaderImage.save();
        }

        res.redirect('/dashboard');
    } catch (error) {
        console.log(error);
        res.status(500).send("Server Error");
    }
});



router.get('/edit-banner/:id', async (req, res) => {
    try {
     const bannerImage = await HeaderImage.findOne({ _id: req.params.id });
  
  
   res.render('admin/edit-banner', { bannerImage, 
  
    });
    } catch (error) {
      console.log(error);
      res.status(500).send("Server Error");
    }
  });




module.exports = router;
