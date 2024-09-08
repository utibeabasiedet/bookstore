const asyncHandler = require("express-async-handler");
const Cart = require("../models/cartModel");
const User = require("../models/userModel");

// Controller to add an item to the cart
const addToCart = asyncHandler(async (req, res) => {
  const { item } = req.body;

  // Get the logged-in user's ID from the request (ensure the user is authenticated)
  const userId = req.user._id; // Assuming the user ID is set in the request via middleware

  // Find the user's cart
  let cart = await Cart.findOne({ userId });

  // If the cart doesn't exist, create a new one
  if (!cart) {
    cart = new Cart({ userId, items: [] });
  }

  // Check if the item already exists in the cart
  const itemExists = cart.items.find(cartItem => cartItem._id === item._id);
  if (itemExists) {
    res.status(400).json({ message: "Item already in cart" });
    return;
  }

  // Add the item to the cart
  cart.items.push(item);

  // Save the cart
  await cart.save();

  res.json(cart);
});



const getCartItems = asyncHandler(async (req, res) => {
    const userId = req.user._id;
  
    // Find the user's cart
    const cart = await Cart.findOne({ userId });
  
    if (!cart || cart.items.length === 0) {
      // If the cart doesn't exist or has no items, return an empty array
      return res.json([]);
    }
  
    // If the cart exists and has items, return them
    res.json(cart.items);
  });

  const deleteCartItem = asyncHandler(async (req, res) => {
    const { itemId } = req.params;
    const userId = req.user._id;
  
    // Find the user's cart
    const cart = await Cart.findOne({ userId }); 
  
    if (!cart) {
      res.status(404).json({ message: "Cart not found" });
      return;
    }
  
    // Filter out the item to be deleted
    cart.items = cart.items.filter(item => item._id.toString() !== itemId);
  
    // Save the updated cart
    await cart.save();
  
    res.json(cart);
  });
  

module.exports = { addToCart,getCartItems,deleteCartItem };
