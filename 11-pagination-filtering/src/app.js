const express = require('express');
const app = express();

// Sample dataset (25 products)
const products = [
  { id: 1, name: 'Laptop', price: 999, status: 'active', category: 'electronics' },
  { id: 2, name: 'Phone', price: 699, status: 'active', category: 'electronics' },
  { id: 3, name: 'Tablet', price: 499, status: 'active', category: 'electronics' },
  { id: 4, name: 'Headphones', price: 199, status: 'active', category: 'electronics' },
  { id: 5, name: 'Monitor', price: 349, status: 'inactive', category: 'electronics' },
  { id: 6, name: 'Keyboard', price: 89, status: 'active', category: 'accessories' },
  { id: 7, name: 'Mouse', price: 49, status: 'active', category: 'accessories' },
  { id: 8, name: 'Webcam', price: 79, status: 'inactive', category: 'accessories' },
  { id: 9, name: 'Desk Chair', price: 299, status: 'active', category: 'furniture' },
  { id: 10, name: 'Standing Desk', price: 599, status: 'active', category: 'furniture' },
  { id: 11, name: 'Desk Lamp', price: 45, status: 'active', category: 'furniture' },
  { id: 12, name: 'USB Hub', price: 35, status: 'active', category: 'accessories' },
  { id: 13, name: 'External SSD', price: 129, status: 'active', category: 'storage' },
  { id: 14, name: 'External HDD', price: 79, status: 'inactive', category: 'storage' },
  { id: 15, name: 'Flash Drive', price: 15, status: 'active', category: 'storage' },
  { id: 16, name: 'Printer', price: 199, status: 'active', category: 'electronics' },
  { id: 17, name: 'Scanner', price: 149, status: 'inactive', category: 'electronics' },
  { id: 18, name: 'Router', price: 89, status: 'active', category: 'networking' },
  { id: 19, name: 'Switch', price: 39, status: 'active', category: 'networking' },
  { id: 20, name: 'Ethernet Cable', price: 12, status: 'active', category: 'networking' },
  { id: 21, name: 'Mousepad', price: 19, status: 'active', category: 'accessories' },
  { id: 22, name: 'Monitor Stand', price: 49, status: 'active', category: 'furniture' },
  { id: 23, name: 'Cable Management', price: 25, status: 'active', category: 'accessories' },
  { id: 24, name: 'Surge Protector', price: 35, status: 'active', category: 'electronics' },
  { id: 25, name: 'UPS Battery', price: 149, status: 'inactive', category: 'electronics' }
];

// Your implementation here

module.exports = app;
module.exports.products = products;
