const crypto = require("crypto")
const Razorpay = require('razorpay');
const Order = require("../models/Order");
var instance = new Razorpay({ key_id: process.env.RAZORPAY_API_KEY, key_secret: process.env.RAZORPAY_SECRET_KEY });
const { handleProductQuantity } = require("../lib/stock-controller/others");
const { sendEmail } = require("../lib/email-sender/sender");
const customerInvoiceEmailBody = require("../lib/email-sender/templates/order-to-customer");

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
            // console.log("order placing...")
            const orderData = await newOrder.save();
            // res.status(201).send(orderData);
            // handleProductQuantity(orderData.cart);
            const option = {
                name: orderData.user_info.name,
                email: orderData.user_info.email,
                phone: orderData.user_info.contact,
                address: orderData.user_info.address,
                status: orderData.status,
                company_name: "Canvas Stocks",
                company_address: "123, gandhi road, mumbai, maharastra.",
                company_phone: "+91 12345 67899",
                company_email: "help.center@canvasStocks.com",
                company_website: "canvasStocks.com",
                date: orderData.createdAt,
                invoice: orderData.invoice,
                method: orderData.paymentMethod,
                cart: orderData.cart,
                currency: "₹",
                subTotal: orderData.subTotal,
                shipping: orderData.shippingCost,
                discount: orderData.discount,
                total: orderData.total
            };
            // console.log(option)
            // try {
                const body = {
                    from: process.env.EMAIL_USER,
                    to: `${orderData.user_info.email}`,
                    subject: "Order has been placed.",
                    html: customerInvoiceEmailBody(option),
                };
                // console.log(body);
            // } catch (error) {
            //     console.error("Error constructing email body:", error);
            // }

            const message = "Order has been placed";
            sendEmail(body, res, message);
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