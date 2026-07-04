const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
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

  // Create SMTP transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: false, // true for 465, false for other ports
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
  console.log(`Email sent successfully: ${info.messageId}`);
  return info;
};

module.exports = sendEmail;
