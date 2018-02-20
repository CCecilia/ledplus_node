const express = require('express');
const router = express.Router();
const service_class_controller = require('../controllers/serviceClassController');

router.get('/', service_class_controller.service_class_list);

module.exports = router;