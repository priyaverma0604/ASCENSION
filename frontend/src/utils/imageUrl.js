import cloudinaryMap from '../data/cloudinaryMap.json';

export const getImageUrl = (path) => {
  if (!path || path === 'razorpay_online') return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  
  // 1. Direct Cloudinary map match (/uploads/... or path)
  if (cloudinaryMap[path]) {
    return cloudinaryMap[path];
  }
  
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  if (cloudinaryMap[cleanPath]) {
    return cloudinaryMap[cleanPath];
  }
  
  const baseName = path.split('/').pop();
  if (baseName && cloudinaryMap[baseName]) {
    return cloudinaryMap[baseName];
  }

  // Fallback to API URL
  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  return `${apiBase}${cleanPath}`;
};

export default getImageUrl;
