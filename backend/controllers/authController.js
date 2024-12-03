const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { sendVerificationEmail, sendPasswordResetEmail } = require('../services/email_service');
const  generateToken  = require('../services/jwt_service');

exports.register = async (req, res) => {
    try {
        console.log('Registration request body:', req.body);
        const { name, email, password } = req.body;
        
        if (!email || !password || !name) {
            console.log('Missing required fields:', { email: !!email, password: !!password, name: !!name });
            return res.status(400).json({
                message: 'Registration failed: All fields are required',
            });
        }

        console.log('Registration attempt:', { email, name });

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log('Registration failed: Email already exists:', email);
            return res.status(400).json({
                message: 'Registration failed: User Already Exists',
            });
        }
        
        // create new user
        const user = new User({
            email,
            password,
            name
        });

        // Generate verification token
        const verificationToken = user.generateEmailVerificationToken();
        await user.save();

        // Send verification email
        try {
            await sendVerificationEmail(user.email, verificationToken);
        } catch (emailError) {
            console.error('Failed to send verification email:', emailError);
            return res.status(500).json({
                success: false,
                message: 'Failed to send verification email'
            });
        }

  

        
        return res.status(201).json({
            message: 'Registration successful. Please check your email for verification link',
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                isEmailVerified: user.isEmailVerified
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error registering user'
        });
    }
};


exports.verifyEmail = async (req, res) => {
    try {
        const { token } = req.query;
        
        const user = await User.findOne({
            emailVerificationToken: token,
            emailVerificationExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired verification token'
            });
        }

        user.isEmailVerified = true;
        user.emailVerificationToken = undefined;
        user.emailVerificationExpires = undefined;
        await user.save();

        console.log('Email verified successfully for user:', user._id);
        return res.status(200).json({
            success: true,
            message: 'Email verified successfully'
        });
    } catch (error) {
        console.error('Email verification error:', error);
        res.status(500).json({
            success: false,
            message: 'Error verifying email'
        });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("Login attempt", { email });
        
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(401).json({ 
                success: false,
                message: 'Invalid credentials' 
            });
        }

        // Check if email is verified
        if (!user.isEmailVerified) {
            return res.status(403).json({
                success: false,
                message: 'Please verify your email before logging in',
                isEmailVerified: false
            });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ 
                success: false,
                message: 'Invalid credentials' 
            });
        }
        const token = generateToken(user);

        console.log("User logged in successfully:", {
            name: user.name,
            email: user.email
        });

        // Set token in cookie
        res.cookie('auth_token', token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000, // 24 hours
            sameSite: 'lax'
        });

        return res.status(200).json({
            success: true,
            message: 'Login successful',
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ 
            success: false,
            message: 'Login failed' 
        });
    }
};
exports.logout = async (req, res) => {
    try {
        // At this point, we know the user is authenticated because of the auth middleware
        console.log('Logging out user:', req.user.email);
        
        // Clear the auth token cookie
        res.clearCookie('auth_token');
        
        return res.status(200).json({
            success: true,
            message: 'Logged out successfully'
        });
    } catch (error) {
        console.error('Logout error:', error);
        return res.status(500).json({
            success: false,
            message: 'Error during logout'
        });
    }
};
exports.getResetPasswordToken = async (req, res) => {
    try {
        const { email } = req.body;
        console.log('Password reset request for email:', email);
        
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        
        // Generate password reset token
        const resetToken = generateToken(user);
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000; //1h
        await user.save();
        const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
        try {
             sendPasswordResetEmail(user.email, resetToken)
        } catch (emailError) {
            console.error('Password reset error:', error);

        }
    } catch (error) {
        console.error('Password reset error:', error);
        return res.status(500).json({
            success: false,
            message: 'Error resetting password'
        });
    }
};
exports.resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        const user = await User.findOne({ email, resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired reset token'
            });
        }
   
        // Update user password and clear reset token
        user.password = newPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        sendResetLog(user.email)
      
          res.status(200).json({ 
            message: 'Password reset successful' 
          });
        } catch (error) {
          res.status(500).json({ 
            message: 'Error resetting password', 
            error: error.message 
          });
        }
      };