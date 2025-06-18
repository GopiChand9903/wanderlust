const cloudinary = require('cloudinary').v2;//We use the Cloudinary library (usually cloudinary.v2) to connect our Node.js app to our Cloudinary account, so we can upload, manage, and delete media (images/videos) in the cloud.
const { CloudinaryStorage } = require('multer-storage-cloudinary');//multer-storage-cloudinary tells where and how to store it


//we are connecting backend to cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,//got them from .env file
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

const storage = new CloudinaryStorage({//We are writing this to tell multer that do not store the images locally, store them in cloudinary account directly
  cloudinary: cloudinary,//cloudinary.config() instance
  params: {
    folder: 'wanderlust_DEV',
    allowedFormats: ["png", "jpg", "jpeg"], // supports promises as well
    // public_id: (req, file) => 'computed-filename-using-request',
  },
});

module.exports = {cloudinary, storage};