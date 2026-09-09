const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const outputPath = path.join(__dirname, '..', 'frontend', 'public', 'CSR_Proposal.pdf');
const doc = new PDFDocument({
  size: 'A4',
  margins: { top: 45, bottom: 45, left: 50, right: 50 },
  autoFirstPage: true
});

const writeStream = fs.createWriteStream(outputPath);
doc.pipe(writeStream);

// Colors
const PRIMARY = '#1E1B4B'; // Deep Indigo
const GOLD = '#D97706'; // Warm Amber/Gold
const TEXT_DARK = '#1F2937'; // Charcoal
const TEXT_MUTED = '#4B5563'; // Gray
const LIGHT_BG = '#F9FAFB'; // Off-white

// Helper for section titles
function drawHeader(title) {
  doc.fillColor(GOLD).fontSize(9).font('Helvetica-Bold').text('ASCENSION SEVA FOUNDATION', { characterSpacing: 1.5 });
  doc.moveDown(0.2);
  doc.fillColor(PRIMARY).fontSize(16).font('Helvetica-Bold').text(title);
  doc.moveDown(0.2);
  const y = doc.y;
  doc.strokeColor(GOLD).lineWidth(1.5).moveTo(50, y).lineTo(545, y).stroke();
  doc.moveDown(0.8);
}

function drawFooter(pageNumber, totalPages = 4) {
  const bottomY = 780;
  doc.strokeColor('#E5E7EB').lineWidth(0.8).moveTo(50, bottomY - 10).lineTo(545, bottomY - 10).stroke();
  doc.fillColor(TEXT_MUTED).fontSize(8).font('Helvetica')
    .text('Ascension Seva Foundation  |  ascensionseva@gmail.com  |  +91 8929061557', 50, bottomY, { width: 400, align: 'left' });
  doc.text(`Page ${pageNumber} of ${totalPages}`, 450, bottomY, { width: 95, align: 'right' });
}

// ==========================================
// PAGE 1
// ==========================================
drawHeader('CSR Partnership Invitation');

// Recipient block
doc.fillColor(TEXT_DARK).fontSize(10).font('Helvetica-Bold').text('To,');
doc.font('Helvetica').text('The CSR Head / Leadership Team');
doc.font('Helvetica-Bold').fillColor(PRIMARY).text('[Company Name]');
doc.font('Helvetica').fillColor(TEXT_DARK).text('[Company Address]');
doc.moveDown(0.8);

// Subject
doc.font('Helvetica-Bold').fillColor(PRIMARY).fontSize(11)
  .text('Subject: An Invitation to Create Impact Together Through CSR Partnership');
doc.moveDown(0.6);

doc.font('Helvetica').fontSize(10).fillColor(TEXT_DARK).text('Dear Sir/Madam,');
doc.moveDown(0.6);

// Opening Quote Box
const quoteY = doc.y;
doc.rect(50, quoteY, 495, 38).fillAndStroke('#FFFBEB', '#FDE68A');
doc.fillColor('#92400E').fontSize(9.5).font('Helvetica-Oblique')
  .text('"Somewhere tonight, a child will sleep hungry. Somewhere, a young girl will miss school because she does not have access to basic menstrual hygiene products. Somewhere, an elderly person will wait for a meal that may never come."', 60, quoteY + 6, { width: 475, align: 'center', lineGap: 2 });

doc.y = quoteY + 46;

// Introductory Paragraphs
doc.fillColor(TEXT_DARK).fontSize(9.5).font('Helvetica')
  .text('For many of us, food, education, dignity, and opportunity are a part of everyday life. For millions, they are still aspirations.', { lineGap: 2 });
doc.moveDown(0.5);

doc.text('At ', { continued: true, lineGap: 2 })
  .font('Helvetica-Bold').fillColor(PRIMARY).text('Ascension Seva Foundation', { continued: true })
  .font('Helvetica').fillColor(TEXT_DARK).text(', we believe that real change begins when compassion is transformed into action. We believe that businesses have the power not only to build economies but also to build stronger communities, brighter futures, and a more equitable society.');
doc.moveDown(0.5);

doc.text('Every meal served, every child educated, every tree planted, and every life touched creates a ripple effect that extends far beyond a single act of kindness.', { lineGap: 2 });
doc.moveDown(0.5);

doc.text('Over the years, Ascension Seva Foundation has worked tirelessly to create meaningful social impact through large-scale community campaigns focused on education, hunger relief, women empowerment, healthcare awareness, environmental sustainability, and community welfare.', { lineGap: 2 });
doc.moveDown(0.8);

// Flagship Campaigns Heading
doc.font('Helvetica-Bold').fontSize(12).fillColor(PRIMARY).text('Our Flagship Campaigns & Impact Initiatives');
doc.moveDown(0.5);

function renderCampaign(title, description) {
  doc.font('Helvetica-Bold').fontSize(9.5).fillColor(PRIMARY).text(`•  ${title}`);
  doc.font('Helvetica').fontSize(9).fillColor(TEXT_DARK).text(description, 65, doc.y, { width: 480, lineGap: 1.5 });
  doc.moveDown(0.4);
}

renderCampaign('Shiksha Kendra Campaign', 'Providing educational support, learning resources, mentorship, and opportunities to underprivileged children because education remains the strongest tool for breaking the cycle of poverty.');
renderCampaign('Annadan & Jal Seva Campaign', 'Organizing food distribution and water seva drives for vulnerable communities, daily wage workers, and families in need throughout the year.');
renderCampaign('Mahabhoj Campaign – Mahashivratri Seva', 'One of our most impactful initiatives, where we served and fed 5,000+ individuals during Mahashivratri, celebrating the spirit of service through Annadan and community support.');

drawFooter(1, 4);

// ==========================================
// PAGE 2
// ==========================================
doc.addPage();
drawHeader('Our Flagship Campaigns & Impact Initiatives');

renderCampaign('Shravan Shraddha Seva Campaign', 'During the sacred month of Shravan, we embrace the philosophy of "Serving Shiva by Serving His Creation." Through this initiative, Ascension Seva successfully provided meals and support to 10,000+ individuals, reinforcing the belief that humanity itself is the truest form of worship.');
renderCampaign('Women\'s Dignity & Menstrual Hygiene Campaign', 'Conducting awareness sessions and sanitary napkin distribution drives to promote menstrual health, dignity, and education for women and young girls.');
renderCampaign('Health & Community Wellness Campaign', 'Supporting underserved communities through awareness initiatives, wellness programs, and healthcare outreach activities.');
renderCampaign('Environmental Sustainability Campaign', 'Organizing plantation drives, cleanliness initiatives, and environmental awareness campaigns to create a greener and healthier future.');
renderCampaign('Festival Seva Campaigns', 'Conducting large-scale community service initiatives during festivals, Ekadashi observances, and other spiritually significant occasions, ensuring that celebrations are shared with those who need support the most.');
renderCampaign('Animal Welfare & Compassion Campaign', 'Providing food and care for stray animals while promoting compassion and coexistence within communities.');
renderCampaign('Volunteer & Community Engagement Campaign', 'Creating opportunities for citizens and corporate teams to actively participate in community service and create tangible social impact.');

doc.moveDown(0.6);
doc.font('Helvetica-Bold').fontSize(12).fillColor(PRIMARY).text('Why We Are Reaching Out');
doc.moveDown(0.4);

doc.font('Helvetica').fontSize(9.5).fillColor(TEXT_DARK)
  .text('Corporate Social Responsibility is no longer just about giving back—it is about creating measurable impact and building a legacy that communities remember for generations.', { lineGap: 2 });
doc.moveDown(0.5);

doc.text('We invite ', { continued: true, lineGap: 2 })
  .font('Helvetica-Bold').fillColor(PRIMARY).text('[Company Name]', { continued: true })
  .font('Helvetica').fillColor(TEXT_DARK).text(' to join hands with Ascension Seva Foundation as a CSR partner to help us expand our programs and reach more lives across India.');

drawFooter(2, 4);

// ==========================================
// PAGE 3
// ==========================================
doc.addPage();
drawHeader('CSR Partnership Opportunities & Value');

doc.font('Helvetica-Bold').fontSize(10).fillColor(PRIMARY).text('Your support can directly contribute towards:');
doc.moveDown(0.3);

const contributions = [
  'Feeding vulnerable communities.',
  'Supporting education for underprivileged children.',
  'Empowering women through menstrual health initiatives.',
  'Organizing health and wellness campaigns.',
  'Environmental sustainability projects.',
  'Large-scale community welfare programs.',
  'Employee volunteering and engagement opportunities.'
];

contributions.forEach(item => {
  doc.font('Helvetica').fontSize(9).fillColor(TEXT_DARK).text(`•  ${item}`, 60, doc.y, { width: 485, lineGap: 1.5 });
  doc.moveDown(0.25);
});

doc.moveDown(0.5);
doc.font('Helvetica-Bold').fontSize(11).fillColor(PRIMARY).text('What Your Partnership Creates');
doc.moveDown(0.3);
doc.font('Helvetica').fontSize(9).fillColor(TEXT_DARK).text('Your CSR contribution will not simply fund a project. It may become:');
doc.moveDown(0.3);

const outcomes = [
  'The meal that allows a child to sleep without hunger.',
  'The notebook that helps a student continue their education.',
  'The sanitary kit that helps a young girl attend school with dignity.',
  'The tree that contributes to a healthier environment.',
  'The act of kindness that restores hope to a family in need.'
];

outcomes.forEach(item => {
  doc.font('Helvetica').fontSize(9).fillColor(TEXT_DARK).text(`•  ${item}`, 60, doc.y, { width: 485, lineGap: 1.5 });
  doc.moveDown(0.25);
});

doc.moveDown(0.3);
doc.font('Helvetica-Oblique').fontSize(9).fillColor(TEXT_MUTED)
  .text('Behind every statistic is a person, and behind every contribution is a story waiting to be changed.');

doc.moveDown(0.6);
doc.font('Helvetica-Bold').fontSize(11).fillColor(PRIMARY).text('What We Offer Our CSR Partners');
doc.moveDown(0.3);

const offerings = [
  'Detailed impact reports and transparency in fund utilization.',
  'Campaign-wise documentation and beneficiary reports.',
  'Branding and visibility opportunities during campaigns and events.',
  'Employee volunteering and engagement opportunities.',
  'Social media and community recognition for collaborative initiatives.',
  'Customized CSR projects aligned with your organization\'s vision and goals.'
];

offerings.forEach(item => {
  doc.font('Helvetica').fontSize(9).fillColor(TEXT_DARK).text(`•  ${item}`, 60, doc.y, { width: 485, lineGap: 1.5 });
  doc.moveDown(0.25);
});

drawFooter(3, 4);

// ==========================================
// PAGE 4
// ==========================================
doc.addPage();
drawHeader('Our Commitment & Next Steps');

doc.font('Helvetica').fontSize(10).fillColor(TEXT_DARK).text('At Ascension Seva, our philosophy is simple:');
doc.moveDown(0.4);

// Creed banner
const creedY = doc.y;
doc.rect(50, creedY, 495, 34).fillAndStroke('#EEF2FF', '#C7D2FE');
doc.fillColor(PRIMARY).fontSize(11).font('Helvetica-Bold')
  .text('"The greatest form of worship is service to humanity."', 60, creedY + 10, { width: 475, align: 'center' });

doc.y = creedY + 44;

doc.font('Helvetica').fontSize(9.5).fillColor(TEXT_DARK)
  .text('When organizations and communities come together with a shared purpose, impact multiplies and lives change. We would be honored to explore opportunities for collaboration and create meaningful change together. Thank you for your time and consideration.', { lineGap: 2 });
doc.moveDown(0.6);

doc.text('We look forward to building a partnership that creates lasting impact for generations to come.', { lineGap: 2 });
doc.moveDown(0.6);

// Closing quote box
const closeY = doc.y;
doc.rect(50, closeY, 495, 36).fillAndStroke('#FFFBEB', '#FDE68A');
doc.fillColor('#92400E').fontSize(9).font('Helvetica-Oblique')
  .text('"When we feed a hungry person, educate a child, empower a woman, or care for our environment, we are not simply helping communities—we are investing in humanity\'s future."', 60, closeY + 7, { width: 475, align: 'center', lineGap: 1.5 });

doc.y = closeY + 48;

doc.fillColor(TEXT_DARK).fontSize(10).font('Helvetica').text('Warm regards,');
doc.moveDown(0.4);

doc.font('Helvetica-Bold').fontSize(12).fillColor(PRIMARY).text('Sonali Bhasin Kumar');
doc.font('Helvetica').fontSize(10).fillColor(TEXT_MUTED).text('Founder');
doc.font('Helvetica-Bold').fontSize(10).fillColor(PRIMARY).text('Ascension Seva Foundation');
doc.moveDown(0.8);

// Contact box
const contactY = doc.y;
doc.rect(50, contactY, 495, 52).fillAndStroke('#F3F4F6', '#E5E7EB');
doc.fillColor(TEXT_DARK).fontSize(9.5).font('Helvetica-Bold').text('Direct Contact Information:', 65, contactY + 8);
doc.font('Helvetica').fontSize(9.5).fillColor(TEXT_DARK)
  .text('📞  Phone / WhatsApp:  +91 89290 61557', 65, contactY + 23)
  .text('✉️  Official Email:  ascensionseva@gmail.com', 65, contactY + 36);

drawFooter(4, 4);

doc.end();

writeStream.on('finish', () => {
  console.log('CSR Proposal PDF successfully created at:', outputPath);
});
