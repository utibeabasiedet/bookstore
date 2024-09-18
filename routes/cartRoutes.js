const express = require('express');
const { addToCart ,getCartItems, deleteCartItem,clearCart } = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Protect the route so only authenticated users can add to cart
router.post('/add', protect, addToCart);

// Route to get cart items
router.get("/", protect, getCartItems);



// Route to delete an item from the cart
router.delete("/delete/:itemId", protect, deleteCartItem);

// Route to clear all items from the cart
router.delete("/clear", protect, clearCart);
module.exports = router;
