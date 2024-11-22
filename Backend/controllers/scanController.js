const multer = require('multer');
const path = require('path');
const Scan = require('../models/scan');
const StorageService = require('../config/storage');

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
  }
}).single('image');

exports.postScan = async (req, res) => {
  try {
    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: err.message });
      }

      if (!req.file) {
        return res.status(400).json({ message: 'No image file provided' });
      }

      // Process image with AI model first
      const aiResult = await processImageWithAI(req.file);

      // Check if user is authenticated
      const isAuthenticated = req.user && req.user.id;

      let imageUrl = null;
      let savedScan = null;

      if (isAuthenticated) {
        // Only store image and save scan for authenticated users
        try {
          const storageService = new StorageService();
          const fileName = `${Date.now()}-${req.file.originalname}`;
          const filePath = `scans/${req.user.id}/${fileName}`;
          
          imageUrl = await storageService.uploadFile(req.file, filePath);

          const scan = new Scan(
            req.user.id,
            imageUrl,
            new Date(),
            aiResult,
          );

          savedScan = await scan.save();
        } catch (storageError) {
          console.error('Error storing image:', storageError);
          // Continue with AI results even if storage fails
        }
      }

      // Return appropriate response based on authentication status
      res.status(200).json({
        message: isAuthenticated ? "Scan saved successfully" : "Scan completed",
        scan: savedScan, // Will be null for guests
        aiResult,
        isStored: !!imageUrl
      });
    });
  } catch (error) {
    console.error('Error in postScan:', error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Mock AI processing function
async function processImageWithAI(file) {
  // Replace this with actual AI model integration
  return {
    confidence: 0.95,
    predictions: [
      { label: 'healthy', probability: 0.8 },
      { label: 'disease', probability: 0.2 }
    ]
  };
}