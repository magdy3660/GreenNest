const fs = require('fs');

// Add a function to handle file uploads
exports.uploadFile = async (file) => {
    try {
        // Ensure uploads directory exists
        const uploadDir = 'uploads/';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        return {
            path: file.path,
            filename: file.filename,
            originalname: file.originalname,
            mimetype: file.mimetype
        };
    } catch (error) {
        console.error('Error in file upload:', error);
        throw error;
    }
};

exports.deleteFile = async (filePath) => {
    try {
        if (fs.existsSync(filePath)) {
            await fs.promises.unlink(filePath);
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error deleting file:', error);
        throw error;
    }
};