
const User = require("../models/user");
const EmailService = require("./email_service");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
class AuthService {

  async registerUser(userData) {
    const { email, password, firstName, lastName } = userData;

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      const message = new Error("User already exists");
      throw message;
    }

    try {
      // Create new user
      const hashedPassword = await this.hashPassword(password);
      const user = new User({
        email,
        password: hashedPassword,
          firstName,
          lastName,
        
      });

      // Generate verification token and save user
      const emailToken = EmailService.generateEmailToken(user);
      user.emailVerificationToken = emailToken;
      user.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
      await user.save();

      // Send verification email
      await EmailService.sendVerificationEmail(user.email, emailToken);

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

  

  async loginUser(email, password) {
    try {
      let user = await User.findOne({ email });

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

      const isMatch = await this.comparePassword(password, user.password);

      if (!isMatch) {
        const error = new Error("Invalid credentials");
        error.status = 401;
        throw error;
      }
      user = {
        userId:user._id,
        email:user.email,
        firstName:user.firstName,
        lastName:user.lastName,
        photo_url:user.photoPath
      }
      const jwt = AuthService.generateJWT(user)

      return {
        jwt,
        user
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


// Password operations==========================================================

async resetUserPassword(user, newPassword) {
  const hashedPassword = await hashPassword(newPassword);
  user.password = hashedPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  
  await user.save();

  return user;
};

async hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

async comparePassword(inputPassword, hashedPassword){
  return await bcrypt.compare(inputPassword, hashedPassword);
};

static generateJWT(user) {

  const payload = { 
    userId: user.userId,
     email: user.email,
     firstName: user.firstName,
     lastName: user.lastName,
     photoPath: user.photoPath? user.photoPath : null
    };
  const secret = process.env.JWT_SECRET
  const options = { expiresIn: '24h' };

  return jwt.sign(payload, secret, options);  // returns a string
}

}

module.exports = new AuthService();