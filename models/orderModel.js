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
            quantity: { type: Number, required: true },
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
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
