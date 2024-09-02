const User = require('../models/userModel');
const generateToken = require('../utils/generateToken');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');

// Register a new user
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400).json({ message: 'User already exists' });
        return;
    }

    const user = await User.create({
        name,
        email,
        password,
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
});

// Login user
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
        });
    } else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
});

// Logout user
const logoutUser = (req, res) => {
    res.cookie('token', '', { httpOnly: true, expires: new Date(0) });
    res.status(200).json({ message: 'Logged out successfully' });
};

// Get user profile
const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

// Update user profile
const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        if (req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            token: generateToken(updatedUser._id),
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

// Get all users
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find({});
    res.json(users);
});

// Delete user
const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        await user.remove();
        res.json({ message: 'User removed' });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

// Change password
const changePassword = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user && (await user.matchPassword(req.body.oldPassword))) {
        user.password = req.body.newPassword;
        await user.save();
        res.json({ message: 'Password updated successfully' });
    } else {
        res.status(400).json({ message: 'Old password is incorrect' });
    }
});

// Forgot password
const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (user) {
        // Generate reset token and send email
        // Note: Implement email sending logic here
        res.json({ message: 'Password reset email sent' });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

// Reset password
const resetPassword = asyncHandler(async (req, res) => {
    const { resetToken, newPassword } = req.body;

    // Find user by reset token and update password
    // Note: Implement token verification logic here
    res.json({ message: 'Password reset successful' });
});

// Login status
const loginStatus = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
        });
    } else {
        res.status(401).json({ message: 'Not logged in' });
    }
});

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    getAllUsers,
    deleteUser,
    changePassword,
    forgotPassword,
    resetPassword,
    loginStatus,
};
