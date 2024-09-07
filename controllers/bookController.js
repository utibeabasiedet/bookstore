const Book = require("../models/bookModel");

// Get all books
const getBooks = async (req, res) => {
  try {
    const books = await Book.find(); // Assuming you're using Mongoose
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a new book
const addBook = async (req, res) => {
  try {
    // Extract non-file fields from req.body
    const { title, description } = req.body;
    
    // Extract prices from req.body (assuming prices is a JSON string)
    const prices = JSON.parse(req.body.prices);

    // Extract the file (from multer)
    const image = req.file;

    // Ensure the image is present
    if (!image) {
      return res.status(400).json({ error: 'Image is required' });
    }

    // Get the Cloudinary image URL from the multer upload
    const imageUrl = image.path; // `multer-storage-cloudinary` stores the URL in `file.path`

    // Create a new book instance with the extracted data
    const newBook = new Book({
      title,
      description,
      prices: {
        NGN: prices.NGN,
        EU: prices.EU,
        UK: prices.UK,
        US: prices.US,
      },
      imageUrl, // Save the Cloudinary image URL
    });

    // Save the book to the database
    await newBook.save();

    // Send a success response
    res.status(201).json({ message: 'Book created successfully!', book: newBook });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while creating the book' });
  }
};





// Edit a book
const editBook = async (req, res) => {
  const { id } = req.params;
  const { title, prices, description } = req.body;
  const image = req.file ? req.file.path : undefined;

  const book = await Book.findById(id);

  if (book) {
    book.title = title || book.title;
    book.prices = prices || book.prices;
    book.description = description || book.description;
    if (image) {
      book.image = image;
    }

    const updatedBook = await book.save();
    res.json(updatedBook);
  } else {
    res.status(404).json({ message: "Book not found" });
  }
};


// Delete a book
const deleteBook = async (req, res) => {
  const { id } = req.params;
  const book = await Book.findById(id);

  if (book) {
    await book.remove();
    res.json({ message: "Book removed" });
  } else { 
    res.status(404).json({ message: "Book not found" });
  }
};

const deleteAllBooks = async (req, res) => {
  // Check if the user is an admin
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }

  try {
    // Delete all books from the database
    await Book.deleteMany({});
    res.json({ message: "All books removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getBooks, addBook, editBook, deleteBook, deleteAllBooks };
