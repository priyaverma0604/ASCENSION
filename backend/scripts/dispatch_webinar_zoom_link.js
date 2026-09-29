const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Webinar = require('../models/Webinar');
const WebinarRegistration = require('../models/WebinarRegistration');
const sendEmail = require('../utils/sendEmail');
const { getEventLinks, renderActionBlocksHtml, renderActionBlocksText } = require('../utils/emailTemplates');

dotenv.config({ path: path.join(__dirname, '../.env') });

const uri = process.env.MONGO_URI || process.env.MONGODB_URI;

async function dispatchZoomLinks() {
  try {
    if (!uri) {
      throw new Error('MONGO_URI is not set.');
    }
    await mongoose.connect(uri);
    console.log('MongoDB connected.');

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);

    // Find active Ancestral Healing Webinar (or upcoming webinar)
    const webinar = await Webinar.findOne({
      date: { $gte: todayStart },
      status: { $ne: 'Cancelled' },
      $or: [
        { title: /ancestral/i },
        { status: 'Upcoming' }
      ]
    }).sort({ date: 1 });

    if (!webinar) {
      console.log('No upcoming webinar found.');
      process.exit(0);
    }

    console.log(`Found Webinar: "${webinar.title}" (Date: ${webinar.date}, Time: ${webinar.time})`);

    const formattedDate = new Date(webinar.date).toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const force = process.argv.includes('--force');
    const query = {
      webinar: webinar._id,
      paymentStatus: 'Paid'
    };
    if (!force) {
      query.zoomLinkSent = { $ne: true };
    }

    const registrations = await WebinarRegistration.find(query);
    console.log(`Found ${registrations.length} paid registrations to dispatch to (Force: ${force}).`);

    if (registrations.length === 0) {
      console.log('No pending attendees to send Zoom link to.');
      process.exit(0);
    }

    const { whatsappLink, introLink, introTitle } = getEventLinks(webinar);
    const actionBlocksHtml = renderActionBlocksHtml({ whatsappLink, introLink, introTitle });
    const actionBlocksText = renderActionBlocksText({ whatsappLink, introLink, introTitle });

    const meetingInfoText = `${webinar.meetingId ? `\n- Meeting ID: ${webinar.meetingId}` : ''}${webinar.passcode ? `\n- Passcode: ${webinar.passcode}` : ''}${webinar.meetingChatLink ? `\n- Meeting Chat Link: ${webinar.meetingChatLink}` : ''}`;
    const meetingInfoHtml = `${webinar.meetingId ? `<li><strong>Meeting ID:</strong> ${webinar.meetingId}</li>` : ''}${webinar.passcode ? `<li><strong>Passcode:</strong> ${webinar.passcode}</li>` : ''}${webinar.meetingChatLink ? `<li><strong>Meeting Chat:</strong> <a href="${webinar.meetingChatLink}">Chat Link</a></li>` : ''}`;

    for (const reg of registrations) {
      console.log(`Sending Zoom link email to ${reg.name} (${reg.email})...`);

      const emailOptions = {
        to: reg.email,
        subject: `Webinar Alert: Your Zoom Link for "${webinar.title}"`,
        text: `Hello ${reg.name},\n\nYour registered webinar "${webinar.title}" starts today.\n\nWebinar Details:\n- Webinar Name: ${webinar.title}\n- Date: ${formattedDate}\n- Time: ${webinar.time}\n- Speaker: ${webinar.speakerName}\n\nZoom Meeting Link:\n${webinar.zoomLink}${meetingInfoText}${actionBlocksText}\nPlease join 10 minutes early.\n\nRegards,\nAscension by Sonali Bhasin Kumar`,
        html: `<p>Hello <strong>${reg.name}</strong>,</p>
               <p>Your registered webinar "<strong>${webinar.title}</strong>" starts today at <strong>${webinar.time}</strong>.</p>
               <h4>Webinar Details:</h4>
               <ul>
                 <li><strong>Webinar Name:</strong> ${webinar.title}</li>
                 <li><strong>Date:</strong> ${formattedDate}</li>
                 <li><strong>Time:</strong> ${webinar.time}</li>
                 <li><strong>Speaker:</strong> ${webinar.speakerName}</li>
                 ${meetingInfoHtml}
               </ul>
               <p><strong>Zoom Meeting Link:</strong> <a href="${webinar.zoomLink}">${webinar.zoomLink}</a></p>
               ${actionBlocksHtml}
               <p>Please join 10 minutes early.</p>
               <p>Regards,<br/><strong>Ascension by Sonali Bhasin Kumar</strong></p>`
      };

      try {
        await sendEmail(emailOptions);
        reg.zoomLinkSent = true;
        await reg.save();
        console.log(`[SUCCESS] Zoom link delivered to ${reg.email}`);
      } catch (err) {
        console.error(`[ERROR] Failed to send Zoom link to ${reg.email}:`, err.message);
      }
    }

    console.log('Dispatch process completed.');
    process.exit(0);
  } catch (err) {
    console.error('Dispatch error:', err);
    process.exit(1);
  }
}

dispatchZoomLinks();
