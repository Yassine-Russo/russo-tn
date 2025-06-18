// server.js
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Your Gmail credentials (use App Password if you have 2FA)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'russotn0@gmail.com',
    pass: 'tjqg bwjx cgkj kwvs' // Get this from your Gmail account (App password)
  }
});

// POST endpoint to send email
app.post('/send', (req, res) => {
  const { name, email, message } = req.body;

  const mailOptions = {
    from: email,
    to: 'russotn0@gmail.com',
    subject: `Message from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\n\n${message}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).json({ success: false, error: error.toString() });
    }
    res.json({ success: true, message: 'Email sent successfully!' });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
