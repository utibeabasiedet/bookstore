const express = require('express');
const { createOrder, getUserOrders , getAllOrders, updateOrderStatus, deleteOrder } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Route to create a new order (only authenticated users)
router.post('/create', protect, createOrder);

// // Route to get all orders for the authenticated user
 router.get('/', protect, getAllOrders);

// Route to get a specific order by ID (only authenticated users)
router.get('/:orderId', protect, getUserOrders );



// // Route to update the status of a specific order
router.put('/:orderId/status', protect, updateOrderStatus);



module.exports = router;
