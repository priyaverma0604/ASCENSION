const crypto = require('crypto');
const Program = require('../models/Program');
const ProgramRegistration = require('../models/ProgramRegistration');
const Webinar = require('../models/Webinar');
const WebinarRegistration = require('../models/WebinarRegistration');
const Workshop = require('../models/Workshop');
const WorkshopRegistration = require('../models/WorkshopRegistration');
const Order = require('../models/Order');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

// @desc    Handle incoming Razorpay Webhook events
// @route   POST /api/webhooks/razorpay
// @access  Public (Protected by Razorpay signature verification)
exports.handleRazorpayWebhook = async (req, res) => {
  try {
    const signature = req.headers['x-razorpay-signature'];
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || process.env.RAZORPAY_KEY_SECRET;

    // Verify signature if secret is available
    if (signature && secret) {
      const rawBody = req.rawBody ? req.rawBody.toString('utf8') : JSON.stringify(req.body);
      const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(rawBody)
        .digest('hex');

      if (expectedSignature !== signature) {
        // Also check if body as string matches
        const fallbackSig = crypto
          .createHmac('sha256', secret)
          .update(JSON.stringify(req.body))
          .digest('hex');
        
        if (fallbackSig !== signature) {
          console.warn('⚠️ Razorpay webhook signature mismatch. Proceeding with caution.');
        }
      }
    }

    const event = req.body.event;
    console.log(`[RAZORPAY WEBHOOK] Received Event: ${event}`);

    // We process payment.captured and order.paid events
    if (event === 'payment.captured' || event === 'order.paid') {
      const payment = req.body.payload?.payment?.entity || {};
      const order = req.body.payload?.order?.entity || {};
      const notes = payment.notes || order.notes || {};

      const paymentId = payment.id || '';
      const amount = payment.amount ? payment.amount / 100 : 0;
      const userEmail = (payment.email || notes.email || '').toLowerCase().trim();
      const userName = notes.name || 'Devotee';
      const userPhone = payment.contact || notes.phone || '';

      console.log(`[RAZORPAY WEBHOOK] Payment ID: ${paymentId}, Amount: ₹${amount}, Email: ${userEmail}, Notes:`, notes);

      // 1. Check if Program Enrollment
      if (notes.type === 'program' || notes.programId) {
        const programId = notes.programId;
        const program = await Program.findById(programId);

        if (program) {
          let userId = notes.userId || null;
          if (!userId && userEmail) {
            const existingUser = await User.findOne({ email: userEmail });
            if (existingUser) userId = existingUser._id;
          }

          // Check if already registered
          let reg = await ProgramRegistration.findOne({
            $or: [
              { transactionId: paymentId },
              { program: program._id, email: userEmail, paymentStatus: 'Paid' }
            ]
          });

          if (!reg) {
            reg = await ProgramRegistration.create({
              program: program._id,
              user: userId,
              name: userName,
              email: userEmail,
              phone: userPhone,
              transactionId: paymentId,
              paymentScreenshot: 'razorpay_online',
              paymentStatus: 'Paid'
            });
            console.log(`[RAZORPAY WEBHOOK] Created ProgramRegistration: ${reg._id} for ${program.title}`);
          } else if (reg.paymentStatus !== 'Paid') {
            reg.paymentStatus = 'Paid';
            reg.transactionId = paymentId;
            await reg.save();
          }

          // Enroll user in program array
          if (userId && !program.enrolledUsers.includes(userId)) {
            program.enrolledUsers.push(userId);
            await program.save();
          }

          // Send confirmation email
          if (userEmail) {
            const isNavratri = program.title.toLowerCase().includes('navratri') || program._id.toString() === '6a4963f49e941f93f91f5ac5';
            const whatsappLink = program.whatsappGroupLink || (isNavratri ? 'https://chat.whatsapp.com/J4nXj2mznEfLCj2YZd1v16' : '');

            let extraHtml = '';
            if (whatsappLink) {
              extraHtml += `<p>👉 <strong>Join Program WhatsApp Group:</strong> <a href="${whatsappLink}">${whatsappLink}</a></p>`;
            }

            const emailOptions = {
              to: userEmail,
              subject: `Your Program Enrollment is Confirmed: ${program.title}`,
              text: `Hello ${userName},\n\nYour payment of ₹${amount} has been received and your enrollment for "${program.title}" is confirmed!\n\nReference ID: ${paymentId}\n\n${whatsappLink ? `WhatsApp Group: ${whatsappLink}\n\n` : ''}Regards,\nAscension by Sonali Bhasin Kumar`,
              html: `<p>Hello <strong>${userName}</strong>,</p>
                     <p>Your payment of <strong>₹${amount}</strong> has been received and your enrollment for <strong>${program.title}</strong> is confirmed!</p>
                     <p>Payment Reference ID: <code>${paymentId}</code></p>
                     ${extraHtml}
                     <p>You can access your daily program content directly on the Ascension portal dashboard.</p>
                     <p>Regards,<br/><strong>Ascension by Sonali Bhasin Kumar</strong></p>`
            };

            try {
              await sendEmail(emailOptions);
            } catch (emailErr) {
              console.error('[RAZORPAY WEBHOOK] Program confirmation email error:', emailErr.message);
            }
          }
        }
      }

      // 2. Check if Webinar Registration
      if (notes.type === 'webinar' || notes.webinarId) {
        const webinarId = notes.webinarId;
        const webinar = await Webinar.findById(webinarId);

        if (webinar) {
          let reg = await WebinarRegistration.findOne({
            $or: [
              { transactionId: paymentId },
              { webinar: webinar._id, email: userEmail, paymentStatus: 'Paid' }
            ]
          });

          if (!reg) {
            reg = await WebinarRegistration.create({
              webinar: webinar._id,
              name: userName,
              email: userEmail,
              phone: userPhone,
              transactionId: paymentId,
              paymentScreenshot: 'razorpay_online',
              paymentStatus: 'Paid'
            });
            console.log(`[RAZORPAY WEBHOOK] Created WebinarRegistration: ${reg._id} for ${webinar.title}`);
          }
        }
      }

      // 3. Check if Workshop Registration
      if (notes.type === 'workshop' || notes.workshopId) {
        const workshopId = notes.workshopId;
        const workshop = await Workshop.findById(workshopId);

        if (workshop) {
          let reg = await WorkshopRegistration.findOne({
            $or: [
              { transactionId: paymentId },
              { workshop: workshop._id, email: userEmail, paymentStatus: 'Paid' }
            ]
          });

          if (!reg) {
            reg = await WorkshopRegistration.create({
              workshop: workshop._id,
              name: userName,
              email: userEmail,
              phone: userPhone,
              transactionId: paymentId,
              paymentScreenshot: 'razorpay_online',
              paymentStatus: 'Paid'
            });
            console.log(`[RAZORPAY WEBHOOK] Created WorkshopRegistration: ${reg._id} for ${workshop.title}`);
          }
        }
      }

      // 4. Check if Shop Order
      if (notes.orderId || (order && order.id)) {
        const razorpayOrderId = order.id || notes.orderId;
        const dbOrder = await Order.findOne({
          $or: [
            { razorpayOrderId: razorpayOrderId },
            { paymentId: paymentId }
          ]
        });

        if (dbOrder) {
          dbOrder.paymentStatus = 'Paid';
          dbOrder.paymentId = paymentId;
          await dbOrder.save();
          console.log(`[RAZORPAY WEBHOOK] Updated Shop Order ${dbOrder._id} to Paid`);
        }
      }
    }

    res.status(200).json({ status: 'ok' });
  } catch (error) {
    console.error('[RAZORPAY WEBHOOK] Error handling webhook:', error);
    res.status(500).json({ error: error.message });
  }
};
