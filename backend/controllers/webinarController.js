const Webinar = require('../models/Webinar');
const WebinarRegistration = require('../models/WebinarRegistration');
const sendEmail = require('../utils/sendEmail');
const { isCloudinaryConfigured } = require('../config/cloudinary');

// Helper to get image path
const getSingleImagePath = (req, fieldName) => {
  if (req.files && req.files[fieldName] && req.files[fieldName].length > 0) {
    const file = req.files[fieldName][0];
    if (isCloudinaryConfigured) {
      return file.path;
    } else {
      return `/uploads/${file.filename}`;
    }
  }
  return '';
};

// @desc    Get all webinars (Public hides Zoom link, Admin shows it)
// @route   GET /api/webinars
// @access  Public
exports.getWebinars = async (req, res, next) => {
  try {
    let query = Webinar.find({}).sort({ date: 1 });
    
    // Check if requester is Admin to expose Zoom link
    // Note: On public GET route, we project out zoomLink by default unless admin is querying
    // We can also have separate admin/public routes or check req.user
    const isAdmin = req.user && req.user.role === 'admin';
    if (!isAdmin) {
      query = query.select('-zoomLink');
    }

    const webinars = await query;
    res.json({ success: true, count: webinars.length, data: webinars });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single webinar details
// @route   GET /api/webinars/:id
// @access  Public
exports.getWebinarById = async (req, res, next) => {
  try {
    let query = Webinar.findById(req.params.id);
    
    const isAdmin = req.user && req.user.role === 'admin';
    if (!isAdmin) {
      query = query.select('-zoomLink');
    }

    const webinar = await query;
    if (!webinar) {
      return res.status(404).json({ success: false, message: 'Webinar not found' });
    }
    res.json({ success: true, data: webinar });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a webinar (Admin only)
// @route   POST /api/webinars
// @access  Private/Admin
exports.createWebinar = async (req, res, next) => {
  try {
    const { 
      title, shortDescription, detailedDescription, speakerName, 
      date, time, duration, price, upiId, mobileNumber, zoomLink, maxSeats,
      meetingId, passcode, meetingChatLink, oneTapMobile, joinBySip
    } = req.body;

    const coverImage = getSingleImagePath(req, 'coverImage');
    const upiQrCodeImage = getSingleImagePath(req, 'upiQrCodeImage') || '/uploads/default_upi_qr.jpg';

    const webinar = await Webinar.create({
      title,
      shortDescription,
      detailedDescription,
      speakerName,
      date,
      time,
      duration,
      price: Number(price) || 0,
      coverImage,
      upiQrCodeImage,
      upiId: upiId || 'sonalibhasinkumar@ptaxis',
      mobileNumber,
      zoomLink,
      meetingId: meetingId || '',
      passcode: passcode || '',
      meetingChatLink: meetingChatLink || '',
      oneTapMobile: oneTapMobile || '',
      joinBySip: joinBySip || '',
      maxSeats: Number(maxSeats) || 100
    });

    res.status(201).json({ success: true, data: webinar });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a webinar (Admin only)
// @route   PUT /api/webinars/:id
// @access  Private/Admin
exports.updateWebinar = async (req, res, next) => {
  try {
    const webinar = await Webinar.findById(req.params.id);
    if (!webinar) {
      return res.status(404).json({ success: false, message: 'Webinar not found' });
    }

    const { 
      title, shortDescription, detailedDescription, speakerName, 
      date, time, duration, price, upiId, mobileNumber, zoomLink, maxSeats, status,
      meetingId, passcode, meetingChatLink, oneTapMobile, joinBySip
    } = req.body;

    webinar.title = title || webinar.title;
    webinar.shortDescription = shortDescription || webinar.shortDescription;
    webinar.detailedDescription = detailedDescription || webinar.detailedDescription;
    webinar.speakerName = speakerName || webinar.speakerName;
    webinar.date = date || webinar.date;
    webinar.time = time || webinar.time;
    webinar.duration = duration || webinar.duration;
    webinar.price = price !== undefined ? Number(price) : webinar.price;
    webinar.upiId = upiId || webinar.upiId;
    webinar.mobileNumber = mobileNumber || webinar.mobileNumber;
    webinar.zoomLink = zoomLink || webinar.zoomLink;
    if (meetingId !== undefined) webinar.meetingId = meetingId;
    if (passcode !== undefined) webinar.passcode = passcode;
    if (meetingChatLink !== undefined) webinar.meetingChatLink = meetingChatLink;
    if (oneTapMobile !== undefined) webinar.oneTapMobile = oneTapMobile;
    if (joinBySip !== undefined) webinar.joinBySip = joinBySip;
    webinar.maxSeats = maxSeats !== undefined ? Number(maxSeats) : webinar.maxSeats;
    webinar.status = status || webinar.status;

    const newCover = getSingleImagePath(req, 'coverImage');
    if (newCover) webinar.coverImage = newCover;

    const newQr = getSingleImagePath(req, 'upiQrCodeImage');
    if (newQr) webinar.upiQrCodeImage = newQr;

    const updatedWebinar = await webinar.save();
    res.json({ success: true, data: updatedWebinar });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a webinar (Admin only)
// @route   DELETE /api/webinars/:id
// @access  Private/Admin
exports.deleteWebinar = async (req, res, next) => {
  try {
    const webinar = await Webinar.findById(req.params.id);
    if (!webinar) {
      return res.status(404).json({ success: false, message: 'Webinar not found' });
    }

    // Delete associated registrations first
    await WebinarRegistration.deleteMany({ webinar: req.params.id });
    await webinar.deleteOne();

    res.json({ success: true, message: 'Webinar removed successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Register for webinar with payment proof (Muli-part form submission)
// @route   POST /api/webinars/:id/register
// @access  Public
exports.registerForWebinar = async (req, res, next) => {
  try {
    const webinar = await Webinar.findById(req.params.id);
    if (!webinar) {
      return res.status(404).json({ success: false, message: 'Webinar not found' });
    }

    const { name, email, phone, transactionId, userId } = req.body;

    if (!name || !email || !phone || !transactionId) {
      return res.status(400).json({ success: false, message: 'Please specify name, email, phone, and transaction ID' });
    }

    // Phone Number validation: must contain at least 10 digits (excluding optional country code)
    const phoneDigits = phone.replace(/\D/g, '');
    if (phoneDigits.length < 10) {
      return res.status(400).json({ success: false, message: 'Phone number must contain a valid 10-digit number' });
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

    const registration = await WebinarRegistration.create({
      webinar: req.params.id,
      user: userId || null,
      name,
      email: email.toLowerCase(),
      phone,
      paymentScreenshot,
      transactionId,
      paymentStatus: 'Pending'
    });

    res.status(201).json({ success: true, data: registration });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all webinar registrations (Admin only)
// @route   GET /api/webinars/registrations
// @access  Private/Admin
exports.getAllRegistrations = async (req, res, next) => {
  try {
    const registrations = await WebinarRegistration.find({})
      .populate('webinar', 'title date time speakerName price zoomLink')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: registrations.length, data: registrations });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve webinar registration (Admin only)
// @route   PUT /api/webinars/registrations/:id/approve
// @access  Private/Admin
exports.approveRegistration = async (req, res, next) => {
  try {
    const registration = await WebinarRegistration.findById(req.params.id).populate('webinar');
    if (!registration) {
      return res.status(404).json({ success: false, message: 'Registration not found' });
    }

    registration.paymentStatus = 'Paid';
    await registration.save();

    // Format Date beautifully
    const formattedDate = new Date(registration.webinar.date).toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Send confirmation email
    const emailOptions = {
      to: registration.email,
      subject: 'Your Webinar Registration is Confirmed',
      text: `Hello ${registration.name},\n\nThank you for registering.\n\nYour registration has been successfully confirmed.\n\nWebinar Details:\n- Webinar Name: ${registration.webinar.title}\n- Date: ${formattedDate}\n- Time: ${registration.webinar.time}\n- Speaker: ${registration.webinar.speakerName}\n\nThe Zoom Meeting Link will automatically be sent to you 1 hour before the webinar.\n\nRegards,\nAscension by Sonali Bhasin Kumar`,
      html: `<p>Hello <strong>${registration.name}</strong>,</p>
             <p>Thank you for registering.</p>
             <p>Your registration has been successfully confirmed.</p>
             <h4>Webinar Details</h4>
             <ul>
               <li><strong>Webinar Name:</strong> ${registration.webinar.title}</li>
               <li><strong>Date:</strong> ${formattedDate}</li>
               <li><strong>Time:</strong> ${registration.webinar.time}</li>
               <li><strong>Speaker:</strong> ${registration.webinar.speakerName}</li>
             </ul>
             <p>The Zoom Meeting Link will automatically be sent to you 1 hour before the webinar.</p>
             <p>Regards,<br/><strong>Ascension by Sonali Bhasin Kumar</strong></p>`
    };

    try {
      await sendEmail(emailOptions);
    } catch (emailErr) {
      console.error('Approval email sending failed:', emailErr.message);
    }

    // If the webinar starts in less than 1 hour (up to 1h 5m window), send the Zoom link email immediately as well
    const now = new Date();
    const webinarDate = new Date(registration.webinar.date);
    const timeDiff = webinarDate.getTime() - now.getTime();
    const hoursDiff = timeDiff / (1000 * 60 * 60);

    if (hoursDiff <= 1.08 && hoursDiff >= -0.5) {
      console.log(`Webinar is in less than 1 hour (${hoursDiff.toFixed(2)}h). Sending Zoom link immediately.`);
      const meetingInfoText = `${registration.webinar.meetingId ? `\n- Meeting ID: ${registration.webinar.meetingId}` : ''}${registration.webinar.passcode ? `\n- Passcode: ${registration.webinar.passcode}` : ''}${registration.webinar.meetingChatLink ? `\n- Meeting Chat Link: ${registration.webinar.meetingChatLink}` : ''}`;
      const meetingInfoHtml = `${registration.webinar.meetingId ? `<li><strong>Meeting ID:</strong> ${registration.webinar.meetingId}</li>` : ''}${registration.webinar.passcode ? `<li><strong>Passcode:</strong> ${registration.webinar.passcode}</li>` : ''}${registration.webinar.meetingChatLink ? `<li><strong>Meeting Chat:</strong> <a href="${registration.webinar.meetingChatLink}">Chat Link</a></li>` : ''}`;

      const reminderEmailOptions = {
        to: registration.email,
        subject: 'Your Webinar Zoom Link - Starts Soon',
        text: `Hello ${registration.name},\n\nYour registered webinar starts soon.\n\nWebinar Details:\n- Webinar Name: ${registration.webinar.title}\n- Date: ${formattedDate}\n- Time: ${registration.webinar.time}\n- Speaker: ${registration.webinar.speakerName}\n\nZoom Meeting Link:\n${registration.webinar.zoomLink}${meetingInfoText}\n\nPlease join 10 minutes early.\n\nRegards,\nAscension by Sonali Bhasin Kumar`,
        html: `<p>Hello <strong>${registration.name}</strong>,</p>
               <p>Your registered webinar starts soon.</p>
               <h4>Webinar Details:</h4>
               <ul>
                 <li><strong>Webinar Name:</strong> ${registration.webinar.title}</li>
                 <li><strong>Date:</strong> ${formattedDate}</li>
                 <li><strong>Time:</strong> ${registration.webinar.time}</li>
                 <li><strong>Speaker:</strong> ${registration.webinar.speakerName}</li>
                 ${meetingInfoHtml}
               </ul>
               <p><strong>Zoom Meeting Link:</strong> <a href="${registration.webinar.zoomLink}">${registration.webinar.zoomLink}</a></p>
               <p>Please join 10 minutes early.</p>
               <p>Regards,<br/><strong>Ascension by Sonali Bhasin Kumar</strong></p>`
      };

      try {
        await sendEmail(reminderEmailOptions);
        registration.zoomLinkSent = true;
        await registration.save();
      } catch (emailErr) {
        console.error('Zoom link email sending failed:', emailErr.message);
      }
    }

    res.json({ success: true, message: 'Registration approved successfully.', data: registration });
  } catch (error) {
    next(error);
  }
};

// @desc    Reject webinar registration (Admin only)
// @route   PUT /api/webinars/registrations/:id/reject
// @access  Private/Admin
exports.rejectRegistration = async (req, res, next) => {
  try {
    const registration = await WebinarRegistration.findById(req.params.id).populate('webinar');
    if (!registration) {
      return res.status(404).json({ success: false, message: 'Registration not found' });
    }

    registration.paymentStatus = 'Rejected';
    await registration.save();

    // Send rejection email
    const emailOptions = {
      to: registration.email,
      subject: 'Webinar Registration Declined',
      text: `Hello ${registration.name},\n\nYour registration for the webinar "${registration.webinar.title}" has been declined.\n\nThis could be due to a mismatched transaction reference ID or invalid screenshot proof. Please re-register or contact support if you believe this was an error.\n\nRegards,\nAscension by Sonali Bhasin Kumar`,
      html: `<p>Hello <strong>${registration.name}</strong>,</p>
             <p>Your registration for the webinar "<strong>${registration.webinar.title}</strong>" has been declined.</p>
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

// @desc    Delete webinar registration (Admin only)
// @route   DELETE /api/webinars/registrations/:id
// @access  Private/Admin
exports.deleteRegistration = async (req, res, next) => {
  try {
    const registration = await WebinarRegistration.findById(req.params.id);
    if (!registration) {
      return res.status(404).json({ success: false, message: 'Registration not found' });
    }

    await WebinarRegistration.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Registration deleted successfully.' });
  } catch (error) {
    next(error);
  }
};
