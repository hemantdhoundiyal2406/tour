const express = require('express');
const router = express.Router();
const Destinations  = require('../models/Destinations');

// Route: /view-destinations
router.get("/view-destinations", async (req, res) => {
  try {
   
    const destinationsdata = await Destinations.find(); // ye array return karega
    res.render('view-destinations', { destinationsdata });
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
