const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage configuration for medicine images
const Healthtorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'herbalmed/Health',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 800, height: 600, crop: 'limit' }],
  },
});

// Storage configuration for news images
const newsStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'herbalmed/news',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 1200, height: 800, crop: 'limit' }],
  },
});

// Storage configuration for videos
const videoStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => ({
    folder: 'herbalmed/videos',
    resource_type: 'video',
    allowed_formats: ['mp4', 'mov', 'avi', 'webm'],
    format: 'mp4',
  }),
});

// Multer upload instances
const uploadMedicineImage = multer({
  storage: Healthtorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

const uploadNewsImage = multer({
  storage: newsStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

const uploadVideo = multer({
  storage: videoStorage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
});

/**
 * Delete an image or video from Cloudinary
 * @param {string} publicId - The public ID of the resource
 * @param {string} resourceType - 'image' or 'video'
 * @returns {Promise}
 */
async function deleteFromCloudinary(publicId, resourceType = 'image') {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
    return result;
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    throw error;
  }
}

/**
 * Extract public ID from Cloudinary URL
 * @param {string} url - Cloudinary URL
 * @returns {string} - Public ID
 */
function extractPublicId(url) {
  if (!url) return null;
  const parts = url.split('/');
  const filename = parts[parts.length - 1];
  const publicId = filename.split('.')[0];
  const folder = parts.slice(-3, -1).join('/');
  return `${folder}/${publicId}`;
}

module.exports = {
  cloudinary,
  uploadMedicineImage,
  uploadNewsImage,
  uploadVideo,
  deleteFromCloudinary,
  extractPublicId,
};
