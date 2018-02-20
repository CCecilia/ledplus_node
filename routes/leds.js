const express = require('express');
const router = express.Router();
const led_controller = require('../controllers/ledController');

router.get('/', led_controller.led_list);

router.get('/details/:id', led_controller.led_detail);

router.post('/details/:id', led_controller.led_update);

router.get('/create', led_controller.led_create_form);

router.post('/create', led_controller.led_create);

router.delete('/remove', led_controller.remove);

module.exports = router;