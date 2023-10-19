const crypto = require("crypto")
const Razorpay = require('razorpay');
const Order = require("../models/Order");
var instance = new Razorpay({ key_id: process.env.RAZORPAY_API_KEY, key_secret: process.env.RAZORPAY_SECRET_KEY });
const { handleProductQuantity } = require("../lib/stock-controller/others");

const checkout = async (req, res) => {
    const options = {
        amount: Number(req.body.amount) * 100,
        currency: "INR"
    };
    const order = await instance.orders.create(options);
    // console.log(order);
    res.status(200).json({
        success: true,
        order
    })
}

const paymentVerification = async (req, res) => {
    // console.log(req.body)
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET_KEY)
        .update(body.toString())
        .digest('hex')

    // console.log({ razorpay_signature, expectedSignature })
    const isAuthentic = expectedSignature === razorpay_signature;
    if (isAuthentic) {
        // save order in database
        try {
            const newOrder = new Order({
                ...req.body,
            });
            const orderData = await newOrder.save();
            res.status(201).send(orderData);
            handleProductQuantity(orderData.cart);
        } catch (err) {
            res.status(500).send({
                message: err.message,
            });
        }

        // res.redirect(process.env.STORE_URL);
    } else {
        res.status(400).json({
            success: false
        })
    }
}

const getKey = (req, res) => {
    res.status(200).json({
        key: process.env.RAZORPAY_API_KEY
    })
}

module.exports = {
    checkout,
    paymentVerification,
    getKey
}