const express = require('express')
const router = express.Router();
const Post = require('../models/Post');
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
    const data = await Post.find();
    res.render('admin/dashboard', { data });
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal Server Error');
  }
});

// get all post

router.get('/all-post', async (req, res) => {
  try {
    const data = await Post.find()
    res.render('admin/all-post', { data})
    
} catch (error) {
    console.log(error);  
}
});

// get add-post
router.get('/add-post', async(req, res) =>{
    try {
        const data = await Post.find()
        res.render('admin/add-post', { data})
        
    } catch (error) {
        console.log(error);  
    }
})


// POSt add-post
router.post('/add-post', upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'bannerImage', maxCount: 1 },
]), async (req, res) => {
  try {
    const newPost = new Post( {
      title: req.body.title,
      body: req.body.body,
      image: req.files['image'][0].filename,
      bannerImage: req.files['bannerImage'][0].filename,
      slug: slugify(req.body.title, { lower: true, strict: true })  // <-- Yaha slug add kia
    });

    await newPost.save();
    
    res.redirect('/dashboard');
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
});


// get edit-post
router.get('/edit-post/:id', async (req, res) => {
  try {
   const data = await Post.findOne({ _id: req.params.id });


 res.render('admin/edit-post', { data, 

  });
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
});

  
// update put edit-post
router.put('/edit-post/:id', upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'bannerImage', maxCount: 1 },
]), async (req, res) => {
  try {
    // 1️⃣ Get existing post
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).send("Post not found");
    }

    // 2️⃣ Debugging: log uploaded files
    console.log("FILES RECEIVED:", req.files);

    // 3️⃣ Prepare updateData
    const updateData = {
      title: req.body.title || post.title,
      body: req.body.body || post.body,
      updatedAt: Date.now(),
      image: post.image,
      bannerImage: post.bannerImage,
    };

    // 4️⃣ Check and update images if uploaded
    if (req.files?.image?.[0]) {
      updateData.image = req.files.image[0].filename;
    }

    if (req.files?.bannerImage?.[0]) {
      updateData.bannerImage = req.files.bannerImage[0].filename;
    }

    // 5️⃣ Update post
    await Post.findByIdAndUpdate(req.params.id, updateData);

    res.redirect("/dashboard");
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).send("Server Error");
  }
});






// delete post
router.get('/delete-post/:id', async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.redirect('/all-post'); // Redirect after deletion
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
});



// copy
router.post('/copy-post/:id', async (req, res) => {
  try {
    console.log("Request to copy post with ID:", req.params.id);

    // Find the original post by ID
    const originalPost = await Post.findById(req.params.id).lean();
    if (!originalPost) {
      console.log("Original post not found");
      return res.status(404).send('Post not found');
    }

    // Destructure to exclude _id and create new post data
    const { _id, ...copiedData } = originalPost;
    copiedData.title = `${copiedData.title} (Copy)`; // Append "(Copy)" to the title

    // Create and save the new post
    const newPost = new Post(copiedData);
    await newPost.save();

    console.log("Post copied successfully");
    res.status(200).send('Post copied');
  } catch (err) {
    console.error("Error copying post:", err);
    res.status(500).send('Error copying post');
  }
});




module.exports = router;