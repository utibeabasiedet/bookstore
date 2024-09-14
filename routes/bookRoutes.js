const express = require("express");
const { protect, adminMiddleware } = require("../middleware/authMiddleware");
const {
  getBooks,
  addBook,
  editBook,
  deleteBook,
  deleteAllBooks,
  getBookById,
} = require("../controllers/bookController"); // Ensure the path is correct

const { upload } = require("../cloudinary"); // Assuming this is your Cloudinary config
const router = express.Router();

router
  .route("/")
  .get(getBooks) // Ensure getBooks is defined
  // Get book by ID route

  .post(upload.single("image"), addBook); // Ensure addBook is defined
router.route("/delete-all").delete(protect, deleteAllBooks);

router.get('/books/:id', getBookById);

router
  .route("/:id")
  .put(upload.single("image"), editBook) // Ensure editBook is defined
  .delete(deleteBook); // Ensure deleteBook is defined
// Only admins can delete all books

module.exports = router;
