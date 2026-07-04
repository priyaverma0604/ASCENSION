const cloudinary = require('cloudinary').v2;

const isCloudinaryConfigured = 
  process.env.CLOUDINARY_CLOUD_NAME && 
  process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloudinary_cloud_name' &&
  process.env.CLOUDINARY_CLOUD_NAME !== 'ascension_cloud';

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
  console.log('Cloudinary Configured successfully.');
} else {
  console.warn('WARNING: Cloudinary credentials not configured. Image uploads will use local/mock storage fallback.');
}

module.exports = {
  cloudinary,
  isCloudinaryConfigured
};
