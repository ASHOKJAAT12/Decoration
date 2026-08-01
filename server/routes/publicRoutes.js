const express = require('express');
const router = express.Router();
const { getPublicEventPhotos } = require('../controllers/photoController');
const { getGalleryPhotos } = require('../controllers/galleryController');
const Event = require('../models/Event');
const Photo = require('../models/Photo');

// @route   GET /api/public/events
// @desc    Get all events for public display
// @access  Public
router.get('/events', async (req, res) => {
    try {
        const events = await Event.find()
            .select('eventName slug description coverImageUrl createdAt')
            .sort({ createdAt: -1 })
            .lean(); // Plain JS objects — faster for read-only routes
        res.json({ events });
    } catch (error) {
        console.error('Get public events error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/public/events/:slug
// @desc    Get a single event and all its photos by slug
// @access  Public
router.get('/events/:slug', async (req, res) => {
    try {
        const { slug } = req.params;

        // Fetch event and its photos in parallel — saves one round trip
        const event = await Event.findOne({ slug }).lean();
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        const photos = await Photo.find({ eventId: event._id })
            .sort({ uploadedAt: -1 })
            .select('imageUrl')
            .lean();

        res.json({
            event: {
                id: event._id,
                eventName: event.eventName,
                slug: event.slug,
                description: event.description,
                coverImageUrl: event.coverImageUrl || null,
            },
            photos: photos.map(p => ({ id: p._id, imageUrl: p.imageUrl })),
        });
    } catch (error) {
        console.error('Get single event error:', error);
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
