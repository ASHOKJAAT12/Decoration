const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const Admin = require('../models/Admin');

// Generate JWT Access Token (15 minutes)
const generateAccessToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '15m' });
};

// Generate JWT Refresh Token (7 days)
const generateRefreshToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
};

// @desc    Login admin
// @route   POST /api/admin/login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password' });
        }

        const admin = await Admin.findOne({ email }).select('+password');
        if (!admin) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isMatch = await admin.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const accessToken = generateAccessToken(admin._id);
        const refreshToken = generateRefreshToken(admin._id);

        // Save refresh token to DB
        admin.refreshToken = refreshToken;
        await admin.save({ validateBeforeSave: false });

        res.json({
            message: 'Login successful',
            accessToken,
            refreshToken,
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Refresh access token
// @route   POST /api/admin/refresh-token
const refreshTokenHandler = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({ message: 'Refresh token is required' });
        }

        // Verify refresh token
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const admin = await Admin.findById(decoded.id);

        if (!admin || admin.refreshToken !== refreshToken) {
            return res.status(401).json({ message: 'Invalid refresh token' });
        }

        // Generate new access token
        const newAccessToken = generateAccessToken(admin._id);

        res.json({ accessToken: newAccessToken });
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired refresh token' });
    }
};

// @desc    Get current admin
// @route   GET /api/admin/me
const getMe = async (req, res) => {
    try {
        res.json({
            admin: {
                id: req.admin._id,
                name: req.admin.name,
                email: req.admin.email,
            },
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Forgot password
// @route   POST /api/admin/forgot-password
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Please provide an email address' });
        }

        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(404).json({ message: 'No admin account found with this email' });
        }

        // Generate reset token
        const resetToken = admin.getResetPasswordToken();
        await admin.save({ validateBeforeSave: false });

        const resetUrl = `${process.env.FRONTEND_URL}/admin/reset-password?token=${resetToken}`;

        const message = `
      <h2>Password Reset Request</h2>
      <p>You requested a password reset for your Decoration Admin Panel account.</p>
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}" style="display:inline-block;padding:12px 24px;background:#7c3aed;color:#fff;text-decoration:none;border-radius:8px;margin:16px 0;">Reset Password</a>
      <p>This link will expire in 30 minutes.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `;

        try {
            // Try to send email
            if (process.env.SMTP_USER && process.env.SMTP_PASS) {
                const transporter = nodemailer.createTransport({
                    host: process.env.SMTP_HOST || 'smtp.gmail.com',
                    port: process.env.SMTP_PORT || 587,
                    secure: false,
                    auth: {
                        user: process.env.SMTP_USER,
                        pass: process.env.SMTP_PASS,
                    },
                });

                await transporter.sendMail({
                    from: `"Decoration Admin" <${process.env.SMTP_USER}>`,
                    to: admin.email,
                    subject: 'Password Reset - Decoration Admin Panel',
                    html: message,
                });

                res.json({ message: 'Password reset link sent to your email' });
            } else {
                // Log to console if SMTP not configured
                console.log('\n📧 Password Reset Link (SMTP not configured):');
                console.log(`   ${resetUrl}\n`);
                res.json({ message: 'Password reset link generated (check server console)' });
            }
        } catch (emailError) {
            console.error('Email send error:', emailError);
            admin.resetPasswordToken = undefined;
            admin.resetPasswordExpire = undefined;
            await admin.save({ validateBeforeSave: false });
            return res.status(500).json({ message: 'Failed to send reset email' });
        }
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Reset password
// @route   POST /api/admin/reset-password
const resetPassword = async (req, res) => {
    try {
        const { token, password } = req.body;

        if (!token || !password) {
            return res.status(400).json({ message: 'Token and new password are required' });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }

        // Hash the incoming token and find matching admin
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        const admin = await Admin.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!admin) {
            return res.status(400).json({ message: 'Invalid or expired reset token' });
        }

        // Set new password and clear reset fields
        admin.password = password;
        admin.resetPasswordToken = undefined;
        admin.resetPasswordExpire = undefined;
        admin.refreshToken = undefined;
        await admin.save();

        res.json({ message: 'Password reset successful. Please login with your new password.' });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Logout admin
// @route   POST /api/admin/logout
const logout = async (req, res) => {
    try {
        if (req.admin) {
            await Admin.findByIdAndUpdate(req.admin._id, { refreshToken: null });
        }
        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    login,
    refreshTokenHandler,
    getMe,
    forgotPassword,
    resetPassword,
    logout,
};
