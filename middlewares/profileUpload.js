const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function(req, file, cb) {
    // Create unique filename with original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// File filter function
const fileFilter = (req, file, cb) => {
  // Accept only image files
  const allowedFileTypes = /jpeg|jpg|png|JPEG/;
  const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedFileTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Create multer upload instance
const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Middleware wrapper for better error handling
module.exports = (req, res, next) => {
  console.log("Received file upload request");

  const uploadMiddleware = upload.single('profilePhoto');
  
  uploadMiddleware(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          message: 'File size too large. Maximum size is 5MB'
        });
      }
      // Handle other multer errors
      return res.status(400).json({
        success: false,
        message: `File upload error: ${err.code}`
      });
    } else if (err) {
      return res.status(500).json({
        success: false,
        message: err.message
      });
    }
    
    // Check if file was uploaded successfully
    if (!req.file) {
      console.log("No file detected in the request");
      // Continue anyway, let the controller handle missing file
    } else {
      console.log(`File uploaded successfully: ${req.file.originalname}`);
    }
    
    console.log("Proceeding to next middleware/controller");
    next();
  });
};