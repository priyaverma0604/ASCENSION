const Workshop = require('../models/Workshop');
const WorkshopRegistration = require('../models/WorkshopRegistration');
const sendEmail = require('../utils/sendEmail');
const { isCloudinaryConfigured } = require('../config/cloudinary');
const { razorpayInstance, isRazorpayConfigured } = require('../config/razorpay');
const crypto = require('crypto');

// @desc    Get all workshops
// @route   GET /api/workshops
// @access  Public
exports.getWorkshops = async (req, res, next) => {
  try {
    const workshops = await Workshop.find({}).sort({ date: 1 });
    res.json({ success: true, count: workshops.length, data: workshops });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single workshop details
// @route   GET /api/workshops/:id
// @access  Public
exports.getWorkshopById = async (req, res, next) => {
  try {
    const workshop = await Workshop.findById(req.params.id);
    if (!workshop) {
      return res.status(404).json({ success: false, message: 'Workshop not found' });
    }
    res.json({ success: true, data: workshop });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a workshop (Admin only)
// @route   POST /api/workshops
// @access  Private/Admin
exports.createWorkshop = async (req, res, next) => {
  try {
    const { title, description, date, time, pricing, capacity, zoomLink } = req.body;

    const workshop = await Workshop.create({
      title,
      description,
      date,
      time,
      pricing,
      capacity,
      zoomLink: zoomLink || ''
    });

    res.status(201).json({ success: true, data: workshop });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a workshop (Admin only)
// @route   PUT /api/workshops/:id
// @access  Private/Admin
exports.updateWorkshop = async (req, res, next) => {
  try {
    const workshop = await Workshop.findById(req.params.id);
    if (!workshop) {
      return res.status(404).json({ success: false, message: 'Workshop not found' });
    }

    const { title, description, date, time, pricing, capacity, zoomLink } = req.body;

    workshop.title = title || workshop.title;
    workshop.description = description || workshop.description;
    workshop.date = date || workshop.date;
    workshop.time = time || workshop.time;
    workshop.pricing = pricing !== undefined ? pricing : workshop.pricing;
    workshop.capacity = capacity !== undefined ? capacity : workshop.capacity;
    if (zoomLink !== undefined) workshop.zoomLink = zoomLink;

    const updatedWorkshop = await workshop.save();
    res.json({ success: true, data: updatedWorkshop });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a workshop (Admin only)
// @route   DELETE /api/workshops/:id
// @access  Private/Admin
exports.deleteWorkshop = async (req, res, next) => {
  try {
    const workshop = await Workshop.findById(req.params.id);
    if (!workshop) {
      return res.status(404).json({ success: false, message: 'Workshop not found' });
    }

    await workshop.deleteOne();
    res.json({ success: true, message: 'Workshop removed successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Register for workshop with payment proof (Multi-part form submission)
// @route   POST /api/workshops/:id/register
// @access  Public
exports.registerForWorkshop = async (req, res, next) => {
  try {
    const workshop = await Workshop.findById(req.params.id);
    if (!workshop) {
      return res.status(404).json({ success: false, message: 'Workshop not found' });
    }

    const { name, email, phone, transactionId, userId } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({ success: false, message: 'Please specify name, email, and phone' });
    }

    // Phone Number validation: must contain at least 10 digits
    const phoneDigits = phone.replace(/\D/g, '');
    if (phoneDigits.length < 10) {
      return res.status(400).json({ success: false, message: 'Phone number must contain a valid 10-digit number' });
    }

    // Check capacity
    const currentRegsCount = await WorkshopRegistration.countDocuments({ workshop: req.params.id, paymentStatus: 'Paid' });
    if (currentRegsCount >= workshop.capacity) {
      return res.status(400).json({ success: false, message: 'Workshop capacity is full' });
    }

    // Free registration
    if (workshop.pricing === 0) {
      const registration = await WorkshopRegistration.create({
        workshop: req.params.id,
        user: userId || null,
        name,
        email: email.toLowerCase(),
        phone,
        paymentScreenshot: 'free_registration',
        transactionId: 'FREE_REGISTRATION',
        paymentStatus: 'Paid'
      });

      // Push to Workshop registeredUsers directly
      workshop.registeredUsers.push({
        user: userId || null,
        name,
        email: email.toLowerCase(),
        phone,
        paymentStatus: 'free',
        paymentId: 'free_registration'
      });
      await workshop.save();

      return res.status(201).json({ success: true, free: true, data: registration });
    }

    if (!transactionId) {
      return res.status(400).json({ success: false, message: 'Please specify the payment transaction reference ID' });
    }

    // Transaction ID validation: must contain exactly 12 digits
    const cleanedTxId = transactionId.trim();
    if (!/^\d{12}$/.test(cleanedTxId)) {
      return res.status(400).json({ success: false, message: 'Transaction ID must be exactly a 12-digit number' });
    }

    // Get uploaded payment screenshot
    let paymentScreenshot = '';
    if (req.file) {
      paymentScreenshot = isCloudinaryConfigured ? req.file.path : `/uploads/${req.file.filename}`;
    } else {
      return res.status(400).json({ success: false, message: 'Please upload the payment transaction screenshot' });
    }

    const registration = await WorkshopRegistration.create({
      workshop: req.params.id,
      user: userId || null,
      name,
      email: email.toLowerCase(),
      phone,
      paymentScreenshot,
      transactionId: cleanedTxId,
      paymentStatus: 'Pending'
    });

    res.status(201).json({ success: true, data: registration });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify workshop registration payment
// @route   POST /api/workshops/:id/verify
// @access  Public
exports.verifyWorkshopPayment = async (req, res, next) => {
  try {
    const workshop = await Workshop.findById(req.params.id);
    if (!workshop) {
      return res.status(404).json({ success: false, message: 'Workshop not found' });
    }

    const { 
      razorpay_payment_id, 
      razorpay_order_id, 
      razorpay_signature,
      user_details // containing name, email, phone, userId
    } = req.body;

    if (!user_details || !user_details.name || !user_details.email || !user_details.phone) {
      return res.status(400).json({ success: false, message: 'Please provide user registration details' });
    }

    if (isRazorpayConfigured) {
      if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
        return res.status(400).json({ success: false, message: 'Missing payment signature verification fields' });
      }

      const body = razorpay_order_id + '|' + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest('hex');

      const isSignatureValid = expectedSignature === razorpay_signature;

      if (!isSignatureValid) {
        return res.status(400).json({ success: false, message: 'Payment verification failed: invalid signature' });
      }
    } else {
      console.log('Workshop payment signature verified (Simulation Mode)');
    }

    // Add user to registered list
    const payId = razorpay_payment_id || `mock_pay_${crypto.randomBytes(6).toString('hex')}`;
    
    workshop.registeredUsers.push({
      user: user_details.userId || null,
      name: user_details.name,
      email: user_details.email,
      phone: user_details.phone,
      paymentStatus: 'paid',
      paymentId: payId
    });
    await workshop.save();

    res.json({
      success: true,
      message: 'Successfully registered for the workshop!',
      data: workshop
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all workshop registrations (Admin only)
// @route   GET /api/workshops/registrations
// @access  Private/Admin
exports.getAllWorkshopRegistrations = async (req, res, next) => {
  try {
    const registrations = await WorkshopRegistration.find({})
      .populate('workshop', 'title date time pricing capacity')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: registrations.length, data: registrations });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve workshop registration (Admin only)
// @route   PUT /api/workshops/registrations/:id/approve
// @access  Private/Admin
exports.approveWorkshopRegistration = async (req, res, next) => {
  try {
    const registration = await WorkshopRegistration.findById(req.params.id).populate('workshop');
    if (!registration) {
      return res.status(404).json({ success: false, message: 'Registration not found' });
    }

    registration.paymentStatus = 'Paid';
    await registration.save();

    // Register user in the Workshop document as well for historical/capacity records
    const alreadyInWorkshop = registration.workshop.registeredUsers.find(
      u => u.email.toLowerCase() === registration.email.toLowerCase()
    );
    if (!alreadyInWorkshop) {
      registration.workshop.registeredUsers.push({
        user: registration.user || null,
        name: registration.name,
        email: registration.email,
        phone: registration.phone,
        paymentStatus: 'paid',
        paymentId: `UPI_${registration.transactionId}`
      });
      await registration.workshop.save();
    }

    // Format Date beautifully
    const formattedDate = new Date(registration.workshop.date).toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Send confirmation email
    const emailOptions = {
      to: registration.email,
      subject: 'Your Workshop Registration is Confirmed',
      text: `Hello ${registration.name},\n\nThank you for registering.\n\nYour registration has been successfully confirmed.\n\nWorkshop Details:\n- Workshop Name: ${registration.workshop.title}\n- Date: ${formattedDate}\n- Time: ${registration.workshop.time}\n\nThe Zoom Meeting Link will automatically be sent to you one day before the workshop.\n\nRegards,\nAscension by Sonali Bhasin Kumar`,
      html: `<p>Hello <strong>${registration.name}</strong>,</p>
             <p>Thank you for registering.</p>
             <p>Your registration has been successfully confirmed.</p>
             <h4>Workshop Details</h4>
             <ul>
               <li><strong>Workshop Name:</strong> ${registration.workshop.title}</li>
               <li><strong>Date:</strong> ${formattedDate}</li>
               <li><strong>Time:</strong> ${registration.workshop.time}</li>
             </ul>
             <p>The Zoom Meeting Link will automatically be sent to you one day before the workshop.</p>
             <p>Regards,<br/><strong>Ascension by Sonali Bhasin Kumar</strong></p>`
    };

    try {
      await sendEmail(emailOptions);
    } catch (emailErr) {
      console.error('Approval email sending failed:', emailErr.message);
    }

    // If the workshop starts in less than 24 hours, send the Zoom link email immediately
    const now = new Date();
    const workshopDate = new Date(registration.workshop.date);
    const timeDiff = workshopDate.getTime() - now.getTime();
    const hoursDiff = timeDiff / (1000 * 60 * 60);

    if (hoursDiff <= 24 && registration.workshop.zoomLink) {
      console.log(`Workshop is in less than 24 hours (${hoursDiff.toFixed(2)}h). Sending Zoom link immediately.`);
      const reminderEmailOptions = {
        to: registration.email,
        subject: 'Your Workshop Zoom Link - Starts Soon',
        text: `Hello ${registration.name},\n\nYour registered workshop starts soon.\n\nWorkshop Details:\n- Workshop Name: ${registration.workshop.title}\n- Date: ${formattedDate}\n- Time: ${registration.workshop.time}\n\nZoom Meeting Link:\n${registration.workshop.zoomLink}\n\nPlease join 10 minutes early.\n\nRegards,\nAscension by Sonali Bhasin Kumar`,
        html: `<p>Hello <strong>${registration.name}</strong>,</p>
               <p>Your registered workshop starts soon.</p>
               <h4>Workshop Details:</h4>
               <ul>
                 <li><strong>Workshop Name:</strong> ${registration.workshop.title}</li>
                 <li><strong>Date:</strong> ${formattedDate}</li>
                 <li><strong>Time:</strong> ${registration.workshop.time}</li>
               </ul>
               <p><strong>Zoom Meeting Link:</strong> <a href="${registration.workshop.zoomLink}">${registration.workshop.zoomLink}</a></p>
               <p>Please join 10 minutes early.</p>
               <p>Regards,<br/><strong>Ascension by Sonali Bhasin Kumar</strong></p>`
      };

      try {
        await sendEmail(reminderEmailOptions);
      } catch (emailErr) {
        console.error('Zoom link email sending failed:', emailErr.message);
      }
    }

    res.json({ success: true, message: 'Registration approved successfully.', data: registration });
  } catch (error) {
    next(error);
  }
};

// @desc    Reject workshop registration (Admin only)
// @route   PUT /api/workshops/registrations/:id/reject
// @access  Private/Admin
exports.rejectWorkshopRegistration = async (req, res, next) => {
  try {
    const registration = await WorkshopRegistration.findById(req.params.id).populate('workshop');
    if (!registration) {
      return res.status(404).json({ success: false, message: 'Registration not found' });
    }

    registration.paymentStatus = 'Rejected';
    await registration.save();

    // Send rejection email
    const emailOptions = {
      to: registration.email,
      subject: 'Workshop Registration Declined',
      text: `Hello ${registration.name},\n\nYour registration for the workshop "${registration.workshop.title}" has been declined.\n\nThis could be due to a mismatched transaction reference ID or invalid screenshot proof. Please re-register or contact support if you believe this was an error.\n\nRegards,\nAscension by Sonali Bhasin Kumar`,
      html: `<p>Hello <strong>${registration.name}</strong>,</p>
             <p>Your registration for the workshop "<strong>${registration.workshop.title}</strong>" has been declined.</p>
             <p>This could be due to a mismatched transaction reference ID or invalid screenshot proof. Please re-register or contact support if you believe this was an error.</p>
             <p>Regards,<br/><strong>Ascension by Sonali Bhasin Kumar</strong></p>`
    };

    try {
      await sendEmail(emailOptions);
    } catch (emailErr) {
      console.error('Rejection email sending failed:', emailErr.message);
    }

    res.json({ success: true, message: 'Registration rejected successfully.', data: registration });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete workshop registration (Admin only)
// @route   DELETE /api/workshops/registrations/:id
// @access  Private/Admin
exports.deleteWorkshopRegistration = async (req, res, next) => {
  try {
    const registration = await WorkshopRegistration.findById(req.params.id);
    if (!registration) {
      return res.status(404).json({ success: false, message: 'Registration not found' });
    }

    await registration.deleteOne();
    res.json({ success: true, message: 'Registration deleted successfully.' });
  } catch (error) {
    next(error);
  }
};
