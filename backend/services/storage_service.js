
// Add a function to handle file uploads
exports.storeFile = async (file) => {
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