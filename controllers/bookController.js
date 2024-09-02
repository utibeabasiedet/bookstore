const Book = require('../models/bookModel');

// Get all books
const getBooks = async (req, res) => {
    const books = await Book.find({});
    res.json(books);
};

// Add a new book
const addBook = async (req, res) => {
    const { title, author, price, description } = req.body;
    const book = new Book({
        title,
        author,
        price,
        description,
    });

    const createdBook = await book.save();
    res.status(201).json(createdBook);
};

module.exports = { getBooks, addBook };
