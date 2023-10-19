const express = require("express");
const router = express.Router();
const {checkout, paymentVerification, getKey} =  require("../controller/razorpayController.js");

router.post("/checkout", checkout)
router.post("/payment-verification", paymentVerification)
router.get("/get-razorpay-key", getKey);

module.exports = router;