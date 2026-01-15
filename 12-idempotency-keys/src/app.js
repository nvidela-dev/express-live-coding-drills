const express = require('express');
const app = express();

app.use(express.json());

// Counter to track actual payment processing (for testing)
let paymentCounter = 0;
let orderCounter = 0;

const getPaymentCounter = () => paymentCounter;
const getOrderCounter = () => orderCounter;
const resetCounters = () => {
  paymentCounter = 0;
  orderCounter = 0;
};

// Your idempotency middleware factory here

// Your routes here
// When processing a payment, increment paymentCounter
// When processing an order, increment orderCounter

module.exports = app;
module.exports.getPaymentCounter = getPaymentCounter;
module.exports.getOrderCounter = getOrderCounter;
module.exports.resetCounters = resetCounters;
