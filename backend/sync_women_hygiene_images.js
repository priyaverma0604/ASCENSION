const fs = require('fs');
const path = require('path');

const userUploadedDir = 'C:\\Users\\Dell\\.gemini\\antigravity-ide\\brain\\3df376a2-be02-4205-8627-f9b0cbaa0054\\.user_uploaded';

const images = [
  {
    src: path.join(userUploadedDir, 'media_1788909544721.jpg'),
    names: ['women_hygiene_1.jpg', 'sanitary_distribution_1.png', 'sanitary_distribution_1.jpg']
  },
  {
    src: path.join(userUploadedDir, 'media_1788909544780.jpg'),
    names: ['women_hygiene_2.jpg', 'sanitary_distribution_2.png', 'sanitary_distribution_2.jpg']
  },
  {
    src: path.join(userUploadedDir, 'media_1788909544693.jpg'),
    names: ['women_hygiene_3.jpg', 'sanitary_distribution_3.png', 'sanitary_distribution_3.jpg']
  }
];

const targetDirs = [
  path.join(__dirname, 'uploads'),
  path.join(__dirname, '..', 'frontend', 'public', 'uploads'),
  path.join(__dirname, '..', 'frontend', 'dist', 'uploads'),
  path.join(__dirname, '..', 'frontend', 'src', 'assets', 'gallery')
];

targetDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

for (const img of images) {
  if (fs.existsSync(img.src)) {
    for (const dir of targetDirs) {
      for (const name of img.names) {
        const dest = path.join(dir, name);
        fs.copyFileSync(img.src, dest);
        console.log(`Copied ${img.src} -> ${dest}`);
      }
    }
  } else {
    console.error(`Source not found: ${img.src}`);
  }
}

console.log('Women hygiene photos synced across all folders.');
