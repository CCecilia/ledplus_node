const express = require('express');
const router = express.Router();
const service_class_controller = require('../controllers/serviceClassController');
const requireLogin = require('../utility/auth');

router.get('/', requireLogin, service_class_controller.service_class_list);

module.exports = router;