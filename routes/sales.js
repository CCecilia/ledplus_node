const express = require('express');
const router = express.Router();
const sale_controller = require('../controllers/saleController');

// User Routes
router.get('/sale/:id', sale_controller.new_sale);

module.exports = router;
