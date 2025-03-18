const DBService = require("../services/DB_service");
const User = require("../models/user");
const path = require('path');

exports.getProfile = async (req, res) => {
    const cookieId = req.userId;
    const userId = req.params.userId;

    if (cookieId !== userId) {
        return res.status(403).json({
            success: false,
            message: "Unauthorized access"
        });
    }

    try {
        const userDetails = await DBService.getUserDetails(userId);
        res.status(200).json({ success: true, data: userDetails });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.updateProfile = async (req, res) => {
    const cookieId = req.userId;
    const userId = req.params.userId;

    if (cookieId !== userId) {
        return res.status(403).json({
            success: false,
            message: "Unauthorized access"
        });
    }

    try {
        const updates = {};
        
        if (req.body.firstName) {
            updates['Name.firstName'] = req.body.firstName;
        }
        if (req.body.lastName) {
            updates['Name.lastName'] = req.body.lastName;
        }

        if (req.file) {
            updates.photo = path.join('uploads', req.file.filename);
        }

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                success: false,
                message: "No updates provided"
            });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: updates },
            { new: true, runValidators: true }
        );

        const userDetails = {
            email: updatedUser.email,
            name: updatedUser.Name.firstName + " " + updatedUser.Name.lastName,
            photo: updatedUser.photo
        };

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: userDetails
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};