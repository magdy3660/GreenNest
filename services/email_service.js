const User = require("../models/user")

const sgMail = require("@sendgrid/mail");
require("dotenv").config();
const JWTService = require("../services/jwt_service")
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
class EmailService {

  constructor() {
  }
  generateEmailToken(user) {
    const token = JWTService.generateJWT(user); // no await
    console.log(typeof token); // should be "string"
    return token;
  }



  async verifyPasswordResetToken(token, email) {
    const user = await User.findOne({
      email,
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });
    return user;
  }



  async sendVerificationEmail(email, emailToken) {
    console.log('Environment variables:', {
      BACKEND_URL: process.env.BACKEND_URL,
      NODE_ENV: process.env.NODE_ENV
    });

    const verificationUrl = `${process.env.BACKEND_URL}/api/v1/verify-email?token=${emailToken}`;
    console.log('Generated URL:', verificationUrl);

    const msg = {
      to: email,
      from: `${process.env.SENDER_EMAIL}`,
      subject: "Verify Your Email - GreenNest",
      text: `Please verify your email by clicking on the following link: ${verificationUrl}`,
      html: `
        <h1>Welcome to GreenNest!</h1>
        <p>Please verify your email by clicking on the following link:</p>
        <h2><a href="${verificationUrl}">Verify Email</a></h2>
        <p>This link will expire in 24 hours.</p>
      `,
    };

    try {
      await sgMail.send(msg);
      console.log("Verification email sent successfully to:", email);
      return true;
    } catch (error) {
      console.error("Error sending verification email:", error);
      throw new Error("Failed to send verification email");
    }
  }

  async verifyEmailToken(token) {
    console.log("VERIFY EMAIL HIT")

    if (token) {
      const user = await User.findOne({
        emailVerificationToken: token,
        emailVerificationExpires: { $gt: Date.now() }
      });

      if (!user) return null;
      if (user.emailVerificationToken !== token) return null; //tokenn missmatch

      user.isEmailVerified = true;
      user.emailVerificationToken = undefined;
      user.emailVerificationExpires = undefined;
      await user.save();
      return user;
    };

  }

  async sendPasswordResetEmail(email, passResetToken) {
    const resetUrl = `${process.env.BACKEND_URL}/api/v1/reset-password?token=${passResetToken}`;

    const msg = {
      to: email,
      from: `${process.env.SENDER_EMAIL}`,
      subject: "Password Reset - GreenNest",
      text: `Reset your password by clicking on the following link: ${resetUrl}`,
      html: `
        <p>You requested a password reset</p>
        <p>Click <a href="${resetUrl}">here</a> to reset your password</p>
        <p>This link will expire in 1 hour</p>
      `,
    };

    try {
      await sgMail.send(msg);
      console.log("Password reset email sent successfully to:", email);
      return true;
    } catch (error) {
      console.error("Error sending password reset email:", error);
      throw new Error("Failed to send password reset email");
    }
  }

  async sendPasswordResetConfirmation(email) {
    const msg = {
      to: email,
      from: process.env.SENDER_EMAIL,
      subject: "Password Successfully Reset",
      html: `<p>Your password has been successfully changed</p>`,
    };

    try {
      await sgMail.send(msg);
      console.log("Password reset confirmation sent to:", email);
      return true;
    } catch (error) {
      console.error("Error sending password reset confirmation:", error);
      throw new Error("Failed to send password reset confirmation");
    }
  }

}
module.exports = new EmailService();