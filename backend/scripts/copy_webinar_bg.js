const fs = require('fs');
const path = require('path');

const src = "C:/Users/Dell/.gemini/antigravity-ide/brain/b8f3a054-2344-4e0c-bb83-666d4c2dd313/.user_uploaded/media_1788962678202.png";
const dests = [
  path.join(__dirname, '..', 'uploads', 'ancestral_healing_webinar_bg.png'),
  path.join(__dirname, '..', '..', 'frontend', 'public', 'uploads', 'ancestral_healing_webinar_bg.png'),
  path.join(__dirname, '..', '..', 'frontend', 'src', 'assets', 'ancestral_healing_webinar_bg.png')
];

for (const dest of dests) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
  console.log('Copied to', dest, 'Size:', fs.statSync(dest).size);
}
