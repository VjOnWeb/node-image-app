// backend.js
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');

const app = express();
const port = 6868;

app.use(bodyParser.json());

// Set up multer for handling file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static('uploads'));

// API endpoints
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend.html'));
});

// API endpoints
app.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, 'contact.html'));
});

app.post('/upload', upload.single('image'), (req, res) => {
  res.send('Image uploaded successfully!');
});

app.get('/images', (req, res) => {
  fs.readdir('uploads/', (err, files) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json(files);
  });
});

// API endpoint to delete an image
app.delete('/images/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join('uploads', filename);

  fs.unlink(filePath, (err) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.send('Image deleted successfully!');
  });
});

// Node Mailer
// Middleware to parse incoming request bodies
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Nodemailer transporter configuration
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // upgrade later with STARTTLS
    auth: {
      user: "vijayanandvj1998@gmail.com",
      pass: "ezjj lfjk mdlp xczg "
    },
  });

// Route to handle form submission
app.post('/send-email', (req, res) => {
  const { name, email, number, message, sendCopy } = req.body;

  // Array to store recipient emails
  let recipients = ['vijayanandextra@gmail.com'];
  // Add email to recipients if checkbox is checked
  if (sendCopy) {
      recipients.push(email);
  }

  const mailOptions = {
      from: 'vijayanandvj1998@gmail.com',
      to: recipients.join(', '), // Join recipient emails with comma
      subject: 'New Contact Form Submission',
      text: `
          Name: ${name}
          Email: ${email}
          Phone Number: ${number}
          Message: ${message}
      `
  };
    console.log("Success Message Sent :" + mailOptions.messageId);


    // Send mail
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error occurred:', error);
            res.status(500).send('An error occurred while sending the email.');
        } else {
            console.log('Email sent:', info.response);
            res.status(200).send('Email sent successfully!');
        }
    });
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


//http://localhost:6868
//http://localhost:6868/contact