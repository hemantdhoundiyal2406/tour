const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");

const email = express(); // 👈 renamed from `app` to `email`
email.use(bodyParser.json()); // Middleware to parse JSON

// Newsletter subscription route
email.post("/subscribe", async (req, res) => {
  const { email: userEmail } = req.body; // destructure and rename to avoid conflict

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "yourgmail@gmail.com",       // Replace with your Gmail
      pass: "your_app_password",         // Replace with your Gmail app password
    },
  });

  const mailOptions = {
    from: "yourgmail@gmail.com",
    to: "yourgmail@gmail.com",          // Email where you want to receive updates
    subject: "New Newsletter Subscriber",
    text: `New subscriber email: ${userEmail}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ message: "Thank you for subscribing!" });
  } catch (error) {
    console.error("Email failed:", error);
    res.status(500).json({ message: "Something went wrong!" });
  }
});

module.exports = email; // 👈 exported as `email`
