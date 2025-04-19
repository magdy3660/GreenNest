const jwt = require('jsonwebtoken');

exports.auth = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '') || req.token; 
    const userId = req.params.userId;
    
    if (!token) {
        console.log('No token provided. Ensure token is passed in Authorization header or as token parameter');
        return res.status(401).json({
            success: false,
            message: 'Authentication required: No token provided'
        });
    }

    if (!userId) {
        console.log('No userId provided in URL parameters');
        return res.status(400).json({
            success: false,
            message: 'Missing userId parameter in URL'
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        if (!decoded || !decoded.userId) {
            return res.status(401).json({
                success: false,
                message: 'Invalid token'
            });
        }

        req.user = {...decoded};
        console.log("req.user object returned.", req.user);
        
        // Verify userId in URL matches the decoded token's userId
        if (userId !== decoded.userId) {
            console.log(`Authorization failed: User ${decoded.userId} tried to access resource ${userId}`);
            return res.status(403).json({
                success: false,
                message: 'Forbidden: You do not have permission to access this resource'
            });
        }

        next();
    } catch (error) {
        console.error('JWT verification failed:', error);
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token'
        });
    }
};