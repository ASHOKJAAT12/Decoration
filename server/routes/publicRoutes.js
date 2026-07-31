const express = require('express');
const router = express.Router();
const { getPublicEventPhotos } = require('../controllers/photoController');

// @route   GET /api/public/events/:slug/photos
// @desc    Get all photos for a specific event by its slug
// @access  Public
router.get('/events/:slug/photos', getPublicEventPhotos);

module.exports = router;
