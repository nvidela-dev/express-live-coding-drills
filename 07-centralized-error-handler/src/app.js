const express = require('express');
const app = express();

app.use(express.json());

// Your custom error classes here

// Your routes here

// Your error handler middleware here (must be last)

module.exports = app;
