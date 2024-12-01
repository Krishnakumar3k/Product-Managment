const Product = require('../models/Product');
const Warehouse = require('../models/Warehouse');
const User = require('../models/User');
const { getDistance } = require('geolib');

exports.addProduct = async (req, res) => {
  try {
    const { name, description, price, warehouseId, stock, lowStockThreshold } = req.body;

    const warehouse = await Warehouse.findById(warehouseId);
    if (!warehouse) {
      return res.status(404).json({ message: 'Warehouse not found' });
    }

    const product = new Product({
      name,
      description,
      price,
      warehouse: warehouseId,
      stock,
      lowStockThreshold
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getProductsByLocation = async (req, res) => {
  try {
    const { userId } = req.user;
    const user = await User.findById(userId);
    
    if (!user || !user.location) {
      return res.status(400).json({ message: 'User location not found' });
    }

    const warehouses = await Warehouse.find({
      location: {
        $near: {
          $geometry: user.location,
          $maxDistance: 10000 // 10km in meters
        }
      }
    });

    const warehouseIds = warehouses.map(w => w._id);
    const products = await Product.find({
      warehouse: { $in: warehouseIds },
      stock: { $gt: 0 }
    }).populate('warehouse');

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.checkLowStock = async (req, res) => {
  try {
    const lowStockProducts = await Product.find({
      $expr: {
        $lte: ['$stock', '$lowStockThreshold']
      }
    }).populate('warehouse');

    res.json(lowStockProducts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};