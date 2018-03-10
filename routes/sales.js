const express = require('express');
const router = express.Router();
const sale_controller = require('../controllers/saleController');

// Sale Routes
router.get('/', sale_controller.sales_list);

router.get('/sale/:id', sale_controller.sale);

router.get('/new', sale_controller.new_sale);

router.post('/create', sale_controller.create);

router.post('/estimate/yearly', sale_controller.estimate_yearly);

router.put('/residential/pending', sale_controller.handle_pending_sale);

module.exports = router;
