const User = require('../models/userModel');
const generateToken = require('../utils/generateToken');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

// Register a new user
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, isAdmin, phoneNumber } = req.body; // Added isAdmin field

  const userExists = await User.findOne({ email });

  if (userExists) {
      res.status(400).json({ message: 'User already exists' });
      return;
  }

  const user = await User.create({
      name,
      email,
      password,
      phoneNumber,
      isAdmin: isAdmin || false,  // Default isAdmin to false if not provided
  });

  if (user) {
      const token = generateToken(user._id);
      
      // Send HTTP-only cookie
      res.cookie('token', token, {
          path: '/',
          httpOnly: true,
          expires: new Date(Date.now() + 1000 * 86400), // 1 day
          sameSite: 'none',
          secure: true,
      });

      res.status(201).json({
          _id: user._id,
          name: user.name,
          email: user.email,
          phoneNumber: user.phoneNumber,
          isAdmin: user.isAdmin,  // Include isAdmin in response
          token: token,
      });
  } else {
      res.status(400).json({ message: 'Invalid user data' });
  }
});


// Login user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Perform login logic here
    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    // Set cookie
    // Set cookie
    res.cookie("token", token, {
      path: "/",
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 86400), // 1 day  
      sameSite: "none",
      secure: true,
    });


    // Return token and user information
    res.status(200).json({
      message: 'Login successful',
      token,  // Return token as part of the response
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        phoneNumber: user.phoneNumber
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

  


const logoutUser = asyncHandler(async (req, res) => {
  res.cookie('token', '', {
    path: '/',  // Ensure the path is correct
    httpOnly: true,
    expires: new Date(0),
    sameSite: 'None',
    secure: true,  // Set to true for secure environments (HTTPS)
  });

  res.status(200).json({ message: 'Logged out successfully' });
});
 

// Get user profile
const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            phoneNumber: user.phoneNumber

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
// Get one user
const getUser = asyncHandler(async (req, res) => {
    const user =  await User.findById(req.params.id);
    res.json(user);
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

const deleteAllUsers = asyncHandler(async (req, res) => {
  const result = await User.deleteMany({}); // Deletes all users

  if (result.deletedCount > 0) {
      res.json({ message: `${result.deletedCount} users removed` });
  } else {
      res.status(404).json({ message: 'No users found to delete' });
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
// const loginStatus= asyncHandler(async (req, res) => {
//     const token = req.cookies.token;
//   if (!token) {
//     return res.json(false);
//   }
//   // Verify Token
//   const verified = jwt.verify(token, process.env.JWT_SECRET);
//   if (verified) {
//     return res.json(true);
//   }
//   return res.json(false);
// });
const loginStatus = (req, res) => {
    try {
      const token = req.cookies.token; // Ensure that the token is being read from the cookies
  
      if (!token) {
        return res.json({ isLoggedIn: false }); // No token found, user is not logged in
      }
  
      // Verify token (you should use the same secret as when you created the token)
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          return res.json({ isLoggedIn: false }); // Invalid token
        }
  
        return res.json({ isLoggedIn: true, userId: decoded.id }); // Valid token
      });
    } catch (error) {
      return res.json({ isLoggedIn: false });
    }
  };

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    getAllUsers,
    deleteUser,
    deleteAllUsers ,
    changePassword,
    forgotPassword,
    resetPassword,
    loginStatus,
    getUser
};
