const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { getEvents, createEvent, updateEvent, deleteEvent } = require('../controllers/eventController');

// All event routes are protected
router.use(protect);

router.get('/', getEvents);
router.post('/', upload.single('coverImage'), createEvent);
router.put('/:id', upload.single('coverImage'), updateEvent);
router.delete('/:id', deleteEvent);

module.exports = router;
