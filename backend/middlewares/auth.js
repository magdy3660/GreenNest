const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async (req, res, next) => {
    try {
        // Get token from header or cookie
        const token = req.cookies.auth_token || req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
            if (err) {
                if (err.name === 'TokenExpiredError') {
                    return res.status(401).json({
                        success: false,
                        message: 'Token expired, please login again'
                    });
                }
                if (err.name === 'JsonWebTokenError') {
                    return res.status(401).json({
                        success: false,
                        message: 'Invalid token'
                    });
                }
                return res.status(401).json({
                    success: false,
                    message: 'Authentication failed'
                });
            }

            try {
                if (!decoded.userId || typeof decoded.userId !== 'string') {
                    return res.status(401).json({
                        success: false,
                        message: 'Invalid token payload'
                    });
                }

                // Find user
                const user = await User.findOne({ _id: decoded.userId });

                if (!user) {
                    return res.status(401).json({
                        success: false,
                        message: 'Invalid Credentials'
                    });
                }

                // Check if email is verified 
                if (!user.isEmailVerified) {
                    return res.status(403).json({
                        success: false,
                        message: 'Please verify your email first'
                    });
                }

                // Add user to request
                req.user = user;
                next();
            } catch (error) {
                console.error('Auth middleware error:', error);
                return res.status(401).json({
                    success: false,
                    message: 'Please authenticate'
                });
            }
        });
    } catch (error) {
        console.error('Auth middleware error:', error);
        return res.status(401).json({
            success: false,
            message: 'Authentication failed'
        });
    }
};

module.exports = auth;