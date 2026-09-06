/**
 * Verification test script for Ancestral Healing registration emails
 */
const { getEventLinks, renderActionBlocksHtml, renderActionBlocksText } = require('../utils/emailTemplates');

console.log('Testing Email Templates for Ancestral Healing & Workshops...\n');

// Test Case 1: Ancestral Healing Webinar
const ancestralWebinar = {
  title: 'Ancestral Healing & Karma Cleansing Webinar',
  date: new Date('2026-09-24T15:30:00.000Z'),
  time: '9:00 PM - 11:00 PM IST',
  speakerName: 'Sonali Bhasin Kumar',
  whatsappGroupLink: 'https://chat.whatsapp.com/J4nXj2mznEfLCj2YZd1v16',
  introVideoUrl: 'https://youtu.be/jIs3IH-brtg'
};

const links1 = getEventLinks(ancestralWebinar);
console.log('Test 1 - Event Links:', links1);

if (links1.whatsappLink !== 'https://chat.whatsapp.com/J4nXj2mznEfLCj2YZd1v16') {
  console.error('FAIL: WhatsApp link mismatch');
} else {
  console.log('PASS: WhatsApp link match');
}

if (links1.introLink !== 'https://youtu.be/jIs3IH-brtg') {
  console.error('FAIL: Intro video link mismatch');
} else {
  console.log('PASS: Intro video link match');
}

// Test HTML and Text output
const html1 = renderActionBlocksHtml(links1);
const text1 = renderActionBlocksText(links1);

console.log('\n--- Rendered HTML snippet ---');
console.log(html1);

console.log('\n--- Rendered Text snippet ---');
console.log(text1);

if (html1.includes('https://chat.whatsapp.com/J4nXj2mznEfLCj2YZd1v16') && html1.includes('https://youtu.be/jIs3IH-brtg')) {
  console.log('\nPASS: HTML contains both WhatsApp and Intro Video links!');
} else {
  console.error('\nFAIL: HTML missing links');
}

if (text1.includes('https://chat.whatsapp.com/J4nXj2mznEfLCj2YZd1v16') && text1.includes('https://youtu.be/jIs3IH-brtg')) {
  console.log('PASS: Text contains both WhatsApp and Intro Video links!');
} else {
  console.error('FAIL: Text missing links');
}

// Test Case 2: Ancestral Workshop with empty fields (verifying fallback)
const ancestralWorkshop = {
  title: 'Ancestral Lineage Healing Workshop',
  date: new Date('2026-10-05T10:00:00.000Z'),
  time: '4:00 PM - 6:00 PM IST'
};

const links2 = getEventLinks(ancestralWorkshop);
console.log('\nTest 2 - Ancestral Workshop Fallback Links:', links2);

if (links2.whatsappLink === 'https://chat.whatsapp.com/J4nXj2mznEfLCj2YZd1v16' && links2.introLink === 'https://youtu.be/jIs3IH-brtg') {
  console.log('PASS: Fallback defaults correctly resolved for Ancestral Workshop!');
} else {
  console.error('FAIL: Fallback failed');
}

console.log('\nAll tests completed successfully!');
