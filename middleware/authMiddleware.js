const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');





const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check if the token exists in cookies
  if (req.cookies && req.cookies.token) {
    try {
      token = req.cookies.token;

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Decoded Token:', decoded); // Debugging

      // Attach user information to the request object
      req.user = await User.findById(decoded.id).select('-password');
      console.log('User from Token:', req.user); // Debugging

      if (!req.user) {
        return res.status(404).json({ message: 'User not found' });
      }

      next();
    } catch (error) {
      console.error('Token Verification Error:', error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
});

module.exports = protect;




// Middleware to protect admin routes
const adminMiddleware = asyncHandler((req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized as admin' });
    }
});

module.exports = { protect, adminMiddleware };
