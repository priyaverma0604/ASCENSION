const Contact = require('../models/Contact');
const sendEmail = require('../utils/sendEmail');

// @desc    Submit a contact form query
// @route   POST /api/contacts
// @access  Public
exports.submitContact = async (req, res, next) => {
  try {
    const { name, email, phone, message, transactionId } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and message' });
    }

    // Capture paymentScreenshot if uploaded
    let paymentScreenshot = '';
    if (req.file) {
      const { isCloudinaryConfigured } = require('../config/cloudinary');
      paymentScreenshot = isCloudinaryConfigured ? req.file.path : `/uploads/${req.file.filename}`;
    }

    const contact = await Contact.create({
      name,
      email,
      phone: phone || '',
      message,
      transactionId: transactionId || undefined,
      paymentScreenshot: paymentScreenshot || undefined
    });

    // Check if this is a Service Booking Request
    const isServiceBooking = message.includes('[SERVICE BOOKING REQUEST:');

    // Send email notification to Admin
    const adminEmail = process.env.ADMIN_EMAIL || 'ascension.sonalibhasin@gmail.com';
    const emailSubject = isServiceBooking 
      ? `New Paid Service Booking Request from ${name}` 
      : `New Contact Form Query from ${name}`;
    
    let emailText = `You have received a new query on the Ascension Platform.\n\nDetails:\nName: ${name}\nEmail: ${email}\nPhone: ${phone || 'N/A'}\nMessage: ${message}`;
    if (transactionId) {
      emailText += `\nTransaction ID: ${transactionId}`;
    }
    if (paymentScreenshot) {
      emailText += `\nPayment Proof: ${paymentScreenshot}`;
    }
    emailText += `\n\nReview this in the Admin Dashboard at /admin`;

    try {
      await sendEmail({
        to: adminEmail,
        subject: emailSubject,
        text: emailText
      });
    } catch (mailError) {
      console.error('Failed to send email notification:', mailError.message);
    }

    // If this is a Service Booking, send confirmation email & WhatsApp details to the USER
    if (isServiceBooking) {
      // 1. Send confirmation email to the user
      const userSubject = `Confirmation: Your Service Booking Request with Ascension`;
      const userText = `Dear ${name},\n\nBlessings! Your service booking request has been successfully submitted.\n\nDetails of Service:\n${message}\n\nTransaction Reference ID: ${transactionId || 'N/A'}\n\nOur team is verifying your payment details. Once verified, we will contact you to schedule your final slot.\n\nWarm regards,\nAscension by Sonali Bhasin Kumar`;
      
      try {
        await sendEmail({
          to: email,
          subject: userSubject,
          text: userText
        });
      } catch (mailError) {
        console.error('Failed to send user email notification:', mailError.message);
      }

      // 2. Simulated WhatsApp sending to the user
      console.log('--------------------------------------------------');
      console.log('--- SIMULATED WHATSAPP NOTIFICATION SENT TO USER ---');
      console.log(`To: ${phone}`);
      console.log(`From (Ascension): +91 89290 61557`);
      console.log(`Message: Dear ${name}, your booking request for the service has been received! We will verify transaction ${transactionId || 'N/A'} and confirm your slot. Blessings!`);
      console.log('--------------------------------------------------');
    }

    res.status(201).json({
      success: true,
      message: isServiceBooking 
        ? 'Your booking request and payment details have been submitted successfully. Confirmation sent via email!'
        : 'Your query has been submitted successfully. We will get back to you shortly!',
      data: contact
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all contact queries (Admin only)
// @route   GET /api/contacts
// @access  Private/Admin
exports.getQueries = async (req, res, next) => {
  try {
    const queries = await Contact.find({}).sort({ createdAt: -1 });
    res.json({ success: true, count: queries.length, data: queries });
  } catch (error) {
    next(error);
  }
};

// @desc    Update query status (Admin only)
// @route   PUT /api/contacts/:id/status
// @access  Private/Admin
exports.updateQueryStatus = async (req, res, next) => {
  try {
    const query = await Contact.findById(req.params.id);
    if (!query) {
      return res.status(404).json({ success: false, message: 'Query not found' });
    }

    const { status } = req.body;
    if (!status || !['unread', 'read', 'resolved'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Please provide valid status: unread, read, or resolved' });
    }

    const oldStatus = query.status;
    query.status = status;
    await query.save();

    // Check if status is updated to 'resolved' and this is a Service Booking Request
    const isServiceBooking = query.message && query.message.includes('[SERVICE BOOKING REQUEST:');
    if (status === 'resolved' && oldStatus !== 'resolved' && isServiceBooking) {
      
      // 1. Send confirmation email to the user
      const userSubject = `Confirmed: Your Service Booking Payment is Approved`;
      const userText = `Dear ${query.name},\n\nBlessings! Your payment for the service booking has been successfully verified and approved.\n\nDetails of Service:\n${query.message}\n\nWe will reach out to you shortly to coordinate and schedule your final session slot.\n\nWarm regards,\nAscension by Sonali Bhasin Kumar`;
      
      try {
        await sendEmail({
          to: query.email,
          subject: userSubject,
          text: userText
        });
      } catch (mailError) {
        console.error('Failed to send user approval confirmation email:', mailError.message);
      }

      // 2. Simulated WhatsApp sending from 8929061557 to user
      console.log('--------------------------------------------------');
      console.log('--- AUTOMATED WHATSAPP CONFIRMATION SENT TO USER ---');
      console.log(`To: ${query.phone}`);
      console.log(`From (Ascension): +91 89290 61557`);
      console.log(`Message: Dear ${query.name}, your payment for the service booking has been verified and approved successfully! We will coordinate with you shortly to schedule your final slot. Blessings!`);
      console.log('--------------------------------------------------');
    }

    res.json({ success: true, message: `Query status updated to ${status}`, data: query });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all booked slots
// @route   GET /api/contacts/booked-slots
// @access  Public
exports.getBookedSlots = async (req, res, next) => {
  try {
    const bookings = await Contact.find({
      message: { $regex: '\\[SERVICE BOOKING REQUEST:', $options: 'i' }
    });

    const bookedSlots = bookings.map(booking => {
      const lines = booking.message.split('\n');
      const firstLine = lines[0] || '';
      const secondLine = lines[1] || '';
      
      const serviceTitle = firstLine.replace('[SERVICE BOOKING REQUEST: ', '').replace(']', '').trim();
      const slot = secondLine.replace('Preferred Date: ', '').trim();
      
      return { serviceTitle, slot };
    }).filter(item => item.serviceTitle && item.slot);

    res.json({ success: true, data: bookedSlots });
  } catch (error) {
    next(error);
  }
};

