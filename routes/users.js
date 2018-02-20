const express = require('express');
const router = express.Router();
const user_controller = require('../controllers/userController');
const requireLogin = require('../utility/auth');

// User Routes
router.get('/login', user_controller.login_form);

router.post('/login', user_controller.login);

router.get('/register', user_controller.register_form);

router.post('/register', user_controller.register);

router.get('/dashboard/:id', requireLogin, user_controller.dashboard);

router.get('/logout', user_controller.logout);

module.exports = router;
