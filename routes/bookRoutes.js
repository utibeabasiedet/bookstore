const express = require('express');
const { getBooks, addBook } = require('../controllers/bookController');
const router = express.Router();

router.route('/').get(getBooks).post(addBook);

module.exports = router;
