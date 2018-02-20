const express = require('express');
const router = express.Router();
const rep_controller = require('../controllers/repController');
const requireLogin = require('../utility/auth');

// REP: list
router.get('/', requireLogin, rep_controller.rep_list);

// REP: details
router.get('/details/:id', requireLogin, rep_controller.details);

// REP updates
router.post('/details/:id', rep_controller.update);

// //  REP: rates upload
router.post('/rateUpload/:id', rep_controller.rate_sheet_upload);

module.exports = router;