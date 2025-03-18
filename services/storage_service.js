const fs = require('fs');
const DB_service = require('./DB_service');
// Ensure upload directory exists
const ensureUploadDir = () => {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }
};

// File metadata handling
const storeImageMetadata = async (file) => {
    try {
        ensureUploadDir();
        const imageMetadata = {
            user: userId,
            image_metadata: {
                image_name: file.originalname,
                image_path: file.path
            }
        };
        return await DB_service.saveToHistory(imageMetadata);
    } catch (error) {
        console.error('Error processing file metadata:', error);
        throw error;
    }
};

const deleteFile = async (filePath) => {
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

module.exports = {
    storeImageMetadata,
    deleteFile
};