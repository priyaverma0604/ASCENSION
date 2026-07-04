const Contact = require('../models/Contact');
const sendEmail = require('../utils/sendEmail');

// @desc    Submit a contact form query
// @route   POST /api/contacts
// @access  Public
exports.submitContact = async (req, res, next) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and message' });
    }

    const contact = await Contact.create({
      name,
      email,
      phone: phone || '',
      message
    });

    // Send email notification to Admin
    const adminEmail = process.env.ADMIN_EMAIL || 'info@ascension.ind.in';
    const emailSubject = `New Contact Form Query from ${name}`;
    const emailText = `You have received a new query on the Ascension Platform.\n\nDetails:\nName: ${name}\nEmail: ${email}\nPhone: ${phone || 'N/A'}\nMessage: ${message}\n\nReview this in the Admin Dashboard at /admin`;

    try {
      await sendEmail({
        to: adminEmail,
        subject: emailSubject,
        text: emailText
      });
    } catch (mailError) {
      console.error('Failed to send email notification:', mailError.message);
      // We don't fail the request if mail fails, just log it
    }

    res.status(201).json({
      success: true,
      message: 'Your query has been submitted successfully. We will get back to you shortly!',
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

    query.status = status;
    await query.save();

    res.json({ success: true, message: `Query status updated to ${status}`, data: query });
  } catch (error) {
    next(error);
  }
};
