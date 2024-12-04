const fs = require('fs');
const path = require('path');
const multer = require('multer');

// Define allowed image types
const MIME_TYPES = {
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/png': 'png'
};

// File filter function
const fileFilter = (req, file, cb) => {
    const allowedTypes = Object.keys(MIME_TYPES);
    
    if (!allowedTypes.includes(file.mimetype)) {
        const error = new Error('Invalid file type. Only JPG and PNG images are allowed');
        error.code = 'INVALID_FILE_TYPE';
        return cb(error, false);
    }
    cb(null, true);
};

// Configure storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const extension = MIME_TYPES[file.mimetype];
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${uniqueSuffix}.${extension}`);
    }
});

// Configure upload with limits
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
        files: 1 // Only 1 file at a time
    }
});

// Export the middleware
module.exports = upload.single('plantImage');
