const User = require("../models/user");
const {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendPasswordResetConfirmation,
} = require("./email_service");
const {
  generateToken,
  verifyEmailToken,
  verifyResetToken,
  resetUserPassword,
  hashPassword,
  comparePassword,
} = require("./token_service");

class UserService {
  async registerUser(userData) {
    const { email, password, firstName, lastName } = userData;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const error = new Error("User already exists");
      error.status = 409; // Conflict
      throw error;
    }

    try {
      // Create new user
      const hashedPassword = await hashPassword(password);
      const user = new User({
        email,
        password: hashedPassword,
        Name: {
          firstName,
          lastName,
        },
      });

      // Generate verification token and save user
      const verificationToken = generateToken(user);
      user.emailVerificationToken = verificationToken;
      user.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
      await user.save();

      // Send verification email
      await sendVerificationEmail(user.email, verificationToken);

      return {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isEmailVerified: user.isEmailVerified,
      };
    } catch (error) {
      console.error("Error in registerUser:", error);
      const newError = new Error("Registration failed");
      newError.status = 500;
      throw newError;
    }
  }

  async verifyEmail(token) {
    try {
      const user = await verifyEmailToken(token);
      if (!user) {
        const error = new Error("Invalid or expired verification token");
        error.status = 400;
        throw error;
      }
      return user;
    } catch (error) {
      console.error("Error in verifyEmail:", error);
      if (!error.status) {
        error.status = 500;
      }
      throw error;
    }
  }

  async loginUser(email, password) {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        const error = new Error("Invalid credentials");
        error.status = 401;
        throw error;
      }

      if (!user.isEmailVerified) {
        const error = new Error("Please verify your email before logging in");
        error.status = 403;
        throw error;
      }

      const isMatch = await comparePassword(password, user.password);
      if (!isMatch) {
        const error = new Error("Invalid credentials");
        error.status = 401;
        throw error;
      }

      const token = generateToken(user);

      return {
        token,
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        },
      };
    } catch (error) {
      console.error("Error in loginUser:", error);
      if (!error.status) {
        error.status = 500;
      }
      throw error;
    }
  }

  async initiatePasswordReset(email) {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        const error = new Error("User not found");
        error.status = 404;
        throw error;
      }

      const resetToken = generateToken(user);
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
      await user.save();

      await sendPasswordResetEmail(email, resetToken);
      return true;
    } catch (error) {
      console.error("Error in initiatePasswordReset:", error);
      if (!error.status) {
        error.status = 500;
      }
      throw error;
    }
  }

  async resetPassword(token, email, newPassword) {
    try {
      const user = await verifyResetToken(token, email);
      if (!user) {
        const error = new Error("Invalid or expired reset token");
        error.status = 400;
        throw error;
      }

      await resetUserPassword(user, newPassword);
      await sendPasswordResetConfirmation(email);
      return true;
    } catch (error) {
      console.error("Error in resetPassword:", error);
      if (!error.status) {
        error.status = 500;
      }
      throw error;
    }
  }
}

module.exports = new UserService();
