const cron = require('node-cron');
const Webinar = require('../models/Webinar');
const WebinarRegistration = require('../models/WebinarRegistration');
const sendEmail = require('../utils/sendEmail');

const startWebinarReminderCron = () => {
  // Run every day at 9:00 AM: '0 9 * * *'
  cron.schedule('0 9 * * *', async () => {
    console.log('Cron Service: Checking tomorrow\'s webinars for reminders...');
    try {
      const today = new Date();
      
      // Calculate start and end of tomorrow
      const tomorrowStart = new Date(today);
      tomorrowStart.setDate(today.getDate() + 1);
      tomorrowStart.setHours(0, 0, 0, 0);

      const tomorrowEnd = new Date(today);
      tomorrowEnd.setDate(today.getDate() + 1);
      tomorrowEnd.setHours(23, 59, 59, 999);

      // Find webinars happening tomorrow
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

        console.log(`Cron Service: Sending reminders to ${paidRegistrations.length} paid registrations for "${webinar.title}"`);

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
            text: `Hello ${reg.name},\n\nThis is a reminder that your webinar is tomorrow.\n\nWebinar Details:\n- Webinar Name: ${webinar.title}\n- Date: ${formattedDate}\n- Time: ${webinar.time}\n- Speaker: ${webinar.speakerName}\n\nZoom Meeting Link:\n${webinar.zoomLink}\n\nPlease join 10 minutes early.\n\nRegards,\nAscension by Sonali Bhasin Kumar`,
            html: `<p>Hello <strong>${reg.name}</strong>,</p>
                   <p>This is a reminder that your webinar is tomorrow.</p>
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
          } catch (err) {
            console.error(`Cron Service: Failed to send reminder email to ${reg.email}:`, err.message);
          }
        }
      }
    } catch (error) {
      console.error('Cron Service: Error checking webinars:', error.message);
    }
  });
  
  console.log('Cron Service: Webinar reminder schedule successfully initialized.');
};

module.exports = { startWebinarReminderCron };
