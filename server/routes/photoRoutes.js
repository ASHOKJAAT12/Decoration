const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
    uploadPhotos,
    getPhotosByEvent,
    deletePhoto,
    getDashboardStats,
} = require('../controllers/photoController');

// All photo routes are protected
router.use(protect);

router.get('/stats', getDashboardStats);
router.post('/', upload.array('photos', 10), uploadPhotos);
router.get('/:eventId', getPhotosByEvent);
router.delete('/:photoId', deletePhoto);

module.exports = router;
