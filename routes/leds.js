const express = require('express');
const router = express.Router();
const led_controller = require('../controllers/ledController');
const requireLogin = require('../utility/auth');

router.get('/', requireLogin, requireLogin, led_controller.led_list);

router.get('/details/:id', requireLogin, led_controller.led_detail);

router.post('/details/:id', led_controller.led_update);

router.get('/create', requireLogin, led_controller.led_create_form);

router.post('/create', led_controller.led_create);

router.delete('/remove', led_controller.remove);

module.exports = router;