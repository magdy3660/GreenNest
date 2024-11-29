const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async (req, res, next) => {
    try {
        // Check for token in different places
        const token = 
            req.cookies.auth_token || // Check cookies first
            (req.header('Authorization') || '').replace('Bearer ', '') || // Then check Authorization header
            req.query.token; // Finally check query string

        if (!token) {
            throw new Error('No token provided');
        }

        // Decode and verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded token:', decoded); // Debug log

        if (!decoded.userId) {
            throw new Error('Invalid token format - missing userId');
        }

        // Find user by ID
        const user = await User.findById(decoded.userId);
        console.log('Found user:', user ? 'Yes' : 'No'); // Debug log

        if (!user) {
            throw new Error('User not found');
        }

        // Attach user to request
        req.user = user;
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        // Log additional debug information
        if (error.name === 'JsonWebTokenError') {
            console.error('JWT Error:', error.message);
        }
        
        const acceptsJson = req.headers.accept && req.headers.accept.includes('application/json');
        if (req.xhr || acceptsJson) {
            return res.status(401).json({ error: 'Please authenticate', details: error.message });
        }
        res.redirect('/login');
    }
};

module.exports = auth;