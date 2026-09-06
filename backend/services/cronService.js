const cron = require('node-cron');
const Webinar = require('../models/Webinar');
const WebinarRegistration = require('../models/WebinarRegistration');
const Workshop = require('../models/Workshop');
const WorkshopRegistration = require('../models/WorkshopRegistration');
const sendEmail = require('../utils/sendEmail');
const { getEventLinks, renderActionBlocksHtml, renderActionBlocksText } = require('../utils/emailTemplates');

// Helper to accurately calculate the exact start Date/Time of a webinar
const getWebinarExactStartTime = (webinar) => {
  const d = new Date(webinar.date);
  if (webinar.time) {
    const match = webinar.time.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    if (match) {
      let hours = parseInt(match[1], 10);
      const minutes = parseInt(match[2], 10);
      const meridiem = match[3].toUpperCase();
      if (meridiem === 'PM' && hours < 12) hours += 12;
      if (meridiem === 'AM' && hours === 12) hours = 0;

      // Extract Year, Month, Day from webinar.date in UTC/Local
      const year = d.getFullYear();
      const month = d.getMonth();
      const day = d.getDate();

      // IST is UTC + 5h 30m -> UTC is IST minus 5h 30m
      const utcMs = Date.UTC(year, month, day, hours - 5, minutes - 30);
      return new Date(utcMs);
    }
  }
  return d;
};

const startWebinarReminderCron = () => {
  // 1. Run every day at 9:00 AM: '0 9 * * *' (1-Day Before Reminder)
  cron.schedule('0 9 * * *', async () => {
    console.log('Cron Service: Checking tomorrow\'s webinars and workshops for 24h reminders...');
    try {
      const today = new Date();
      
      // Calculate start and end of tomorrow
      const tomorrowStart = new Date(today);
      tomorrowStart.setDate(today.getDate() + 1);
      tomorrowStart.setHours(0, 0, 0, 0);

      const tomorrowEnd = new Date(today);
      tomorrowEnd.setDate(today.getDate() + 1);
      tomorrowEnd.setHours(23, 59, 59, 999);

      // 1. Process Webinars
      const webinarsTomorrow = await Webinar.find({
        status: 'Upcoming'
      });

      for (const webinar of webinarsTomorrow) {
        const exactStart = getWebinarExactStartTime(webinar);
        if (exactStart >= tomorrowStart && exactStart <= tomorrowEnd) {
          const paidRegistrations = await WebinarRegistration.find({
            webinar: webinar._id,
            paymentStatus: 'Paid'
          });

          console.log(`Cron Service: Sending 24h reminders to ${paidRegistrations.length} paid registrations for webinar "${webinar.title}"`);

          const formattedDate = exactStart.toLocaleDateString(undefined, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          });

          const { whatsappLink, introLink, introTitle } = getEventLinks(webinar);
          const actionBlocksHtml = renderActionBlocksHtml({ whatsappLink, introLink, introTitle });
          const actionBlocksText = renderActionBlocksText({ whatsappLink, introLink, introTitle });

          for (const reg of paidRegistrations) {
            const emailOptions = {
              to: reg.email,
              subject: `Reminder: Your Webinar Starts Tomorrow - ${webinar.title}`,
              text: `Hello ${reg.name},\n\nThis is a reminder that your webinar is tomorrow.\n\nWebinar Details:\n- Webinar Name: ${webinar.title}\n- Date: ${formattedDate}\n- Time: ${webinar.time}\n- Speaker: ${webinar.speakerName}${actionBlocksText}\nYour Zoom Meeting Link will automatically be sent to you 1 hour before the webinar starts.\n\nRegards,\nAscension by Sonali Bhasin Kumar`,
              html: `<p>Hello <strong>${reg.name}</strong>,</p>
                     <p>This is a reminder that your webinar is tomorrow.</p>
                     <h4>Webinar Details:</h4>
                     <ul>
                       <li><strong>Webinar Name:</strong> ${webinar.title}</li>
                       <li><strong>Date:</strong> ${formattedDate}</li>
                       <li><strong>Time:</strong> ${webinar.time}</li>
                       <li><strong>Speaker:</strong> ${webinar.speakerName}</li>
                     </ul>
                     ${actionBlocksHtml}
                     <p>Your Zoom Meeting Link will automatically be sent to you 1 hour before the webinar starts.</p>
                     <p>Please join 10 minutes early.</p>
                     <p>Regards,<br/><strong>Ascension by Sonali Bhasin Kumar</strong></p>`
            };

            try {
              await sendEmail(emailOptions);
            } catch (err) {
              console.error(`Cron Service: Failed to send reminder email to ${reg.email}:`, err.message);
            }
          }
        }
      }

      // 2. Process Workshops
      const workshopsTomorrow = await Workshop.find({
        date: {
          $gte: tomorrowStart,
          $lte: tomorrowEnd
        }
      });

      for (const workshop of workshopsTomorrow) {
        const paidRegistrations = await WorkshopRegistration.find({
          workshop: workshop._id,
          paymentStatus: 'Paid'
        });

        const formattedDate = new Date(workshop.date).toLocaleDateString(undefined, {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });

        const { whatsappLink, introLink, introTitle } = getEventLinks(workshop);
        const actionBlocksHtml = renderActionBlocksHtml({ whatsappLink, introLink, introTitle });
        const actionBlocksText = renderActionBlocksText({ whatsappLink, introLink, introTitle });

        for (const reg of paidRegistrations) {
          if (!workshop.zoomLink) continue;
          
          const emailOptions = {
            to: reg.email,
            subject: `Reminder: Your Workshop Starts Tomorrow - ${workshop.title}`,
            text: `Hello ${reg.name},\n\nThis is a reminder that your workshop starts tomorrow.\n\nWorkshop Details:\n- Workshop Name: ${workshop.title}\n- Date: ${formattedDate}\n- Time: ${workshop.time}\n\nZoom Meeting Link:\n${workshop.zoomLink}${actionBlocksText}\nPlease join 10 minutes early.\n\nRegards,\nAscension by Sonali Bhasin Kumar`,
            html: `<p>Hello <strong>${reg.name}</strong>,</p>
                   <p>This is a reminder that your workshop starts tomorrow.</p>
                   <h4>Workshop Details:</h4>
                   <ul>
                     <li><strong>Workshop Name:</strong> ${workshop.title}</li>
                     <li><strong>Date:</strong> ${formattedDate}</li>
                     <li><strong>Time:</strong> ${workshop.time}</li>
                   </ul>
                   <p><strong>Zoom Meeting Link:</strong> <a href="${workshop.zoomLink}">${workshop.zoomLink}</a></p>
                   ${actionBlocksHtml}
                   <p>Please join 10 minutes early.</p>
                   <p>Regards,<br/><strong>Ascension by Sonali Bhasin Kumar</strong></p>`
          };

          try {
            await sendEmail(emailOptions);
          } catch (err) {
            console.error(`Cron Service: Failed to send reminder email to ${reg.email}:`, err.message);
          }
        }
      }

    } catch (error) {
      console.error('Cron Service: Error checking webinars/workshops:', error.message);
    }
  });

  // 2. Process 1-hour before webinar Zoom Link dispatcher (runs every 5 minutes)
  cron.schedule('*/5 * * * *', async () => {
    try {
      const now = new Date();
      const allUpcomingWebinars = await Webinar.find({ status: 'Upcoming' });

      for (const webinar of allUpcomingWebinars) {
        const exactStartTime = getWebinarExactStartTime(webinar);
        const timeDiffMs = exactStartTime.getTime() - now.getTime();
        const minutesDiff = timeDiffMs / (1000 * 60);

        // If webinar starts in between -15 minutes (just started) and +65 minutes (starts in an hour)
        if (minutesDiff <= 65 && minutesDiff >= -15) {
          const registrations = await WebinarRegistration.find({
            webinar: webinar._id,
            paymentStatus: 'Paid',
            zoomLinkSent: { $ne: true }
          });

          if (registrations.length > 0) {
            console.log(`Cron Service: Delivering Zoom links to ${registrations.length} paid attendees for "${webinar.title}" (Starts in ${Math.round(minutesDiff)} mins)`);
          }

          const formattedDate = exactStartTime.toLocaleDateString(undefined, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          });

          const { whatsappLink, introLink, introTitle } = getEventLinks(webinar);
          const actionBlocksHtml = renderActionBlocksHtml({ whatsappLink, introLink, introTitle });
          const actionBlocksText = renderActionBlocksText({ whatsappLink, introLink, introTitle });

          for (const reg of registrations) {
            const meetingInfoText = `${webinar.meetingId ? `\n- Meeting ID: ${webinar.meetingId}` : ''}${webinar.passcode ? `\n- Passcode: ${webinar.passcode}` : ''}${webinar.meetingChatLink ? `\n- Meeting Chat Link: ${webinar.meetingChatLink}` : ''}`;
            const meetingInfoHtml = `${webinar.meetingId ? `<li><strong>Meeting ID:</strong> ${webinar.meetingId}</li>` : ''}${webinar.passcode ? `<li><strong>Passcode:</strong> ${webinar.passcode}</li>` : ''}${webinar.meetingChatLink ? `<li><strong>Meeting Chat:</strong> <a href="${webinar.meetingChatLink}">Chat Link</a></li>` : ''}`;

            const emailOptions = {
              to: reg.email,
              subject: `Webinar Alert: Your Zoom Link for "${webinar.title}"`,
              text: `Hello ${reg.name},\n\nYour registered webinar "${webinar.title}" starts in less than an hour.\n\nWebinar Details:\n- Webinar Name: ${webinar.title}\n- Date: ${formattedDate}\n- Time: ${webinar.time}\n- Speaker: ${webinar.speakerName}\n\nZoom Meeting Link:\n${webinar.zoomLink}${meetingInfoText}${actionBlocksText}\nPlease join 10 minutes early.\n\nRegards,\nAscension by Sonali Bhasin Kumar`,
              html: `<p>Hello <strong>${reg.name}</strong>,</p>
                     <p>Your registered webinar "<strong>${webinar.title}</strong>" starts in less than an hour.</p>
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
              console.log(`Cron Service: Successfully delivered Zoom link email to ${reg.email} for webinar "${webinar.title}"`);
            } catch (err) {
              console.error(`Cron Service: Failed to send Zoom link email to ${reg.email}:`, err.message);
            }
          }
        }
      }
    } catch (error) {
      console.error('Cron Service: Error checking for 1-hour webinar reminders:', error.message);
    }
  });
  
  console.log('Cron Service: Webinar & Workshop reminder schedule successfully initialized.');
};

module.exports = { startWebinarReminderCron };
