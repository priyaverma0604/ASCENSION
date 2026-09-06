/**
 * Email Templates & Formatting Helpers for Ascension
 */

// Helper to determine WhatsApp & Intro Video links
const getEventLinks = (item = {}) => {
  const title = (item.title || item.name || '').toLowerCase();
  const isAncestral = title.includes('ancestral');

  const defaultWhatsapp = 'https://chat.whatsapp.com/J4nXj2mznEfLCj2YZd1v16';
  const defaultIntroVideo = 'https://youtu.be/jIs3IH-brtg';

  const whatsappLink = item.whatsappGroupLink || (isAncestral ? defaultWhatsapp : defaultWhatsapp);
  const introLink = item.introVideoUrl || item.videoUrl || (isAncestral ? defaultIntroVideo : defaultIntroVideo);

  return {
    whatsappLink,
    introLink,
    isAncestral,
    introTitle: isAncestral ? 'Introduction to Ancestral Healing' : 'Introductory Video'
  };
};

/**
 * Generates styled HTML block for WhatsApp & Intro Video buttons
 */
const renderActionBlocksHtml = ({ whatsappLink, introLink, introTitle = 'Introduction to Ancestral Healing' }) => {
  let html = '';

  if (whatsappLink) {
    html += `
      <div style="margin: 22px 0 16px 0; padding: 18px; background-color: #f0fdf4; border: 1.5px solid #86efac; border-radius: 12px; text-align: center;">
        <p style="color: #166534; margin: 0 0 6px 0; font-size: 15px; font-weight: bold;">📲 Join Our Official Webinar WhatsApp Group</p>
        <p style="color: #15803d; font-size: 13px; margin: 0 0 14px 0; line-height: 1.4;">Stay updated with live meeting links, session preparation notes, and important announcements directly on WhatsApp.</p>
        <a href="${whatsappLink}" target="_blank" style="background-color: #25D366; color: #ffffff; padding: 10px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; font-size: 13px; letter-spacing: 0.5px;">Join WhatsApp Group</a>
      </div>
    `;
  }

  if (introLink) {
    html += `
      <div style="margin: 16px 0 22px 0; padding: 18px; background-color: #fff1f2; border: 1.5px solid #fecdd3; border-radius: 12px; text-align: center;">
        <p style="color: #9f1239; margin: 0 0 6px 0; font-size: 15px; font-weight: bold;">🎬 ${introTitle}</p>
        <p style="color: #be123c; font-size: 13px; margin: 0 0 14px 0; line-height: 1.4;">Please watch this preparatory video before joining the webinar to align your energy and set intentions.</p>
        <a href="${introLink}" target="_blank" style="background-color: #e11d48; color: #ffffff; padding: 10px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; font-size: 13px; letter-spacing: 0.5px;">Watch Introduction Video</a>
      </div>
    `;
  }

  return html;
};

/**
 * Generates plain text block for WhatsApp & Intro Video links
 */
const renderActionBlocksText = ({ whatsappLink, introLink, introTitle = 'Introduction to Ancestral Healing' }) => {
  let text = '';

  if (whatsappLink) {
    text += `\n\nOfficial WhatsApp Community Group:\n${whatsappLink}\n(Join for live meeting links, preparation updates & announcements)\n`;
  }

  if (introLink) {
    text += `\n${introTitle} (Watch Before Session):\n${introLink}\n`;
  }

  return text;
};

module.exports = {
  getEventLinks,
  renderActionBlocksHtml,
  renderActionBlocksText
};
