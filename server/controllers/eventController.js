const Event = require('../models/Event');
const Photo = require('../models/Photo');
const cloudinary = require('../config/cloudinary');

// @desc    Get all events
// @route   GET /api/admin/events
const getEvents = async (req, res) => {
    try {
        const events = await Event.find().sort({ createdAt: -1 });

        // Get photo counts for each event
        const eventsWithCounts = await Promise.all(
            events.map(async (event) => {
                const photoCount = await Photo.countDocuments({ eventId: event._id });
                return {
                    ...event.toObject(),
                    photoCount,
                };
            })
        );

        res.json({ events: eventsWithCounts });
    } catch (error) {
        console.error('Get events error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Create a new event
// @route   POST /api/admin/events
const createEvent = async (req, res) => {
    try {
        const { eventName, description } = req.body;

        if (!eventName) {
            return res.status(400).json({ message: 'Event name is required' });
        }

        // Check for duplicate event name
        const existing = await Event.findOne({
            eventName: { $regex: new RegExp(`^${eventName}$`, 'i') },
        });
        if (existing) {
            return res.status(400).json({ message: 'An event with this name already exists' });
        }

        const event = await Event.create({ eventName, description });
        res.status(201).json({ message: 'Event created successfully', event });
    } catch (error) {
        console.error('Create event error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Delete an event and all its photos
// @route   DELETE /api/admin/events/:id
const deleteEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Delete all photos from Cloudinary
        const photos = await Photo.find({ eventId: event._id });
        for (const photo of photos) {
            try {
                await cloudinary.uploader.destroy(photo.cloudinaryPublicId);
            } catch (cloudErr) {
                console.error(`Failed to delete from Cloudinary: ${photo.cloudinaryPublicId}`, cloudErr);
            }
        }

        // Delete all photos from DB
        await Photo.deleteMany({ eventId: event._id });

        // Delete the event
        await Event.findByIdAndDelete(req.params.id);

        res.json({ message: 'Event and all associated photos deleted successfully' });
    } catch (error) {
        console.error('Delete event error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { getEvents, createEvent, deleteEvent };
