const User = require('../models/user');
const async = require('async');
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

exports.new_sale = function(req, res) {
    let sale_id = req.params.id;
    let template_context = {};
    
    if( sale_id === 'new' ){
        console.log('new sale');
        template_context.title = 'New Sale';
    } else {
        template_context.title = `Sale ${sale_id}`;
    }

    res.render('new_sale', template_context);
};
