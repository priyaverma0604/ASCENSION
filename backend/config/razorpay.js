const Razorpay = require('razorpay');

const isRazorpayConfigured = 
  process.env.RAZORPAY_KEY_ID && 
  process.env.RAZORPAY_KEY_ID !== 'your_razorpay_key_id' &&
  process.env.RAZORPAY_KEY_ID !== 'rzp_test_ascensionKeyId123';

let razorpayInstance = null;

if (isRazorpayConfigured) {
  try {
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });
    console.log('Razorpay client loaded successfully.');
  } catch (error) {
    console.error('Error initializing Razorpay client:', error.message);
  }
} else {
  console.warn('WARNING: Razorpay credentials not configured. Payment transactions will run in simulation mode.');
}

module.exports = {
  razorpayInstance,
  isRazorpayConfigured
};
