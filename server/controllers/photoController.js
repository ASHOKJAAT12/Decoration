const cloudinary = require('../config/cloudinary');
const Photo = require('../models/Photo');
const Event = require('../models/Event');

// @desc    Upload photos to Cloudinary and save to DB
// @route   POST /api/admin/photos
const uploadPhotos = async (req, res) => {
    try {
        const { eventId } = req.body;

        if (!eventId) {
            return res.status(400).json({ message: 'Event ID is required' });
        }

        // Verify event exists
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'Please upload at least one image' });
        }

        const uploadedPhotos = [];
        const errors = [];

        for (const file of req.files) {
            try {
                // Upload to Cloudinary
                const result = await new Promise((resolve, reject) => {
                    const uploadStream = cloudinary.uploader.upload_stream(
                        {
                            folder: `decoration-girl/${event.slug}`,
                            resource_type: 'image',
                            transformation: [
                                { quality: 'auto', fetch_format: 'auto' },
                            ],
                        },
                        (error, result) => {
                            if (error) reject(error);
                            else resolve(result);
                        }
                    );
                    uploadStream.end(file.buffer);
                });

                // Save to DB
                const photo = await Photo.create({
                    eventId,
                    imageUrl: result.secure_url,
                    cloudinaryPublicId: result.public_id,
                });

                uploadedPhotos.push(photo);
            } catch (uploadErr) {
                console.error(`Upload error for ${file.originalname}:`, uploadErr);
                errors.push({ file: file.originalname, error: uploadErr.message });
            }
        }

        if (uploadedPhotos.length === 0) {
            return res.status(500).json({
                message: 'All uploads failed',
                errors,
            });
        }

        res.status(201).json({
            message: `${uploadedPhotos.length} photo(s) uploaded successfully${errors.length > 0 ? `, ${errors.length} failed` : ''}`,
            photos: uploadedPhotos,
            errors: errors.length > 0 ? errors : undefined,
        });
    } catch (error) {
        console.error('Upload photos error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get photos by event ID
// @route   GET /api/admin/photos/:eventId
const getPhotosByEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        const photos = await Photo.find({ eventId: req.params.eventId }).sort({ uploadedAt: -1 });

        res.json({ event, photos });
    } catch (error) {
        console.error('Get photos error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Delete a photo from Cloudinary and DB
// @route   DELETE /api/admin/photos/:photoId
const deletePhoto = async (req, res) => {
    try {
        const photo = await Photo.findById(req.params.photoId);
        if (!photo) {
            return res.status(404).json({ message: 'Photo not found' });
        }

        // Delete from Cloudinary
        try {
            await cloudinary.uploader.destroy(photo.cloudinaryPublicId);
        } catch (cloudErr) {
            console.error('Cloudinary delete error:', cloudErr);
            // Continue with DB deletion even if Cloudinary fails
        }

        // Delete from DB
        await Photo.findByIdAndDelete(req.params.photoId);

        res.json({ message: 'Photo deleted successfully' });
    } catch (error) {
        console.error('Delete photo error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
const getDashboardStats = async (req, res) => {
    try {
        const totalEvents = await Event.countDocuments();
        const totalPhotos = await Photo.countDocuments();
        const recentPhotos = await Photo.find()
            .sort({ uploadedAt: -1 })
            .limit(8)
            .populate('eventId', 'eventName');

        res.json({
            totalEvents,
            totalPhotos,
            recentPhotos,
        });
    } catch (error) {
        console.error('Dashboard stats error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get photos by event slug (Public)
// @route   GET /api/public/events/:slug/photos
const getPublicEventPhotos = async (req, res) => {
    try {
        const { slug } = req.params;

        // Find the event by slug
        const event = await Event.findOne({ slug });
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Get all photos for this event
        const photos = await Photo.find({ eventId: event._id }).sort({ uploadedAt: -1 });

        res.json({
            event: {
                id: event._id,
                eventName: event.eventName,
                slug: event.slug,
                description: event.description,
            },
            photos: photos.map(p => ({
                id: p._id,
                imageUrl: p.imageUrl
            })) // Only expose necessary data externally
        });
    } catch (error) {
        console.error('Get public event photos error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    uploadPhotos,
    getPhotosByEvent,
    deletePhoto,
    getDashboardStats,
    getPublicEventPhotos,
};
