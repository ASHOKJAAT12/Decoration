require('dotenv').config();
const express = require('express');
const cors = require('cors');
const compression = require('compression');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');

// Validate required environment variables at startup
const REQUIRED_ENV = ['MONGO_URI', 'JWT_SECRET', 'JWT_REFRESH_SECRET'];
const missing = REQUIRED_ENV.filter((k) => !process.env[k]);
if (missing.length > 0) {
    console.error(`\n❌ Missing required environment variables: ${missing.join(', ')}\n`);
    process.exit(1);
}

// Route imports
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const photoRoutes = require('./routes/photoRoutes');
const galleryRoutes = require('./routes/galleryRoutes');
const publicRoutes = require('./routes/publicRoutes');

const app = express();
const PORT = process.env.PORT || 5000;
const isProd = process.env.NODE_ENV === 'production';

// Connect to MongoDB
connectDB();

// Security headers (disable CSP on API server — no HTML served)
app.use(helmet({ contentSecurityPolicy: false }));

// Gzip compress all responses
app.use(compression());

// CORS
const allowedOrigins = [
    'http://localhost:3000',
    'https://decorationforyou.vercel.app',
    process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
    origin: allowedOrigins,
    credentials: true,
}));

// Body parsing with explicit limits
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// Rate limiters for sensitive auth routes
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Too many attempts. Please try again in 15 minutes.' },
});

const forgotPasswordLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Too many password reset requests. Please try again in 1 hour.' },
});

// Apply rate limiting before auth routes
app.use('/api/admin/login', authLimiter);
app.use('/api/admin/forgot-password', forgotPasswordLimiter);

// Routes
app.use('/api/admin', authRoutes);
app.use('/api/admin/events', eventRoutes);
app.use('/api/admin/photos', photoRoutes);
app.use('/api/admin/gallery', galleryRoutes);
app.use('/api/public', publicRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Global error handler
app.use((err, req, res, next) => {
    // Only log stack traces in development
    if (!isProd) {
        console.error('Unhandled Error:', err);
    } else {
        console.error('Unhandled Error:', err.message);
    }

    if (err.name === 'MulterError') {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ message: 'File too large. Maximum size is 10MB.' });
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
            return res.status(400).json({ message: 'Too many files. Maximum is 10.' });
        }
        return res.status(400).json({ message: err.message });
    }

    if (err.message && err.message.includes('Invalid file type')) {
        return res.status(400).json({ message: err.message });
    }

    res.status(500).json({ message: 'Internal server error' });
});

app.listen(PORT, () => {
    console.log(`\n🚀 Server running on port ${PORT}`);
    console.log(`   Health: http://localhost:${PORT}/api/health`);
    console.log(`   Admin API: http://localhost:${PORT}/api/admin`);
    console.log(`   Public API: http://localhost:${PORT}/api/public\n`);
});
