const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  _id: String,
  title: String,
  price: Number,
  description: String,
  image: String,
});

const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Use ObjectId to reference the User model
  items: [cartItemSchema],
});

module.exports = mongoose.model('Cart', cartSchema);
