require('dotenv').config();
const express = require('express');
const sanitizeHtml = require('sanitize-html');
const multer = require('multer');
const expressLayouts = require('express-ejs-layouts')
const ConnectDB = require('./server/DataBase/db');  
const methodOverride = require('method-override');
const session = require('express-session');





const app = express();
const PORT = process.env.PORT || 3000;



// Required for req.body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// db 
ConnectDB();



app.use(express.static('public'));
app.use(methodOverride('_method'));


app.use(session({
    secret: 'yourSecretKey',
    resave: false,
    saveUninitialized: false,
  }));

  app.use(session({
    secret: 'yourSecretKey',
    resave: false,
    saveUninitialized: false,
  }));

// Template engine
app.use(expressLayouts);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs')
app.use('/', require('./server/routes/main'))
app.use('/', require('./server/routes/admin'))  
app.use('/', require('./server/routes/articleAdmin')) 
app.use('/', require('./server/routes/banner')) 
app.use('/', require('./server/routes/auth')) 
app.use('/', require('./server/routes/Destinations')) 
app.use('/', require('./server/routes/faqRoutes')) 
app.use('/', require('./server/routes/email')) 


app.use('/', require('./server/routes/view-destinations'));





app.listen(PORT, ()=>{  // Changed from 'prototype' to 'PORT'
    console.log(`Server is running on port http://localhost:/${PORT}`);
});