const express = require('express')
const router = express.Router();
const Destinations  = require('../models/Destinations');
const upload = require('../multer/upload');
const multer = require('multer');
const slugify = require('slugify');




function isAuthenticated(req, res, next) {
  if (req.session.user) {
    return next();
  }
  res.redirect('/login');
}


router.get('/dashboard', isAuthenticated, async (req, res) => {
  try {
    const destinationsdata = await Destinations.find();
    res.render('admin/dashboard', { destinationsdata });
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal Server Error');
  }
});

// get all post

router.get('/all-destinations', async (req, res) => {
  try {
    const destinationsdata = await Destinations.find();
    res.render('admin/all-destinations', { destinationsdata });
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
});


// get add-post
router.get('/add-destinations', async(req, res) =>{
    try {
        const destinationsdata = await Destinations.find()
        res.render('admin/add-destinations', { destinationsdata})
        
    } catch (error) {
        console.log(error);  
    }
})


// POSt add-post
router.post('/add-destinations', upload.fields([
  { name: 'Destinationsimage', maxCount: 1 },
  { name: 'DestinationsbannerImage', maxCount: 1 },
]), async (req, res) => {
  try {
    const newDestinations = new Destinations( {
      Destinationstitle: req.body.Destinationstitle,
      Destinationsbody: req.body.Destinationsbody,
      Destinationsimage: req.files['Destinationsimage'][0].filename,
      DestinationsbannerImage: req.files['DestinationsbannerImage'][0].filename,
      slug: slugify(req.body.Destinationstitle, { lower: true, strict: true })  // <-- Yaha slug add kia
    });

    await newDestinations.save();
    
    res.redirect('/all-destinations');
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
});


// get edit-post
router.get('/edit-destinations/:id', async (req, res) => {
  try {
   const destinationsdata = await Destinations.findOne({ _id: req.params.id });


 res.render('admin/edit-destinations', { destinationsdata, 

  });
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
});

  
// update put edit-post

router.put('/edit-destinations/:id', upload.fields([
  { name: 'Destinationsimage', maxCount: 1 },
  { name: 'DestinationsbannerImage', maxCount: 1 },
]), async (req, res) => {
  try {
    const destinationsdata = await Destinations.findById(req.params.id);
    if (!destinationsdata) {
      return res.status(404).send("Post not found");
    }

    const updatedestinationsdata = {
      Destinationstitle: req.body.Destinationstitle || destinationsdata.Destinationstitle,
      Destinationsbody: req.body.Destinationsbody || destinationsdata.Destinationsbody,
      slug: slugify(req.body.Destinationstitle || destinationsdata.Destinationstitle, { lower: true, strict: true }),
      updatedAt: Date.now(),
      Destinationsimage: destinationsdata.Destinationsimage,
      DestinationsbannerImage: destinationsdata.DestinationsbannerImage,
    };

    if (req.files?.Destinationsimage?.[0]) {
      updatedestinationsdata.Destinationsimage = req.files.Destinationsimage[0].filename;
    }

    if (req.files?.DestinationsbannerImage?.[0]) {
      updatedestinationsdata.DestinationsbannerImage = req.files.DestinationsbannerImage[0].filename;
    }

    await Destinations.findByIdAndUpdate(req.params.id, updatedestinationsdata);

    res.redirect("/dashboard");
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).send("Server Error");
  }
});






// delete post
router.get('/delete-destinations/:id', async (req, res) => {
  try {
    await Destinations.findByIdAndDelete(req.params.id);
    res.redirect('/all-destinations'); // Redirect after deletion
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
});






router.get('/copy-destination/:id', async (req, res) => {
  try {
    const destination = await Destinations.findById(req.params.id);

    if (!destination) {
      return res.status(404).send("Destination not found");
    }

    const copiedDestination = new Destinations({
      Destinationstitle: destination.Destinationstitle + ' (Copy)',
      Destinationsbody: destination.Destinationsbody,
      Destinationsimage: destination.Destinationsimage,
      DestinationsbannerImage: destination.DestinationsbannerImage,
      slug: slugify(destination.Destinationstitle + '-copy', { lower: true, strict: true }),
      createdAt: new Date()
    });

    await copiedDestination.save();
    res.redirect('/all-destinations');
  } catch (error) {
    console.error(error);
    res.status(500).send("Error copying destination");
  }
});







module.exports = router;