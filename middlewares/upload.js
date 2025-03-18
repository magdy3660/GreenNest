const multer = require('multer');
const path = require('path');


// Add pre-upload middleware to check if request has file
const preUploadCheck = (req, res, next) => {
    console.log('Pre-upload check:', {
        hasFile: !!req.files,
        contentType: req.headers['content-type'],
        body: req.body
    });
    next();
};

// Define allowed image types
const MIME_TYPES = {
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/png': 'png'
};

// Enhanced file filter with more logging
const fileFilter = (req, file, cb) => {
    console.log("FileFilter function called");
    console.log("File details:", { 
        originalname: file.originalname, 
        mimetype: file.mimetype,
        fieldname: file.fieldname
    });
    
    const allowedTypes = Object.keys(MIME_TYPES);
    if (!allowedTypes.includes(file.mimetype)) {
        console.log("File type rejected:", file.mimetype);
        const error = new Error('Invalid file type. Only JPG and PNG images are allowed');
        error.code = 'INVALID_FILE_TYPE';
        return cb(error, false);
    }
    console.log("File type accepted");
    cb(null, true);
// Define allowed image types
const MIME_TYPES = {
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/png': 'png'
};

// File filter function


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

// Configure multer
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
        files: 1 // Only 1 file at a time
    }
});

module.exports = [preUploadCheck, upload.single('plantImage')];