const Event = require('../models/Event');
const Photo = require('../models/Photo');
const cloudinary = require('../config/cloudinary');

// Helper: upload a single buffer to Cloudinary
async function uploadToCloudinary(buffer, folder) {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder,
                resource_type: 'image',
                transformation: [{ quality: 'auto', fetch_format: 'auto' }],
            },
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
        );
        stream.end(buffer);
    });
}

// @desc    Get all events (admin)
// @route   GET /api/admin/events
const getEvents = async (req, res) => {
    try {
        const events = await Event.find().sort({ createdAt: -1 }).lean();

        // Single aggregation to get all photo counts — avoids N+1 DB queries
        const counts = await Photo.aggregate([
            { $group: { _id: '$eventId', count: { $sum: 1 } } }
        ]);
        const countMap = Object.fromEntries(counts.map(c => [c._id.toString(), c.count]));

        const eventsWithCounts = events.map(event => ({
            ...event,
            photoCount: countMap[event._id.toString()] || 0,
        }));

        res.json({ events: eventsWithCounts });
    } catch (error) {
        console.error('Get events error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Create a new event (with optional cover image)
// @route   POST /api/admin/events
const createEvent = async (req, res) => {
    try {
        const { eventName, description } = req.body;

        if (!eventName) {
            return res.status(400).json({ message: 'Event name is required' });
        }

        const existing = await Event.findOne({
            eventName: { $regex: new RegExp(`^${eventName}$`, 'i') },
        }).lean();
        if (existing) {
            return res.status(400).json({ message: 'An event with this name already exists' });
        }

        const eventData = { eventName, description };

        // Handle optional cover image
        if (req.file) {
            const slug = eventName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            const result = await uploadToCloudinary(req.file.buffer, `decoration-girl/${slug}/cover`);
            eventData.coverImageUrl = result.secure_url;
            eventData.coverImagePublicId = result.public_id;
        }

        const event = await Event.create(eventData);
        res.status(201).json({ message: 'Event created successfully', event });
    } catch (error) {
        console.error('Create event error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update an event (name, description, cover image)
// @route   PUT /api/admin/events/:id
const updateEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        const { eventName, description, removeCover } = req.body;

        if (eventName) event.eventName = eventName;
        if (description !== undefined) event.description = description;

        // Remove cover image
        if (removeCover === 'true' && event.coverImagePublicId) {
            try { await cloudinary.uploader.destroy(event.coverImagePublicId); } catch (_) { }
            event.coverImageUrl = '';
            event.coverImagePublicId = '';
        }

        // Replace / add cover image
        if (req.file) {
            if (event.coverImagePublicId) {
                try { await cloudinary.uploader.destroy(event.coverImagePublicId); } catch (_) { }
            }
            const result = await uploadToCloudinary(
                req.file.buffer,
                `decoration-girl/${event.slug}/cover`
            );
            event.coverImageUrl = result.secure_url;
            event.coverImagePublicId = result.public_id;
        }

        await event.save();
        res.json({ message: 'Event updated successfully', event });
    } catch (error) {
        console.error('Update event error:', error);
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

        const photos = await Photo.find({ eventId: event._id }).lean();

        // Delete all Cloudinary assets concurrently (parallel instead of serial loop)
        const cloudinaryDeletes = [];

        if (event.coverImagePublicId) {
            cloudinaryDeletes.push(
                cloudinary.uploader.destroy(event.coverImagePublicId).catch(() => { })
            );
        }

        for (const photo of photos) {
            cloudinaryDeletes.push(
                cloudinary.uploader.destroy(photo.cloudinaryPublicId).catch((err) => {
                    console.error(`Failed to delete from Cloudinary: ${photo.cloudinaryPublicId}`, err.message);
                })
            );
        }

        await Promise.all(cloudinaryDeletes);

        // Delete DB records
        await Promise.all([
            Photo.deleteMany({ eventId: event._id }),
            Event.findByIdAndDelete(req.params.id),
        ]);

        res.json({ message: 'Event and all associated photos deleted successfully' });
    } catch (error) {
        console.error('Delete event error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { getEvents, createEvent, updateEvent, deleteEvent };
