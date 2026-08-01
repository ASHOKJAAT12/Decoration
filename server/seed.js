require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Admin = require('./models/Admin');
const Event = require('./models/Event');

const seedData = async () => {
    try {
        await connectDB();

        // Delete the old default admin if it exists
        await Admin.findOneAndDelete({ email: 'admin@decoration.com' });

        // Create new default admin
        const adminEmail = process.env.ADMINEMAIL;
        const existingAdmin = await Admin.findOne({ email: adminEmail });
        if (!existingAdmin) {
            await Admin.create({
                name: 'Admin',
                email: adminEmail,
                password: process.env.ADMINEMAIL_PASS,
            });
            console.log('✅ Default admin created');
            console.log(`   Email: ${adminEmail}`);
            console.log('   Password: ');
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
