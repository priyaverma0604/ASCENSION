const mongoose = require('mongoose');
const Program = require('../models/Program');
const User = require('../models/User');
const ProgramRegistration = require('../models/ProgramRegistration');
const UserProgramProgress = require('../models/UserProgramProgress');
const { razorpayInstance, isRazorpayConfigured } = require('../config/razorpay');
const { isCloudinaryConfigured } = require('../config/cloudinary');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

// Helper to get image paths from req.files
const getImagesPaths = (req) => {
  if (req.files && req.files.length > 0) {
    return req.files.map(file => {
      if (isCloudinaryConfigured) {
        return file.path;
      } else {
        return `/uploads/${file.filename}`;
      }
    });
  }
  return [];
};

// @desc    Get all programs
// @route   GET /api/programs
// @access  Public
exports.getPrograms = async (req, res, next) => {
  try {
    const programs = await Program.find({}).sort({ createdAt: -1 });
    res.json({ success: true, count: programs.length, data: programs });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single program
// @route   GET /api/programs/:id
// @access  Public
exports.getProgramById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let program = null;

    // 1. Try finding by MongoDB ObjectId
    if (mongoose.Types.ObjectId.isValid(id)) {
      program = await Program.findById(id).populate('enrolledUsers', 'name email');
    }

    // 2. If not found by ObjectId or if id is a slug/string
    if (!program) {
      const cleanSlug = id.trim().toLowerCase().replace(/-/g, ' ');
      
      // Try exact title match (case-insensitive)
      program = await Program.findOne({
        title: { $regex: new RegExp(`^${cleanSlug}$`, 'i') }
      }).populate('enrolledUsers', 'name email');

      // If still not found, try partial match (e.g. 'ancestral healing')
      if (!program) {
        const words = cleanSlug.split(' ').filter(Boolean).map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
        if (words.length > 0) {
          program = await Program.findOne({
            title: { $regex: new RegExp(words.join('.*'), 'i') }
          }).populate('enrolledUsers', 'name email');
        }
      }
    }

    if (!program) {
      return res.status(404).json({ success: false, message: 'Program not found' });
    }
    res.json({ success: true, data: program });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a program
// @route   POST /api/programs
// @access  Private/Admin
exports.createProgram = async (req, res, next) => {
  try {
    const { title, description, duration, startDate, enrolledCount, sessions, pricing, enrollmentCapacity, youtubeUrl, originalPrice, sellingPrice, zoomLink, whatsappGroupLink } = req.body;

    const finalSellingPrice = sellingPrice !== undefined ? Number(sellingPrice) : (pricing !== undefined ? Number(pricing) : 0);
    const finalOriginalPrice = originalPrice !== undefined ? Number(originalPrice) : finalSellingPrice;

    const images = getImagesPaths(req);
    if (images.length === 0 && req.body.images) {
      // If links were sent directly
      if (Array.isArray(req.body.images)) {
        images.push(...req.body.images);
      } else {
        images.push(req.body.images);
      }
    }

    const program = await Program.create({
      title,
      description,
      duration,
      startDate: startDate || '',
      enrolledCount: enrolledCount !== undefined ? Number(enrolledCount) : 0,
      sessions: sessions ? (typeof sessions === 'string' ? JSON.parse(sessions) : sessions) : [],
      pricing: finalSellingPrice,
      originalPrice: finalOriginalPrice,
      sellingPrice: finalSellingPrice,
      zoomLink: zoomLink || '',
      whatsappGroupLink: whatsappGroupLink || '',
      enrollmentCapacity,
      images,
      youtubeUrl
    });

    res.status(201).json({ success: true, data: program });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a program
// @route   PUT /api/programs/:id
// @access  Private/Admin
exports.updateProgram = async (req, res, next) => {
  try {
    const program = await Program.findById(req.params.id);
    if (!program) {
      return res.status(404).json({ success: false, message: 'Program not found' });
    }

    const { title, description, duration, startDate, enrolledCount, sessions, pricing, enrollmentCapacity, youtubeUrl, originalPrice, sellingPrice, zoomLink, whatsappGroupLink } = req.body;

    program.title = title || program.title;
    program.description = description || program.description;
    program.duration = duration || program.duration;
    if (startDate !== undefined) {
      program.startDate = startDate;
    }
    if (enrolledCount !== undefined) {
      program.enrolledCount = Number(enrolledCount);
    }
    if (sessions !== undefined) {
      program.sessions = typeof sessions === 'string' ? JSON.parse(sessions) : sessions;
    }
    
    if (sellingPrice !== undefined) {
      program.sellingPrice = Number(sellingPrice);
      program.pricing = Number(sellingPrice);
    } else if (pricing !== undefined) {
      program.pricing = Number(pricing);
      program.sellingPrice = Number(pricing);
    }
    
    if (originalPrice !== undefined) {
      program.originalPrice = Number(originalPrice);
    }

    if (zoomLink !== undefined) {
      program.zoomLink = zoomLink;
    }

    if (whatsappGroupLink !== undefined) {
      program.whatsappGroupLink = whatsappGroupLink;
    }
    
    program.enrollmentCapacity = enrollmentCapacity !== undefined ? enrollmentCapacity : program.enrollmentCapacity;
    if (youtubeUrl !== undefined) {
      program.youtubeUrl = youtubeUrl;
    }

    const newImages = getImagesPaths(req);
    if (newImages.length > 0) {
      program.images = newImages;
    } else if (req.body.images) {
      program.images = Array.isArray(req.body.images) ? req.body.images : [req.body.images];
    }

    const updatedProgram = await program.save();
    res.json({ success: true, data: updatedProgram });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a program
// @route   DELETE /api/programs/:id
// @access  Private/Admin
exports.deleteProgram = async (req, res, next) => {
  try {
    const program = await Program.findById(req.params.id);
    if (!program) {
      return res.status(404).json({ success: false, message: 'Program not found' });
    }

    await program.deleteOne();
    res.json({ success: true, message: 'Program deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Create program enrollment Razorpay order
// @route   POST /api/programs/:id/enroll-order
// @access  Public (Optional auth)
exports.createEnrollmentOrder = async (req, res, next) => {
  try {
    const program = await Program.findById(req.params.id);
    if (!program) {
      return res.status(404).json({ success: false, message: 'Program not found' });
    }

    const userId = req.user ? req.user._id : null;

    // Check if user is already enrolled
    if (userId && program.enrolledUsers.includes(userId)) {
      return res.status(400).json({ success: false, message: 'You are already enrolled in this program' });
    }

    // Check capacity
    if (program.enrollmentCapacity && program.enrolledUsers.length >= program.enrollmentCapacity) {
      return res.status(400).json({ success: false, message: 'Program capacity has been reached' });
    }

    const amount = Number(program.sellingPrice || program.pricing) || 0; // In INR

    // If pricing is 0, we can enroll directly
    if (amount === 0 && userId) {
      program.enrolledUsers.push(userId);
      await program.save();
      return res.json({ success: true, free: true, message: 'Successfully enrolled in free program' });
    }

    let orderResponseId = `mock_order_${crypto.randomBytes(6).toString('hex')}`;

    if (isRazorpayConfigured && razorpayInstance) {
      const options = {
        amount: Math.round(amount * 100), // paise
        currency: 'INR',
        receipt: `rcpt_prog_${crypto.randomBytes(4).toString('hex')}`,
        notes: {
          type: 'program',
          programId: program._id.toString(),
          programTitle: program.title,
          userId: userId ? userId.toString() : '',
          name: req.user ? req.user.name : (req.body.name || ''),
          email: req.user ? req.user.email : (req.body.email || ''),
          phone: req.user ? req.user.phone : (req.body.phone || '')
        }
      };
      const order = await razorpayInstance.orders.create(options);
      orderResponseId = order.id;
    } else {
      console.log(`Razorpay simulated order created for Program: ${program.title}, amount: Rs. ${amount}`);
    }

    res.json({
      success: true,
      data: {
        orderId: orderResponseId,
        amount: Math.round(amount * 100),
        currency: 'INR',
        programId: program._id,
        programTitle: program.title,
        user: {
          name: req.user ? req.user.name : (req.body.name || ''),
          email: req.user ? req.user.email : (req.body.email || '')
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify program enrollment payment & enroll
// @route   POST /api/programs/:id/enroll-verify
// @access  Public (Optional auth)
exports.verifyEnrollmentPayment = async (req, res, next) => {
  try {
    const program = await Program.findById(req.params.id);
    if (!program) {
      return res.status(404).json({ success: false, message: 'Program not found' });
    }

    const { 
      razorpay_payment_id, 
      razorpay_order_id, 
      razorpay_signature,
      userDetails 
    } = req.body;

    const userEmail = (req.user ? req.user.email : userDetails?.email) || '';
    const userName = (req.user ? req.user.name : userDetails?.name) || 'Devotee';
    const userPhone = (req.user ? req.user.phone : userDetails?.phone) || '';
    let userId = req.user ? req.user._id : (userDetails?.userId || null);

    if (!userId && userEmail) {
      const existingUser = await User.findOne({ email: userEmail.toLowerCase() });
      if (existingUser) {
        userId = existingUser._id;
      }
    }

    if (isRazorpayConfigured) {
      if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
        return res.status(400).json({ success: false, message: 'Please provide all payment verification fields' });
      }

      // Verify signature
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
      console.log('Razorpay payment signature verified (Simulation Mode).');
    }

    // Enroll user if not already enrolled
    if (userId && !program.enrolledUsers.includes(userId)) {
      program.enrolledUsers.push(userId);
      await program.save();
    }

    // Create a ProgramRegistration record as Paid
    await ProgramRegistration.create({
      program: program._id,
      user: userId,
      name: userName,
      email: userEmail.toLowerCase(),
      phone: userPhone,
      transactionId: razorpay_payment_id || `MOCK_PAY_${crypto.randomBytes(4).toString('hex')}`,
      paymentScreenshot: 'razorpay_online',
      paymentStatus: 'Paid'
    });

    // Send confirmation email
    if (userEmail) {
      const isNavratri = program.title?.toLowerCase().includes('navratri') || program._id?.toString() === '6a4963f49e941f93f91f5ac5';
      const whatsappLink = program.whatsappGroupLink || (isNavratri ? 'https://chat.whatsapp.com/DT05P5k7uviAV0Yuw1ySb7' : '');
      const greeting = isNavratri ? '🌺 Jai Mata Di 🌺' : '✨ Welcome to Ascension ✨';

      let whatsappBlockHtml = '';
      let whatsappBlockText = '';
      if (whatsappLink) {
        whatsappBlockText = `\n👉 Join Official WhatsApp Group: ${whatsappLink}\n`;
        whatsappBlockHtml = `
          <div style="text-align: center; margin: 25px 0;">
            <a href="${whatsappLink}" style="background: #25D366; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: bold; display: inline-block; box-shadow: 0 2px 4px rgba(0,0,0,0.1); font-size: 14px;">
              📱 Join Program WhatsApp Group
            </a>
          </div>
        `;
      }

      const emailOptions = {
        to: userEmail.toLowerCase(),
        subject: `Your Program Enrollment is Confirmed: ${program.title}`,
        text: `${greeting}\n\nDear ${userName},\n\nThank you for enrolling in "${program.title}".\n\nYour payment has been received and your enrollment is confirmed!${whatsappBlockText}\n👉 Access Your Program Dashboard: https://ascension.ind.in/program/${program._id}/dashboard\n\nWith divine grace,\nAscension by Sonali Bhasin Kumar`,
        html: `<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0d5c1; border-radius: 12px; background: #fffcf7;">
          <h2 style="color: #b8860b; text-align: center; margin-bottom: 5px;">${greeting}</h2>
          <h3 style="color: #2c3e50; text-align: center; margin-top: 0;">Enrollment Confirmed</h3>
          <p>Dear <strong>${userName}</strong>,</p>
          <p>Thank you for embarking on this sacred journey with us. Your payment for <strong>${program.title}</strong> has been successfully received and your enrollment is confirmed!</p>
          
          <div style="background: #fdf6e7; padding: 15px; border-radius: 8px; border-left: 4px solid #b8860b; margin: 20px 0;">
            <p style="margin: 0 0 8px 0;"><strong>Program:</strong> ${program.title}</p>
            <p style="margin: 0 0 8px 0;"><strong>Payment Status:</strong> Paid (Instant Razorpay)</p>
            <p style="margin: 0;"><strong>Reference ID:</strong> <code>${razorpay_payment_id || 'Online Payment'}</code></p>
          </div>

          ${whatsappBlockHtml}

          <p style="text-align: center; margin-top: 15px;">
            <a href="https://ascension.ind.in/program/${program._id}/dashboard" style="color: #b8860b; font-weight: bold; text-decoration: underline;">
              🔗 Open Your Program Dashboard ↗
            </a>
          </p>

          <hr style="border: none; border-top: 1px solid #e0d5c1; margin: 25px 0;" />
          <p style="font-size: 12px; color: #7f8c8d; text-align: center;">
            With gratitude & divine grace,<br/>
            <strong>Ascension by Sonali Bhasin Kumar</strong>
          </p>
        </div>`
      };
      try {
        await sendEmail(emailOptions);
      } catch (emailErr) {
        console.error('Program confirmation email error:', emailErr.message);
      }
    }

    res.json({
      success: true,
      message: 'Payment verified and enrolled successfully!',
      program
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit program manual UPI/QR enrollment request
// @route   POST /api/programs/:id/enroll-qr
// @access  Public (Optional auth)
exports.enrollProgramQR = async (req, res, next) => {
  try {
    const program = await Program.findById(req.params.id);
    if (!program) {
      return res.status(404).json({ success: false, message: 'Program not found' });
    }

    const userName = req.user ? req.user.name : (req.body.name || 'Devotee');
    const userEmail = (req.user ? req.user.email : (req.body.email || '')).toLowerCase();
    const userPhone = req.body.phone || req.user?.phone || '0000000000';
    let userId = req.user ? req.user._id : null;

    if (!userId && userEmail) {
      const existingUser = await User.findOne({ email: userEmail });
      if (existingUser) {
        userId = existingUser._id;
      }
    }

    // Check if user is already enrolled
    if (userId && program.enrolledUsers.includes(userId)) {
      return res.status(400).json({ success: false, message: 'You are already enrolled in this program' });
    }

    // Check capacity
    if (program.enrollmentCapacity && program.enrolledUsers.length >= program.enrollmentCapacity) {
      return res.status(400).json({ success: false, message: 'Program capacity has been reached' });
    }

    const { transactionId } = req.body;
    if (!transactionId) {
      return res.status(400).json({ success: false, message: 'Please provide UPI Transaction Reference ID' });
    }

    let paymentScreenshot = '';
    if (req.file) {
      if (isCloudinaryConfigured) {
        paymentScreenshot = req.file.path;
      } else {
        paymentScreenshot = `/uploads/${req.file.filename}`;
      }
    } else {
      return res.status(400).json({ success: false, message: 'Please upload payment receipt screenshot' });
    }

    // Check if a registration already exists for this program + user combo that is pending
    const pendingQuery = {
      program: program._id,
      paymentStatus: 'Pending'
    };
    if (userId) {
      pendingQuery.$or = [{ user: userId }, { email: userEmail }];
    } else if (userEmail) {
      pendingQuery.email = userEmail;
    }

    const existing = await ProgramRegistration.findOne(pendingQuery);
    if (existing) {
      return res.status(400).json({ success: false, message: 'You already have a pending registration request for this program.' });
    }

    const registration = await ProgramRegistration.create({
      program: program._id,
      user: userId,
      name: userName,
      email: userEmail,
      phone: userPhone,
      transactionId,
      paymentScreenshot
    });

    res.status(201).json({
      success: true,
      message: 'Your registration request has been submitted for verification!',
      data: registration
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all program manual registrations
// @route   GET /api/programs/registrations
// @access  Private/Admin
exports.getProgramRegistrations = async (req, res, next) => {
  try {
    const registrations = await ProgramRegistration.find()
      .populate('program', 'title pricing')
      .populate('user', 'name email')
      .sort('-createdAt');
    res.json({ success: true, data: registrations });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify (Approve/Reject) program registration
// @route   POST /api/programs/registrations/:regId/verify
// @access  Private/Admin
exports.verifyProgramRegistration = async (req, res, next) => {
  try {
    const { status } = req.body; // 'Paid' or 'Rejected'
    if (!['Paid', 'Rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid registration status. Use Paid or Rejected.' });
    }

    const reg = await ProgramRegistration.findById(req.params.regId).populate('program');
    if (!reg) {
      return res.status(404).json({ success: false, message: 'Registration record not found' });
    }

    reg.paymentStatus = status;
    await reg.save();

    if (status === 'Paid') {
      let userId = reg.user;
      if (!userId && reg.email) {
        const foundUser = await User.findOne({ email: reg.email.toLowerCase() });
        if (foundUser) {
          userId = foundUser._id;
          reg.user = foundUser._id;
          await reg.save();
        }
      }

      // Add user to program's enrolledUsers array if not already present
      const program = await Program.findById(reg.program);
      if (program && userId && !program.enrolledUsers.includes(userId)) {
        program.enrolledUsers.push(userId);
        await program.save();
      }

      // Send program confirmation email
      const isNavratri = reg.program?.title?.toLowerCase().includes('navratri') || reg.program?._id?.toString() === '6a4963f49e941f93f91f5ac5';
      const whatsappLink = program?.whatsappGroupLink || (isNavratri ? 'https://chat.whatsapp.com/DT05P5k7uviAV0Yuw1ySb7' : '');
      const greeting = isNavratri ? '🌺 Jai Mata Di 🌺' : '✨ Welcome to Ascension ✨';

      let whatsappBlockHtml = '';
      let whatsappBlockText = '';
      if (whatsappLink) {
        whatsappBlockText = `\n👉 Join Official WhatsApp Group: ${whatsappLink}\n`;
        whatsappBlockHtml = `
          <div style="text-align: center; margin: 25px 0;">
            <a href="${whatsappLink}" style="background: #25D366; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: bold; display: inline-block; box-shadow: 0 2px 4px rgba(0,0,0,0.1); font-size: 14px;">
              📱 Join Program WhatsApp Group
            </a>
          </div>
        `;
      }

      const emailOptions = {
        to: reg.email,
        subject: `Your Program Enrollment is Confirmed: ${reg.program.title}`,
        text: `${greeting}\n\nDear ${reg.name},\n\nThank you for enrolling in "${reg.program.title}".\n\nYour payment has been verified successfully!${whatsappBlockText}\n👉 Access Your Program Dashboard: https://ascension.ind.in/program/${reg.program._id}/dashboard\n\nWith divine grace,\nAscension by Sonali Bhasin Kumar`,
        html: `<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0d5c1; border-radius: 12px; background: #fffcf7;">
          <h2 style="color: #b8860b; text-align: center; margin-bottom: 5px;">${greeting}</h2>
          <h3 style="color: #2c3e50; text-align: center; margin-top: 0;">Enrollment Verified & Confirmed</h3>
          <p>Dear <strong>${reg.name}</strong>,</p>
          <p>Your payment has been verified, and your enrollment for <strong>${reg.program.title}</strong> is now active.</p>
          
          <div style="background: #fdf6e7; padding: 15px; border-radius: 8px; border-left: 4px solid #b8860b; margin: 20px 0;">
            <p style="margin: 0 0 8px 0;"><strong>Program:</strong> ${reg.program.title}</p>
            <p style="margin: 0 0 8px 0;"><strong>Payment Status:</strong> Verified (Paid)</p>
            <p style="margin: 0;"><strong>Reference ID:</strong> <code>${reg.transactionId || 'Manual UPI Verified'}</code></p>
          </div>

          ${whatsappBlockHtml}

          <p style="text-align: center; margin-top: 15px;">
            <a href="https://ascension.ind.in/program/${reg.program._id}/dashboard" style="color: #b8860b; font-weight: bold; text-decoration: underline;">
              🔗 Open Your Program Dashboard ↗
            </a>
          </p>

          <hr style="border: none; border-top: 1px solid #e0d5c1; margin: 25px 0;" />
          <p style="font-size: 12px; color: #7f8c8d; text-align: center;">
            With gratitude & divine grace,<br/>
            <strong>Ascension by Sonali Bhasin Kumar</strong>
          </p>
        </div>`
      };

      try {
        await sendEmail(emailOptions);
      } catch (emailErr) {
        console.error('Program enrollment approval email sending failed:', emailErr.message);
      }
    } else if (status === 'Rejected') {
      // Send program rejection email
      const emailOptions = {
        to: reg.email,
        subject: `Program Enrollment Declined: ${reg.program.title}`,
        text: `Hello ${reg.name},\n\nYour registration request for the program "${reg.program.title}" has been declined.\n\nThis could be due to a mismatched transaction reference ID or invalid screenshot proof. Please re-register or contact support if you believe this was an error.\n\nRegards,\nAscension by Sonali Bhasin Kumar`,
        html: `<p>Hello <strong>${reg.name}</strong>,</p>
               <p>Your registration request for the program "<strong>${reg.program.title}</strong>" has been declined.</p>
               <p>This could be due to a mismatched transaction reference ID or invalid screenshot proof. Please re-register or contact support if you believe this was an error.</p>
               <p>Regards,<br/><strong>Ascension by Sonali Bhasin Kumar</strong></p>`
      };

      try {
        await sendEmail(emailOptions);
      } catch (emailErr) {
        console.error('Program enrollment rejection email sending failed:', emailErr.message);
      }
    }

    res.json({ success: true, message: `Registration successfully marked as ${status}!`, data: reg });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete program registration (Admin only)
// @route   DELETE /api/programs/registrations/:regId
// @access  Private/Admin
exports.deleteProgramRegistration = async (req, res, next) => {
  try {
    const reg = await ProgramRegistration.findById(req.params.regId);
    if (!reg) {
      return res.status(404).json({ success: false, message: 'Registration not found' });
    }
    await reg.deleteOne();
    res.json({ success: true, message: 'Program registration deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user program progress
// @route   GET /api/programs/:id/progress
// @access  Private
exports.getProgramProgress = async (req, res, next) => {
  try {
    const program = await Program.findById(req.params.id);
    if (!program) {
      return res.status(404).json({ success: false, message: 'Program not found' });
    }

    // Check if user is enrolled
    const isEnrolled = program.enrolledUsers.some(
      (userId) => userId._id ? userId._id.toString() === req.user._id.toString() : userId.toString() === req.user._id.toString()
    );
    if (!isEnrolled) {
      return res.status(403).json({ success: false, message: 'You are not enrolled in this program' });
    }

    let progress = await UserProgramProgress.findOne({
      user: req.user._id,
      program: program._id
    });

    if (!progress) {
      progress = await UserProgramProgress.create({
        user: req.user._id,
        program: program._id,
        currentDay: 1,
        completed: false,
        submissions: []
      });
    }

    // Check expiration: Valid till 21 October 2026 for Navratri Program, 35 days for Gratitude Program
    const isNavratriProgram = program.title.toLowerCase().includes('navratri') || program._id.toString() === '6a4963f49e941f93f91f5ac5';
    const isGratitudeProgram = program.title.toLowerCase().includes('gratitude') || program._id.toString() === '6a4963f49e941f93f91f5abf';

    if (isNavratriProgram) {
      const expirationDate = new Date('2026-10-21T23:59:59+05:30');
      if (new Date() > expirationDate) {
        return res.status(403).json({ 
          success: false, 
          code: 'PROGRAM_EXPIRED', 
          message: 'Your access to the Navratri program was valid till 21 October and has expired. Please contact support or re-enroll to gain access.' 
        });
      }
    } else if (isGratitudeProgram) {
      const startDate = progress.createdAt || new Date();
      const expirationDate = new Date(startDate.getTime() + 35 * 24 * 60 * 60 * 1000);
      if (new Date() > expirationDate) {
        return res.status(403).json({ 
          success: false, 
          code: 'PROGRAM_EXPIRED', 
          message: 'Your 35-day access to this program has expired. Please contact support or re-enroll to gain access.' 
        });
      }
    }

    const AssignmentSubmission = require('../models/AssignmentSubmission');
    const currentSubmission = await AssignmentSubmission.findOne({
      user: req.user._id,
      program: program._id,
      dayNumber: progress.currentDay
    }).sort({ createdAt: -1 });

    const progressObj = progress.toObject();
    progressObj.currentSubmission = currentSubmission;

    res.json({ success: true, data: progressObj });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit day photo/assignment progress
// @route   POST /api/programs/:id/progress/submit
// @access  Private
exports.submitProgramProgressDay = async (req, res, next) => {
  try {
    const program = await Program.findById(req.params.id);
    if (!program) {
      return res.status(404).json({ success: false, message: 'Program not found' });
    }

    // Check if user is enrolled
    const isEnrolled = program.enrolledUsers.some(
      (userId) => userId._id ? userId._id.toString() === req.user._id.toString() : userId.toString() === req.user._id.toString()
    );
    if (!isEnrolled) {
      return res.status(403).json({ success: false, message: 'You are not enrolled in this program' });
    }

    let progress = await UserProgramProgress.findOne({
      user: req.user._id,
      program: program._id
    });

    if (!progress) {
      progress = await UserProgramProgress.create({
        user: req.user._id,
        program: program._id,
        currentDay: 1,
        completed: false,
        submissions: []
      });
    }

    if (progress.completed) {
      return res.status(400).json({ success: false, message: 'You have already completed this 30-day program!' });
    }

    let photoUrl = '';
    if (req.file) {
      if (isCloudinaryConfigured) {
        photoUrl = req.file.path;
      } else {
        photoUrl = `/uploads/${req.file.filename}`;
      }
    } else {
      return res.status(400).json({ success: false, message: 'Please upload a photo of your work' });
    }

    const daySubmitted = progress.currentDay;
    
    // Push submission
    progress.submissions.push({
      day: daySubmitted,
      photo: photoUrl,
      submittedAt: new Date()
    });

    if (daySubmitted >= 30) {
      progress.completed = true;
    } else {
      progress.currentDay += 1;
    }

    await progress.save();

    res.json({
      success: true,
      message: `Day ${daySubmitted} assignment submitted successfully!`,
      data: progress
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users progress for a specific program (Admin view)
// @route   GET /api/programs/:id/progress/all
// @access  Private/Admin
exports.getAllProgramProgress = async (req, res, next) => {
  try {
    const program = await Program.findById(req.params.id);
    if (!program) {
      return res.status(404).json({ success: false, message: 'Program not found' });
    }

    const progresses = await UserProgramProgress.find({ program: program._id })
      .populate('user', 'name email')
      .sort('-updatedAt');

    res.json({ success: true, data: progresses });
  } catch (error) {
    next(error);
  }
};

