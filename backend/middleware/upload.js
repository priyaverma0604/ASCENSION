const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { isCloudinaryConfigured, cloudinary } = require('../config/cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

let storage;

if (isCloudinaryConfigured) {
  storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'ascension_by_sonali',
      allowed_formats: ['jpg', 'png', 'jpeg', 'webp']
    }
  });
  console.log('Multer configured to upload directly to Cloudinary.');
} else {
  // Local storage fallback configuration
  const uploadDir = path.join(__dirname, '../uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  
  storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
  });
  console.log('Multer configured to store files locally (Uploads Fallback).');
}

const fileFilter = (req, file, cb) => {
  const allowedExtensions = /jpeg|jpg|png|webp/i;
  const isExtensionAllowed = allowedExtensions.test(path.extname(file.originalname));
  const isMimeTypeAllowed = file.mimetype.startsWith('image/');

  if (isExtensionAllowed && isMimeTypeAllowed) {
    return cb(null, true);
  }
  cb(new Error('Only image formats (.jpg, .jpeg, .png, .webp) are supported!'));
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // Limit files to 5MB
});

module.exports = upload;
