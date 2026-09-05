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
    const programs = await Program.find({}).populate('enrolledUsers', 'name email');
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
    const program = await Program.findById(req.params.id).populate('enrolledUsers', 'name email');
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
    const { title, description, duration, startDate, enrolledCount, sessions, pricing, enrollmentCapacity, youtubeUrl, originalPrice, sellingPrice, zoomLink } = req.body;

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

    const { title, description, duration, startDate, enrolledCount, sessions, pricing, enrollmentCapacity, youtubeUrl, originalPrice, sellingPrice, zoomLink } = req.body;

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
// @access  Private
exports.createEnrollmentOrder = async (req, res, next) => {
  try {
    const program = await Program.findById(req.params.id);
    if (!program) {
      return res.status(404).json({ success: false, message: 'Program not found' });
    }

    // Check if user is already enrolled
    if (program.enrolledUsers.includes(req.user._id)) {
      return res.status(400).json({ success: false, message: 'You are already enrolled in this program' });
    }

    // Check capacity
    if (program.enrolledUsers.length >= program.enrollmentCapacity) {
      return res.status(400).json({ success: false, message: 'Program capacity has been reached' });
    }

    const amount = program.pricing; // In INR

    // If pricing is 0, we can enroll directly
    if (amount === 0) {
      program.enrolledUsers.push(req.user._id);
      await program.save();
      return res.json({ success: true, free: true, message: 'Successfully enrolled in free program' });
    }

    let orderResponse = {
      orderId: `mock_order_${crypto.randomBytes(6).toString('hex')}`,
      amount: amount * 100, // in paise
      currency: 'INR'
    };

    if (false && isRazorpayConfigured) { // Disabled for programs per user request
      const options = {
        amount: amount * 100, // paise
        currency: 'INR',
        receipt: `receipt_program_${program._id.toString().substring(0, 10)}`
      };
      const order = await razorpayInstance.orders.create(options);
      orderResponse.orderId = order.id;
    } else {
      console.log(`Razorpay simulated order created for Program: ${program.title}, amount: Rs. ${amount}`);
    }

    res.json({
      success: true,
      data: {
        orderId: orderResponse.orderId,
        amount: orderResponse.amount,
        currency: orderResponse.currency,
        programId: program._id,
        user: {
          name: req.user.name,
          email: req.user.email
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify program enrollment payment & enroll
// @route   POST /api/programs/:id/enroll-verify
// @access  Private
exports.verifyEnrollmentPayment = async (req, res, next) => {
  try {
    const program = await Program.findById(req.params.id);
    if (!program) {
      return res.status(404).json({ success: false, message: 'Program not found' });
    }

    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

    if (false && isRazorpayConfigured) { // Disabled for programs per user request
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
    if (!program.enrolledUsers.includes(req.user._id)) {
      program.enrolledUsers.push(req.user._id);
      await program.save();
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
// @access  Private
exports.enrollProgramQR = async (req, res, next) => {
  try {
    const program = await Program.findById(req.params.id);
    if (!program) {
      return res.status(404).json({ success: false, message: 'Program not found' });
    }

    // Check if user is already enrolled
    if (program.enrolledUsers.includes(req.user._id)) {
      return res.status(400).json({ success: false, message: 'You are already enrolled in this program' });
    }

    // Check capacity
    if (program.enrolledUsers.length >= program.enrollmentCapacity) {
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
    const existing = await ProgramRegistration.findOne({
      program: program._id,
      user: req.user._id,
      paymentStatus: 'Pending'
    });
    if (existing) {
      return res.status(400).json({ success: false, message: 'You already have a pending registration request for this program.' });
    }

    const registration = await ProgramRegistration.create({
      program: program._id,
      user: req.user._id,
      name: req.user.name,
      email: req.user.email,
      phone: req.body.phone || req.user.phone || '0000000000',
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
      // Add user to program's enrolledUsers array if not already present
      const program = await Program.findById(reg.program);
      if (program && !program.enrolledUsers.includes(reg.user)) {
        program.enrolledUsers.push(reg.user);
        await program.save();
      }

      // Send program confirmation email
      const emailOptions = {
        to: reg.email,
        subject: `Your Program Enrollment is Confirmed: ${reg.program.title}`,
        text: `Hello ${reg.name},\n\nThank you for enrolling.\n\nYour payment has been verified, and your enrollment for the program "${reg.program.title}" has been successfully confirmed.\n\nYou can access your program content and zoom links inside your dashboard profile.\n\nRegards,\nAscension by Sonali Bhasin Kumar`,
        html: `<p>Hello <strong>${reg.name}</strong>,</p>
               <p>Thank you for enrolling.</p>
               <p>Your payment has been verified, and your enrollment for the program "<strong>${reg.program.title}</strong>" has been successfully confirmed.</p>
               <p>You can access your program content and zoom links inside your dashboard profile.</p>
               <p>Regards,<br/><strong>Ascension by Sonali Bhasin Kumar</strong></p>`
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

    // Check expiration: 35 days limit for Gratitude Program
    if (program.title.toLowerCase().includes('gratitude') || program._id.toString() === '6a4963f49e941f93f91f5abf') {
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

