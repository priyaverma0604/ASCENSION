const cron = require('node-cron');
const Webinar = require('../models/Webinar');
const WebinarRegistration = require('../models/WebinarRegistration');
const Workshop = require('../models/Workshop');
const WorkshopRegistration = require('../models/WorkshopRegistration');
const sendEmail = require('../utils/sendEmail');

const startWebinarReminderCron = () => {
  // Run every day at 9:00 AM: '0 9 * * *'
  cron.schedule('0 9 * * *', async () => {
    console.log('Cron Service: Checking tomorrow\'s webinars and workshops for reminders...');
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
        date: {
          $gte: tomorrowStart,
          $lte: tomorrowEnd
        },
        status: 'Upcoming'
      });

      console.log(`Cron Service: Found ${webinarsTomorrow.length} webinars scheduled for tomorrow.`);

      for (const webinar of webinarsTomorrow) {
        // Find paid registrations for this webinar
        const paidRegistrations = await WebinarRegistration.find({
          webinar: webinar._id,
          paymentStatus: 'Paid'
        });

        console.log(`Cron Service: Sending reminders to ${paidRegistrations.length} paid registrations for webinar "${webinar.title}"`);

        const formattedDate = new Date(webinar.date).toLocaleDateString(undefined, {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });

        for (const reg of paidRegistrations) {
          const emailOptions = {
            to: reg.email,
            subject: 'Reminder: Your Webinar Starts Tomorrow',
            text: `Hello ${reg.name},\n\nThis is a reminder that your webinar is tomorrow.\n\nWebinar Details:\n- Webinar Name: ${webinar.title}\n- Date: ${formattedDate}\n- Time: ${webinar.time}\n- Speaker: ${webinar.speakerName}\n\nYour Zoom Meeting Link will automatically be sent to you 1 hour before the webinar starts.\n\nRegards,\nAscension by Sonali Bhasin Kumar`,
            html: `<p>Hello <strong>${reg.name}</strong>,</p>
                   <p>This is a reminder that your webinar is tomorrow.</p>
                   <h4>Webinar Details:</h4>
                   <ul>
                     <li><strong>Webinar Name:</strong> ${webinar.title}</li>
                     <li><strong>Date:</strong> ${formattedDate}</li>
                     <li><strong>Time:</strong> ${webinar.time}</li>
                     <li><strong>Speaker:</strong> ${webinar.speakerName}</li>
                   </ul>
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

      // 2. Process Workshops
      const workshopsTomorrow = await Workshop.find({
        date: {
          $gte: tomorrowStart,
          $lte: tomorrowEnd
        }
      });

      console.log(`Cron Service: Found ${workshopsTomorrow.length} workshops scheduled for tomorrow.`);

      for (const workshop of workshopsTomorrow) {
        // Find paid registrations for this workshop
        const paidRegistrations = await WorkshopRegistration.find({
          workshop: workshop._id,
          paymentStatus: 'Paid'
        });

        console.log(`Cron Service: Sending reminders to ${paidRegistrations.length} paid registrations for workshop "${workshop.title}"`);

        const formattedDate = new Date(workshop.date).toLocaleDateString(undefined, {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });

        for (const reg of paidRegistrations) {
          if (!workshop.zoomLink) continue; // Skip if no zoom link is set
          
          const emailOptions = {
            to: reg.email,
            subject: 'Reminder: Your Workshop Starts Tomorrow',
            text: `Hello ${reg.name},\n\nThis is a reminder that your workshop starts tomorrow.\n\nWorkshop Details:\n- Workshop Name: ${workshop.title}\n- Date: ${formattedDate}\n- Time: ${workshop.time}\n\nZoom Meeting Link:\n${workshop.zoomLink}\n\nPlease join 10 minutes early.\n\nRegards,\nAscension by Sonali Bhasin Kumar`,
            html: `<p>Hello <strong>${reg.name}</strong>,</p>
                   <p>This is a reminder that your workshop starts tomorrow.</p>
                   <h4>Workshop Details:</h4>
                   <ul>
                     <li><strong>Workshop Name:</strong> ${workshop.title}</li>
                     <li><strong>Date:</strong> ${formattedDate}</li>
                     <li><strong>Time:</strong> ${workshop.time}</li>
                   </ul>
                   <p><strong>Zoom Meeting Link:</strong> <a href="${workshop.zoomLink}">${workshop.zoomLink}</a></p>
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
    console.log('Cron Service: Checking for upcoming webinars starting within the next hour for Zoom Link delivery...');
    try {
      const now = new Date();
      const oneHourAndFiveMinutesFromNow = new Date(now.getTime() + 65 * 60 * 1000);
      const fifteenMinutesAgo = new Date(now.getTime() - 15 * 60 * 1000);

      // Find upcoming webinars starting in the 1-hour window
      const webinars = await Webinar.find({
        date: {
          $gte: fifteenMinutesAgo,
          $lte: oneHourAndFiveMinutesFromNow
        },
        status: 'Upcoming'
      });

      if (webinars.length > 0) {
        console.log(`Cron Service: Found ${webinars.length} webinars starting soon.`);
      }

      for (const webinar of webinars) {
        // Find paid registrations for this webinar that haven't received the zoom link yet
        const registrations = await WebinarRegistration.find({
          webinar: webinar._id,
          paymentStatus: 'Paid',
          zoomLinkSent: { $ne: true }
        });

        if (registrations.length > 0) {
          console.log(`Cron Service: Sending Zoom link to ${registrations.length} registrations for webinar "${webinar.title}"`);
        }

        const formattedDate = new Date(webinar.date).toLocaleDateString(undefined, {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });

        for (const reg of registrations) {
          const emailOptions = {
            to: reg.email,
            subject: 'Webinar Alert: Your Zoom Link is Here!',
            text: `Hello ${reg.name},\n\nYour registered webinar "${webinar.title}" starts in less than an hour.\n\nWebinar Details:\n- Webinar Name: ${webinar.title}\n- Date: ${formattedDate}\n- Time: ${webinar.time}\n- Speaker: ${webinar.speakerName}\n\nZoom Meeting Link:\n${webinar.zoomLink}\n\nPlease join 10 minutes early.\n\nRegards,\nAscension by Sonali Bhasin Kumar`,
            html: `<p>Hello <strong>${reg.name}</strong>,</p>
                   <p>Your registered webinar "<strong>${webinar.title}</strong>" starts in less than an hour.</p>
                   <h4>Webinar Details:</h4>
                   <ul>
                     <li><strong>Webinar Name:</strong> ${webinar.title}</li>
                     <li><strong>Date:</strong> ${formattedDate}</li>
                     <li><strong>Time:</strong> ${webinar.time}</li>
                     <li><strong>Speaker:</strong> ${webinar.speakerName}</li>
                   </ul>
                   <p><strong>Zoom Meeting Link:</strong> <a href="${webinar.zoomLink}">${webinar.zoomLink}</a></p>
                   <p>Please join 10 minutes early.</p>
                   <p>Regards,<br/><strong>Ascension by Sonali Bhasin Kumar</strong></p>`
          };

          try {
            await sendEmail(emailOptions);
            reg.zoomLinkSent = true;
            await reg.save();
            console.log(`Cron Service: Successfully sent Zoom link to ${reg.email} for webinar "${webinar.title}"`);
          } catch (err) {
            console.error(`Cron Service: Failed to send Zoom link email to ${reg.email}:`, err.message);
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
