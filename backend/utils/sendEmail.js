const nodemailer = require('nodemailer');
const axios = require('axios');

const sendEmail = async (options) => {
  // 1. If Resend API Key is configured, use Resend API (HTTP-based, never blocked by Render)
  if (process.env.RESEND_API_KEY) {
    try {
      const fromEmail = process.env.EMAIL_SENDER || 'bookings@ascension.ind.in';
      const response = await axios.post(
        'https://api.resend.com/emails',
        {
          from: `"Ascension by Sonali" <${fromEmail}>`,
          to: [options.to],
          subject: options.subject,
          html: options.html || `<p>${options.text}</p>`
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );
      console.log(`Email sent successfully via Resend API: ${response.data.id}`);
      return response.data;
    } catch (err) {
      console.error('Resend API email sending failed, trying SMTP fallback:', err.response?.data || err.message);
      // Fallback to SMTP if Resend API call fails
    }
  }

  const isMailConfigured = 
    process.env.EMAIL_USER && 
    process.env.EMAIL_USER !== 'your_email@gmail.com' &&
    process.env.EMAIL_PASS && 
    process.env.EMAIL_PASS !== 'app_password_here';

  if (!isMailConfigured) {
    console.log('--- SIMULATED EMAIL ---');
    console.log(`To: ${options.to}`);
    console.log(`Subject: ${options.subject}`);
    console.log(`Body:\n${options.text}`);
    console.log('------------------------');
    return { simulated: true };
  }

  const port = parseInt(process.env.EMAIL_PORT) || 587;
  const secure = port === 465;

  // Create SMTP transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: port,
    secure: secure,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: `"Ascension by Sonali" <${process.env.EMAIL_USER}>`,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html || `<p>${options.text}</p>`
  };

  const info = await transporter.sendMail(mailOptions);
  console.log(`Email sent successfully via SMTP: ${info.messageId}`);
  return info;
};

module.exports = sendEmail;
