const sgMail = require('@sendgrid/mail');
require('dotenv').config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendVerificationEmail(email, verificationToken) {
    const verificationUrl = `${process.env.APP_URL}/api/v1/verify-email?token=${verificationToken}`;

    const msg = {
        to: email,
        from: `${process.env.SENDER_EMAIL}`,
        subject: 'Verify Your Email - GreenNest',
        text: `Please verify your email by clicking on the following link: ${verificationUrl}`,
        html: `
            <h1>Welcome to GreenNest!</h1>
            <p>Please verify your email by clicking on the following link:</p>
            <h2><a href="${verificationUrl}">Verify Email</a></h2>
            <p>This link will expire in 24 hours.</p>
        `
    };

    try {
        await sgMail.send(msg);
        console.log('Verification email sent successfully to:', email);
        return true;
    } catch (error) {
        console.error('Error sending verification email:', error);
        throw new Error('Failed to send verification email');
    }
}

async function sendPasswordResetEmail(email, resetToken) {
    const resetUrl = `${process.env.BACKEND_URL}/api/v1/reset-password?token=${resetToken}`;

    const msg = {
        to: email,
        from: `${process.env.SENDER_EMAIL}`,
        subject: 'Password Reset - GreenNest',
        text: `Reset your password by clicking on the following link: ${resetUrl}`,
        html: `
        <p>You requested a password reset</p>
        <p>Click <a href="${resetUrl}">here</a> to reset your password</p>
        <p>This link will expire in 1 hour</p>
      `
    };

    try {
        await sgMail.send(msg);
        console.log('Password reset email sent successfully to:', email);
        return true;
    } catch (error) {
        console.error('Error sending password reset email:', error);
        throw new Error('Failed to send password reset email');
    }

}
async function sendResetLog(email) {
    const msg = {
        to: user.email,
        from: process.env.SENDER_EMAIL,
        subject: 'Password Successfully Reset',
        html: `<p>Your password has been successfully changed</p>`
      };
      await sgMail.send(msg);
}

module.exports = {
    sendVerificationEmail,
    sendPasswordResetEmail,
    sendResetLog
};