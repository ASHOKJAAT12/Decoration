const mongoose = require('mongoose');

const galleryPhotoSchema = new mongoose.Schema({
    imageUrl: {
        type: String,
        required: [true, 'Image URL is required'],
    },
    cloudinaryPublicId: {
        type: String,
        required: [true, 'Cloudinary Public ID is required'],
    },
    uploadedAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('GalleryPhoto', galleryPhotoSchema);
