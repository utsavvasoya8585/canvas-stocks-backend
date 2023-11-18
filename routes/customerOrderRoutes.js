const express = require("express");
const router = express.Router();
const {
  addOrder,
  getOrderById,
  getOrderCustomer,
  createPaymentIntent,
  sendMailForUpdateStatus,
} = require("../controller/customerOrderController");

//add a order
router.post("/add", addOrder);

// create stripe payment intent
router.post("/create-payment-intent", createPaymentIntent);

//get a order by id
router.get("/:id", getOrderById);

//get all order by a user
router.get("/", getOrderCustomer);

// send notification for order updation
router.get("/notification", sendMailForUpdateStatus);

module.exports = router;
