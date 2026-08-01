const express = require('express');
const router = express.Router();
const { getPublicEventPhotos } = require('../controllers/photoController');
const { getGalleryPhotos } = require('../controllers/galleryController');
const Event = require('../models/Event');

// @route   GET /api/public/events
// @desc    Get all events (name, slug, description, coverImageUrl) for public display
// @access  Public
router.get('/events', async (req, res) => {
    try {
        const events = await Event.find()
            .select('eventName slug description coverImageUrl createdAt')
            .sort({ createdAt: -1 });
        res.json({ events });
    } catch (error) {
        console.error('Get public events error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/public/events/:slug/photos
// @desc    Get all photos for a specific event by its slug
// @access  Public
router.get('/events/:slug/photos', getPublicEventPhotos);

// @route   GET /api/public/gallery
// @desc    Get all global gallery photos
// @access  Public
router.get('/gallery', getGalleryPhotos);

module.exports = router;
