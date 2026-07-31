require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Admin = require('./models/Admin');
const Event = require('./models/Event');

const seedData = async () => {
    try {
        await connectDB();

        // Create default admin
        const existingAdmin = await Admin.findOne({ email: 'admin@decoration.com' });
        if (!existingAdmin) {
            await Admin.create({
                name: 'Admin',
                email: 'admin@decoration.com',
                password: 'admin123',
            });
            console.log('✅ Default admin created');
            console.log('   Email: admin@decoration.com');
            console.log('   Password: admin123');
        } else {
            console.log('ℹ️  Admin already exists');
        }

        // Seed events matching existing service pages
        const events = [
            { eventName: 'Birthday Decoration', description: 'Hidden room setup, balloon arches, happy birthday backdrop' },
            { eventName: 'Anniversary Decoration', description: 'Romantic setup with hearts, rose gold balloons, candlelight' },
            { eventName: 'Newborn Welcome', description: 'Organic garlands, name backdrop, baby-safe balloons' },
            { eventName: 'Kids Birthday Party', description: 'Jungle, Unicorn, Superhero themes with entry gates' },
            { eventName: 'Engagement Decoration', description: 'Romantic setup with hearts, rose gold balloons, candlelight' },
            { eventName: 'Haldi Ceremony', description: 'Vibrant yellow and orange decor with floral accents' },
            { eventName: 'Festival Decoration', description: 'Traditional decor for Diwali, Christmas, Eid, and more' },
        ];

        for (const eventData of events) {
            const existing = await Event.findOne({
                eventName: { $regex: new RegExp(`^${eventData.eventName}$`, 'i') },
            });
            if (!existing) {
                await Event.create(eventData);
                console.log(`✅ Event created: ${eventData.eventName}`);
            } else {
                console.log(`ℹ️  Event already exists: ${eventData.eventName}`);
            }
        }

        console.log('\n🎉 Seed complete!\n');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seed error:', error);
        process.exit(1);
    }
};

seedData();
