const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Webinar = require('../models/Webinar');
const WebinarRegistration = require('../models/WebinarRegistration');
const sendEmail = require('../utils/sendEmail');
const { getEventLinks, renderActionBlocksHtml, renderActionBlocksText } = require('../utils/emailTemplates');

dotenv.config({ path: path.join(__dirname, '../.env') });

const uri = process.env.MONGO_URI || process.env.MONGODB_URI;

async function executeDispatch() {
  console.log(`[${new Date().toISOString()}] === INITIATING 5:00 PM WEBINAR ZOOM LINK DISPATCH ===`);
  try {
    await mongoose.connect(uri);
    console.log('MongoDB connected successfully.');

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);

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

    const formattedDate = new Date(webinar.date).toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const registrations = await WebinarRegistration.find({
      webinar: webinar._id,
      paymentStatus: 'Paid',
      zoomLinkSent: { $ne: true }
    });

    console.log(`Found ${registrations.length} registered attendees needing Zoom link.`);

    if (registrations.length === 0) {
      console.log('All attendees have already received the Zoom link.');
      process.exit(0);
    }

    const { whatsappLink, introLink, introTitle } = getEventLinks(webinar);
    const actionBlocksHtml = renderActionBlocksHtml({ whatsappLink, introLink, introTitle });
    const actionBlocksText = renderActionBlocksText({ whatsappLink, introLink, introTitle });

    const meetingInfoText = `${webinar.meetingId ? `\n- Meeting ID: ${webinar.meetingId}` : ''}${webinar.passcode ? `\n- Passcode: ${webinar.passcode}` : ''}${webinar.meetingChatLink ? `\n- Meeting Chat Link: ${webinar.meetingChatLink}` : ''}`;
    const meetingInfoHtml = `${webinar.meetingId ? `<li><strong>Meeting ID:</strong> ${webinar.meetingId}</li>` : ''}${webinar.passcode ? `<li><strong>Passcode:</strong> ${webinar.passcode}</li>` : ''}${webinar.meetingChatLink ? `<li><strong>Meeting Chat:</strong> <a href="${webinar.meetingChatLink}">Chat Link</a></li>` : ''}`;

    for (const reg of registrations) {
      console.log(`Dispatching to: ${reg.name} <${reg.email}>...`);

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
        console.log(`[DELIVERED] Zoom link sent to ${reg.email}`);
      } catch (err) {
        console.error(`[FAILED] Could not send to ${reg.email}:`, err.message);
      }
    }

    console.log(`=== 5:00 PM DISPATCH FINISHED SUCCESSFULLY ===`);
    process.exit(0);
  } catch (error) {
    console.error('Fatal dispatch error:', error);
    process.exit(1);
  }
}

// Calculate target time: Today 17:00:00 IST (11:30:00 UTC)
const now = new Date();
const target = new Date();
// Set to 5:00 PM IST (17:00:00)
// Using IST offset (UTC+5:30)
const year = now.getFullYear();
const month = now.getMonth();
const day = now.getDate();

// 17:00 IST = 11:30 UTC
const targetUtcMs = Date.UTC(year, month, day, 17 - 5, 0 - 30);
const targetTime = new Date(targetUtcMs);

const delayMs = targetTime.getTime() - now.getTime();

console.log(`Current Time (UTC): ${now.toISOString()}`);
console.log(`Target Time (5:00 PM IST): ${targetTime.toISOString()} (${targetTime.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })})`);

if (delayMs <= 0) {
  console.log('Target time already reached or passed. Executing immediately...');
  executeDispatch();
} else {
  const mins = (delayMs / 60000).toFixed(1);
  console.log(`Scheduled to trigger in ${mins} minutes (at 5:00 PM IST). Waiting...`);
  setTimeout(executeDispatch, delayMs);
}
