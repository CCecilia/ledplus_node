const express = require('express');
const router = express.Router();
const state_rate_controller = require('../controllers/stateRateController');
const requireLogin = require('../utility/auth');

router.get('/', requireLogin, requireLogin, state_rate_controller.state_rate_list);

module.exports = router;