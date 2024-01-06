const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "utsavvasoya99@gmail.com",
    pass: "hntqedkgfgzpbxtd",
  },
});

router.post("/", async (req, res) => {
  await transporter.sendMail(
    {
      to: "utsavvasoya99@gmail.com", // Use req.body.email directly as a string
      subject: `Contact Me`,
      text: `Name: ${req.body.name} email: ${req.body.email} message: ${req.body.message} c: ${req.body.subject}`,
      html: `<p> 
              <h1> CONTACT US: canvas stocks query </h1>
              <hr>
              Name: ${req.body.name}
              <hr> 
              email: ${req.body.email}
              <hr> 
              Subject: ${req.body.subject}
              <hr> 
              Message: ${req.body.message}
              <hr>
              <br> 
            </p>`,
    },
    (err, info) => {
      if (err) {
        res.status(500).send({
          success: false,
          message: "Mail Send Error",
        });
      } else {
        res.status(201).send({
          success: true,
          message: "Contact Mail Send!!",
        });
      }
    }
  );
});

module.exports = router;