const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getEvents, createEvent, deleteEvent } = require('../controllers/eventController');

// All event routes are protected
router.use(protect);

router.get('/', getEvents);
router.post('/', createEvent);
router.delete('/:id', deleteEvent);

module.exports = router;
