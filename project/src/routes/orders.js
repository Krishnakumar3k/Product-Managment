const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// @route   POST /api/orders
// @desc    Create a new order
router.post('/', auth, orderController.createOrder);

// @route   PUT /api/orders/:orderId
// @desc    Update order status
router.put('/:orderId', [auth, admin], orderController.updateOrderStatus);

module.exports = router;