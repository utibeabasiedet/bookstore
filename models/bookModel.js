const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    
    prices: {
        NGN: { type: Number, required: true },
        EU: { type: Number, required: true },
        UK: { type: Number, required: true },
        US: { type: Number, required: true },
      },
    description: {
        type: String,
    },
    image: {
        type: String, // URL of the image stored in Cloudinary
        required: false,
    },
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book; 

