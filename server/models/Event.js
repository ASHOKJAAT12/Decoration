const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    eventName: {
        type: String,
        required: [true, 'Event name is required'],
        trim: true,
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true,
    },
    description: {
        type: String,
        default: '',
    },
}, {
    timestamps: true,
});

// Auto-generate slug from eventName before saving
eventSchema.pre('save', function () {
    if (this.isModified('eventName')) {
        this.slug = this.eventName
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }
});

module.exports = mongoose.model('Event', eventSchema);
