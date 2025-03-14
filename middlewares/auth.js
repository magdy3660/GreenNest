const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async (req, res, next) => {
    try {
        // Get token from header or cookie
        const token = req.cookies.auth_token || req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            console.log('No token provided');
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
            if (err) {
                console.log('Token verification error:', err.name);
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
                    console.log('Invalid token payload:', decoded);
                    return res.status(401).json({
                        success: false,
                        message: 'Invalid token payload'
                    });
                }
          

                // Set user and token in request object
                req.userId = decoded.userId;
                console.log('Authentication successful for user:',decoded.userId);
                next();
            } catch (error) {
                console.error('Authentication error:', error);
                res.status(401).json({
                    success: false,
                    message: 'Authentication failed'
                });
            }
        });
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(401).json({
            success: false,
            message: 'Authentication failed'
        });
    }
};

module.exports = auth;