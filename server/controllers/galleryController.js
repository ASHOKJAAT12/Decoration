const cloudinary = require('../config/cloudinary');
const GalleryPhoto = require('../models/GalleryPhoto');

// @desc    Get all gallery photos (Public)
// @route   GET /api/public/gallery
const getGalleryPhotos = async (req, res) => {
    try {
        const photos = await GalleryPhoto.find().sort({ uploadedAt: -1 });
        res.json({
            photos: photos.map(p => ({
                id: p._id,
                imageUrl: p.imageUrl,
                uploadedAt: p.uploadedAt,
            })),
        });
    } catch (error) {
        console.error('Get gallery error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get all gallery photos (Admin)
// @route   GET /api/admin/gallery
const getAdminGalleryPhotos = async (req, res) => {
    try {
        const photos = await GalleryPhoto.find().sort({ uploadedAt: -1 });
        res.json({ photos });
    } catch (error) {
        console.error('Get admin gallery error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Upload gallery photos to Cloudinary and save to DB
// @route   POST /api/admin/gallery
const uploadGalleryPhotos = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'Please upload at least one image' });
        }

        const uploadedPhotos = [];
        const errors = [];

        for (const file of req.files) {
            try {
                const result = await new Promise((resolve, reject) => {
                    const uploadStream = cloudinary.uploader.upload_stream(
                        {
                            folder: 'decoration-girl/gallery',
                            resource_type: 'image',
                            transformation: [{ quality: 'auto', fetch_format: 'auto' }],
                        },
                        (error, result) => {
                            if (error) reject(error);
                            else resolve(result);
                        }
                    );
                    uploadStream.end(file.buffer);
                });

                const photo = await GalleryPhoto.create({
                    imageUrl: result.secure_url,
                    cloudinaryPublicId: result.public_id,
                });

                uploadedPhotos.push(photo);
            } catch (uploadErr) {
                console.error(`Gallery upload error for ${file.originalname}:`, uploadErr);
                errors.push({ file: file.originalname, error: uploadErr.message });
            }
        }

        if (uploadedPhotos.length === 0) {
            return res.status(500).json({ message: 'All uploads failed', errors });
        }

        res.status(201).json({
            message: `${uploadedPhotos.length} photo(s) uploaded successfully${errors.length > 0 ? `, ${errors.length} failed` : ''}`,
            photos: uploadedPhotos,
            errors: errors.length > 0 ? errors : undefined,
        });
    } catch (error) {
        console.error('Upload gallery photos error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Delete a gallery photo
// @route   DELETE /api/admin/gallery/:id
const deleteGalleryPhoto = async (req, res) => {
    try {
        const photo = await GalleryPhoto.findById(req.params.id);
        if (!photo) {
            return res.status(404).json({ message: 'Gallery photo not found' });
        }

        try {
            await cloudinary.uploader.destroy(photo.cloudinaryPublicId);
        } catch (cloudErr) {
            console.error('Cloudinary gallery delete error:', cloudErr);
        }

        await GalleryPhoto.findByIdAndDelete(req.params.id);
        res.json({ message: 'Gallery photo deleted successfully' });
    } catch (error) {
        console.error('Delete gallery photo error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { getGalleryPhotos, getAdminGalleryPhotos, uploadGalleryPhotos, deleteGalleryPhoto };
