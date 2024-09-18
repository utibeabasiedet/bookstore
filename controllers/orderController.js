const Order = require('../models/orderModel');
const asyncHandler = require("express-async-handler");

const User = require("../models/userModel");

// Create a new order
const createOrder = async (req, res) => {
    const { orderItems, totalPrice } = req.body;

    if (orderItems && orderItems.length === 0) {
        return res.status(400).json({ message: 'No order items provided' });
    }

    try {
        const newOrder = new Order({
            user: req.user._id, // Assumes you have user authentication
            orderItems,
            totalPrice,
            status: 'pending',
            statusHistory: [{ status: 'pending' }],
        });

        const createdOrder = await newOrder.save();
        res.status(201).json(createdOrder);
    } catch (error) {
        res.status(500).json({ message: 'Error creating order', error });
    }
};

// Update order status
const updateOrderStatus = async (req, res) => {
    const { orderId, status } = req.body;

    try {
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        order.status = status;
        order.statusHistory.push({ status });
        await order.save();

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: 'Error updating order status', error });
    }
};

// Get orders for the logged-in user
const getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user orders', error });
    }
};

// Get all orders (Admin)
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders', error });
    }
};

module.exports = {
    createOrder,
    updateOrderStatus,
    getUserOrders,
    getAllOrders,
};
