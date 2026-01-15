const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();

app.use(express.json());

// Use this secret for signing tokens
const JWT_SECRET = 'your-secret-key';

// Test users
const users = [
  { username: 'admin', password: 'password123' },
  { username: 'user', password: 'userpass' }
];

// Your auth middleware here

// Your routes here

module.exports = app;
