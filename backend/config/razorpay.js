const Razorpay = require('razorpay');

// 1. Commercial Ascension Instance (Services, Programs, Shop, Webinars, Workshops, Retreats)
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
    console.log('Razorpay Commercial client (Services, Programs, Shop, Webinars) loaded successfully.');
  } catch (error) {
    console.error('Error initializing Razorpay Commercial client:', error.message);
  }
}

// 2. Ascension Seva (NGO / Donations) Dedicated Instance
const isRazorpaySevaConfigured = 
  process.env.RAZORPAY_SEVA_KEY_ID && 
  process.env.RAZORPAY_SEVA_KEY_ID !== 'your_seva_key_id' &&
  process.env.RAZORPAY_SEVA_KEY_ID !== 'rzp_test_sevaKeyId123';

let razorpaySevaInstance = null;

if (isRazorpaySevaConfigured) {
  try {
    razorpaySevaInstance = new Razorpay({
      key_id: process.env.RAZORPAY_SEVA_KEY_ID,
      key_secret: process.env.RAZORPAY_SEVA_KEY_SECRET
    });
    console.log('Razorpay Ascension Seva client loaded successfully.');
  } catch (error) {
    console.error('Error initializing Razorpay Seva client:', error.message);
  }
}

module.exports = {
  razorpayInstance,
  isRazorpayConfigured,
  razorpaySevaInstance,
  isRazorpaySevaConfigured
};
