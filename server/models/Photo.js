const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: [true, 'Event ID is required'],
    },
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

// Index for fast per-event photo queries (primary access pattern)
photoSchema.index({ eventId: 1, uploadedAt: -1 });

module.exports = mongoose.model('Photo', photoSchema);
