const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// @route   POST /api/products
// @desc    Add a new product
router.post('/', [auth, admin], productController.addProduct);

// @route   GET /api/products
// @desc    Get products based on user location
router.get('/', auth, productController.getProductsByLocation);

// @route   GET /api/products/low-stock
// @desc    Get products with low stock
router.get('/low-stock', [auth, admin], productController.checkLowStock);

module.exports = router;