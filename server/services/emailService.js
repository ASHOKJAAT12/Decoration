const nodemailer = require('nodemailer');

// Single reusable transporter configured from environment variables
const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST || 'smtp-relay.brevo.com',
    port: parseInt(process.env.MAIL_PORT || '587', 10),
    secure: false, // TLS via STARTTLS on port 587
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});

/**
 * Send an email using Brevo SMTP.
 * @param {Object} options
 * @param {string} options.to        - Recipient email address
 * @param {string} options.subject   - Email subject line
 * @param {string} options.html      - HTML body content
 * @returns {Promise<{success: boolean, error?: string}>}
 */
const sendEmail = async ({ to, subject, html }) => {
    if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
        console.warn('⚠️  MAIL_USER or MAIL_PASS not set — email not sent.');
        return { success: false, error: 'SMTP credentials not configured' };
    }

    try {
        const info = await transporter.sendMail({
            from: process.env.MAIL_FROM || `"Decoration Admin" <${process.env.MAIL_USER}>`,
            to,
            subject,
            html,
        });

        console.log(`✅ Email sent to ${to} [messageId: ${info.messageId}]`);
        return { success: true };
    } catch (error) {
        // Log error without exposing credentials
        console.error(`❌ Email send failed to ${to}:`, error.message);
        return { success: false, error: error.message };
    }
};

module.exports = { sendEmail };
