const express = require('express');
const app = express();

app.use(express.json());

// Your validate middleware factory here

// Your routes here

module.exports = app;
