const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
    console.log("Auth middleware triggered..."); 

    if (!process.env.JWT_SECRET) {
        console.error('FATAL ERROR: JWT_SECRET is not defined in environment variables.');
        return res.status(500).json({ 
            success: false,
            message: 'Internal server configuration error.'
        });
    }

    try {
        const token = req.header('Authorization')?.replace('Bearer ', '') || req.token; 

        if (!token) {
            console.log('No token provided.');
            return res.status(401).json({
                success: false,
                message: 'Authentication required: No token provided.'
            });
        }

        // 3. Verify the token synchronously
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);

        } catch (err) {
            console.log('Token verification failed:', err.name, err.message);
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({
                    success: false,
                    message: 'Token expired, please login again.'
                });
            }
            if (err.name === 'JsonWebTokenError') {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid token.' 
                });
            }
          
            return res.status(401).json({
                success: false,
                message: 'Token verification failed.'
            });
        }

        if (!decoded || typeof decoded.userId !== 'string' || !decoded.userId) {
            console.log('Invalid token payload:', decoded);
            return res.status(401).json({
                success: false,
                message: 'Invalid token payload.'
            });
        }
        req.user = {...decoded}
      

       if (req.params.userId) {
            if (req.userId === req.params.userId) {
                next();
            } else {
                console.log(`Authorization failed: User ${req.userId} tried to access resource ${req.params.userId}.`);
                
                return res.status(403).json({
                    success: false,
                    message: 'Forbidden: You do not have permission to access this resource.'
                });
            }
        } else {
          
             console.log("proceeding")
             next(); // User is authenticated

        }

    } catch (error) {
        console.error('Unexpected error in auth middleware:', error);
        res.status(500).json({ 
            success: false,
            message: 'An internal server error occurred during authentication.'
        });
    }
};

module.exports = auth;