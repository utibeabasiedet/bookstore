const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    orderItems: [
        {
            title: { type: String, required: true },
            author: { type: String, required: true },
            price: { type: Number, required: true },
            quantity: { 
                type: Number, 
                required: true, 
                default: 1 // Default quantity is 1
            },
            book: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'Book',
            },
        },
    ],
    totalPrice: {
        type: Number,
        required: true,
    },
    isPaid: {
        type: Boolean,
        required: true,
        default: false,
    },
    paidAt: {
        type: Date,
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
        default: 'pending',
    },
    statusHistory: [
        {
            status: { type: String, required: true },
            changedAt: { type: Date, default: Date.now },
        },
    ],
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
