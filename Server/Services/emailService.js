// File: services/emailService.js

const sgMail = require("@sendgrid/mail");
require("dotenv").config();

sgMail.setApiKey(process.env.SENDGRID_KEY);

const sendOtpEmail = async (email) => {
  const otp = Math.floor(100000 + Math.random() * 900000);
  const msg = {
    to: email,
    from: "aamirfarooqbhatt@gmail.com", // replace with verified sender
    subject: "Your OTP for Password Change",
    html: `
      <h2>Hello User</h2>
      <h3>Your OTP: <strong>${otp}</strong></h3>
      <p>This OTP will expire in 5 minutes. Do not share it with anyone.</p>
      <p>Thank you,<br/>Team Tutor Connect</p>
    `,
  };

  await sgMail.send(msg);
  return otp;
};

module.exports = { sendOtpEmail };
