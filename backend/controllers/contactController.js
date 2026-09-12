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

    const { status, recommendedCrystal, crystalBenefits, adminReplyMessage } = req.body;
    if (!status || !['unread', 'read', 'resolved'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Please provide valid status: unread, read, or resolved' });
    }

    const oldStatus = query.status;
    query.status = status;

    if (recommendedCrystal !== undefined) {
      query.recommendedCrystal = recommendedCrystal;
    }
    if (crystalBenefits !== undefined) {
      query.crystalBenefits = crystalBenefits;
    }
    if (adminReplyMessage !== undefined) {
      query.adminReplyMessage = adminReplyMessage;
    }
    if (status === 'resolved') {
      query.resolvedAt = new Date();
    }

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

    // Check if a Crystal was recommended or if this is a Horoscope / Aura Customization Request
    const isHoroscopeRequest = query.message && (
      query.message.includes('[HOROSCOPE') || 
      query.message.includes('HOROSCOPE') || 
      query.message.includes('AURA PHOTO')
    );

    const crystalToRecommend = recommendedCrystal || query.recommendedCrystal;

    if (status === 'resolved' && (crystalToRecommend || (isHoroscopeRequest && adminReplyMessage))) {
      const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
      const shopUrl = `${clientUrl}/shop?tab=shop`;

      const userSubject = `Your Personalised Crystal Recommendation from Ascension ✨`;

      const finalCrystal = crystalToRecommend || 'Custom Consecrated Energy Crystal';
      const finalBenefits = crystalBenefits || query.crystalBenefits || '';
      const finalAdvice = adminReplyMessage || query.adminReplyMessage || '';

      const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #fcfbf9; color: #2c2a29; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #ede8df; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
    .header { background: linear-gradient(135deg, #1c2826 0%, #2c3e3a 100%); color: #ffffff; padding: 32px 24px; text-align: center; }
    .header h1 { margin: 0; font-size: 24px; font-weight: 700; color: #d4af37; letter-spacing: 1.5px; }
    .header p { margin: 6px 0 0 0; font-size: 11px; color: #e0d8c3; text-transform: uppercase; letter-spacing: 2px; }
    .content { padding: 32px 28px; line-height: 1.6; }
    .greeting { font-size: 16px; font-weight: 600; color: #2c2a29; margin-bottom: 12px; }
    .intro { font-size: 13.5px; color: #55524f; margin-bottom: 24px; }
    .crystal-card { background: #faf7f2; border: 1.5px solid #d4af37; border-radius: 14px; padding: 22px; margin: 20px 0; box-shadow: 0 2px 10px rgba(212,175,55,0.08); }
    .crystal-label { font-size: 10.5px; text-transform: uppercase; font-weight: 700; color: #a3821a; letter-spacing: 1.5px; margin-bottom: 4px; }
    .crystal-title { font-size: 19px; font-weight: 700; color: #1c2826; margin: 0 0 12px 0; }
    .crystal-section { margin-top: 12px; }
    .section-title { font-size: 11.5px; font-weight: 700; color: #333; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 3px; }
    .section-desc { font-size: 13px; color: #4a4846; line-height: 1.55; margin: 0; }
    .cta-btn { display: inline-block; background: #d4af37; color: #1c2826 !important; font-weight: 700; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; padding: 14px 28px; border-radius: 8px; text-decoration: none; margin: 24px 0 10px 0; text-align: center; }
    .footer { background: #f7f4ee; padding: 20px; text-align: center; font-size: 11px; color: #8c8883; border-top: 1px solid #ede8df; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>ASCENSION</h1>
      <p>Personalised Horoscope & Aura Crystal Reading</p>
    </div>
    <div class="content">
      <div class="greeting">Dear ${query.name},</div>
      <div class="intro">
        Thank you for submitting your horoscope coordinates and facial aura energy details. Sonali Bhasin Kumar and our intuitive energy coaches have analyzed your vibration and planetary resonance to curate your personalized sacred crystal recommendation:
      </div>

      <div class="crystal-card">
        <div class="crystal-label">Your Tailored Energy Stone</div>
        <div class="crystal-title">💎 ${finalCrystal}</div>
        
        ${finalBenefits ? `
        <div class="crystal-section">
          <div class="section-title">✨ Spiritual & Astrological Benefits:</div>
          <p class="section-desc">${finalBenefits}</p>
        </div>` : ''}

        ${finalAdvice ? `
        <div class="crystal-section" style="margin-top: 16px; border-top: 1px dashed #dcd3c3; padding-top: 12px;">
          <div class="section-title">🔮 Guidance from Sonali Bhasin:</div>
          <p class="section-desc" style="font-style: italic;">"${finalAdvice}"</p>
        </div>` : ''}
      </div>

      <p style="font-size: 13px; color: #55524f; line-height: 1.5;">
        Every crystal bracelet and spiritual item at Ascension is cleared under sacred smoke, blessed with Vedic vibrations, and energized specifically to harmonize with your aura.
      </p>

      <div style="text-align: center;">
        <a href="${shopUrl}" class="cta-btn">Explore & Order Your Crystal at Ascension &rarr;</a>
      </div>

      <p style="font-size: 12px; color: #7a7672; margin-top: 20px; line-height: 1.5;">
        Need assistance with sizing or bespoke astrological customization? Simply reply to this email or reach us on WhatsApp at <strong>+91 89290 61557</strong>.
      </p>
    </div>
    <div class="footer">
      <p style="margin: 0 0 4px 0;"><strong>Ascension by Sonali Bhasin Kumar</strong></p>
      <p style="margin: 0;">Healing • Mindfulness • Astrological Harmonization • Delhi, India</p>
    </div>
  </div>
</body>
</html>
      `;

      const userText = `Dear ${query.name},\n\nThank you for submitting your horoscope and facial aura energy details. Sonali Bhasin Kumar and our intuitive energy coaches have curated your personalized crystal recommendation:\n\nRecommended Crystal: ${finalCrystal}\n${finalBenefits ? `Benefits: ${finalBenefits}\n` : ''}${finalAdvice ? `Guidance from Sonali: ${finalAdvice}\n` : ''}\n\nExplore our shop at ${shopUrl} to find or order your energized crystal.\n\nBlessings & Light,\nAscension by Sonali Bhasin Kumar`;

      try {
        await sendEmail({
          to: query.email,
          subject: userSubject,
          text: userText,
          html: emailHtml
        });
        console.log(`Crystal recommendation email successfully sent to ${query.email} for crystal: ${finalCrystal}`);
      } catch (mailError) {
        console.error('Failed to send crystal recommendation email:', mailError.message);
      }
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

// @desc    Initiate Razorpay order for Service Booking
// @route   POST /api/contacts/razorpay-order
// @access  Public
exports.createServiceOrder = async (req, res, next) => {
  try {
    const crypto = require('crypto');
    const { razorpayInstance, isRazorpayConfigured } = require('../config/razorpay');
    const { amount, serviceTitle, name, email, phone, slot } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid service amount' });
    }

    let orderResponseId = `mock_order_${crypto.randomBytes(6).toString('hex')}`;
    if (isRazorpayConfigured && razorpayInstance) {
      const options = {
        amount: Math.round(amount * 100), // paise
        currency: 'INR',
        receipt: `rcpt_srv_${crypto.randomBytes(4).toString('hex')}`
      };
      const order = await razorpayInstance.orders.create(options);
      orderResponseId = order.id;
    }

    res.json({
      success: true,
      data: {
        orderId: orderResponseId,
        amount: Math.round(amount * 100),
        currency: 'INR'
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify Razorpay payment for Service Booking
// @route   POST /api/contacts/verify-booking
// @access  Public
exports.verifyServicePayment = async (req, res, next) => {
  try {
    const crypto = require('crypto');
    const { isRazorpayConfigured } = require('../config/razorpay');
    const { 
      razorpay_payment_id, 
      razorpay_order_id, 
      razorpay_signature,
      bookingDetails 
    } = req.body;

    if (!bookingDetails) {
      return res.status(400).json({ success: false, message: 'Booking details missing' });
    }

    if (isRazorpayConfigured) {
      if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
        return res.status(400).json({ success: false, message: 'Payment signature missing' });
      }
      const body = razorpay_order_id + '|' + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest('hex');

      if (expectedSignature !== razorpay_signature) {
        return res.status(400).json({ success: false, message: 'Payment verification failed' });
      }
    }

    const { name, email, phone, serviceTitle, slot, message, amount } = bookingDetails;
    const formattedMessage = `[SERVICE BOOKING REQUEST: ${serviceTitle}]\nPreferred Date: ${slot}\nPayment ID: ${razorpay_payment_id}\nNotes: ${message || ''}`;

    const contact = await Contact.create({
      name,
      email: email.toLowerCase(),
      phone: phone || '',
      message: formattedMessage,
      transactionId: razorpay_payment_id,
      status: 'Approved'
    });

    // Send confirmation emails
    const adminEmail = process.env.ADMIN_EMAIL || 'ascension.sonalibhasin@gmail.com';
    try {
      await sendEmail({
        to: adminEmail,
        subject: `Paid Service Booking: ${serviceTitle} (${name})`,
        text: `A new session has been paid online via Razorpay!\n\nService: ${serviceTitle}\nClient: ${name}\nEmail: ${email}\nPhone: ${phone}\nSlot: ${slot}\nPayment ID: ${razorpay_payment_id}\nAmount: ₹${amount}`
      });

      await sendEmail({
        to: email.toLowerCase(),
        subject: `Confirmed: ${serviceTitle} Session with Ascension`,
        text: `Dear ${name},\n\nThank you! Your payment of ₹${amount} for "${serviceTitle}" has been received and confirmed.\n\nSlot: ${slot}\nPayment ID: ${razorpay_payment_id}\n\nOur team will reach out to you shortly before your session.\n\nWarm regards,\nAscension by Sonali Bhasin Kumar`
      });
    } catch (e) {
      console.error('Email error:', e.message);
    }

    res.json({
      success: true,
      message: 'Service session booked and confirmed successfully!',
      data: contact
    });
  } catch (error) {
    next(error);
  }
};

