const axios = require('axios');
const Order = require('../models/orderModel');

const initiatePayment = async (req, res) => {
    const { orderId, email, amount } = req.body;

    try {
        const response = await axios.post(
            'https://api.paystack.co/transaction/initialize',
            {
                email,
                amount: amount * 100, // Paystack uses kobo
                reference: orderId,
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                },
            }
        );

        res.json({ authorization_url: response.data.data.authorization_url });
    } catch (error) {
        res.status(500).json({ message: 'Error initiating payment', error });
    }
};

const verifyPayment = async (req, res) => {
    const { reference } = req.query;

    try {
        const response = await axios.get(
            `https://api.paystack.co/transaction/verify/${reference}`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                },
            }
        );

        if (response.data.data.status === 'success') {
            const order = await Order.findById(reference);

            if (order) {
                order.isPaid = true;
                order.paidAt = Date.now();

                const updatedOrder = await order.save();
                res.json(updatedOrder);
            } else {
                res.status(404).json({ message: 'Order not found' });
            }
        } else {
            res.status(400).json({ message: 'Payment not verified' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error verifying payment', error });
    }
};

module.exports = { initiatePayment, verifyPayment };
