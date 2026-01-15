const express = require('express');
const app = express();

// Your requestQueue middleware factory here

// Simulated slow operation (use this in your route)
const slowOperation = () => new Promise(resolve => setTimeout(resolve, 200));

// Your routes here

module.exports = app;
module.exports.slowOperation = slowOperation;
