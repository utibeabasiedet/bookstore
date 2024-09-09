const asyncHandler = require("express-async-handler");
const Cart = require("../models/cartModel");
const User = require("../models/userModel");
const mongoose = require('mongoose');

// Controller to add an item to the cart


const addToCart = asyncHandler(async (req, res) => {
  const { item } = req.body;

  // Validate that the item and item._id exist
  if (!item || !item._id) {
    return res.status(400).json({ message: "Invalid item data" });
  }

  // Get the logged-in user's ID from the request
  const userId = req.user._id;

  // Find the user's cart
  let cart = await Cart.findOne({ userId });

  // If the cart doesn't exist, create a new one
  if (!cart) {
    cart = new Cart({ userId, items: [] });
  }

  // Check if the item already exists in the cart
  const itemExists = cart.items.some(cartItem =>
    cartItem._id === item._id // Compare _id as a string
  );
  if (itemExists) {
    return res.status(400).json({ message: "Item already in cart" });
  }

  // Add the item to the cart
  cart.items.push({
    _id: item._id, // Ensure _id is correctly set as a string
    title: item.title,
    price: item.price,
    image: item.image // Ensure this matches the schema
  });

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

module.exports = { addToCart, getCartItems, deleteCartItem };
