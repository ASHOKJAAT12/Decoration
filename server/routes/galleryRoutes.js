const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
    getAdminGalleryPhotos,
    uploadGalleryPhotos,
    deleteGalleryPhoto,
} = require('../controllers/galleryController');

// All gallery admin routes are protected
router.use(protect);

router.get('/', getAdminGalleryPhotos);
router.post('/', upload.array('photos', 10), uploadGalleryPhotos);
router.delete('/:id', deleteGalleryPhoto);

module.exports = router;
