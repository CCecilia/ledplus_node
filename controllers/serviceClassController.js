const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const ServiceClass = require('../models/serviceClass');

// remove 
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

// ServiceClass: list
exports.service_class_list = function(req, res, next) {
    // let user = req.session.user;
    let user = {
        _id: ObjectId("5a7e269087cf600907bb3ae8"),
        admin: false,
        email : 'christian.cecilia1@gmail.com',
        password : '$2a$08$N5EjrC9VdIHzQ5Qmr8vReeJv1aW09YPI/Cr3u3ea.qpo3H7WnMXWO',
        retail_energy_provider : ObjectId('5a7e0075110dfbb0b28b7152'),
        dashboard: '/users/dashboard/5a7e269087cf600907bb3ae8/'
    };

    ServiceClass.find()
    .exec(function(err, service_classes){
        if(err){ return next(err); }

        let template_context = {
            title: 'Service Classes',
            user: user,
            service_classes: service_classes
        };

        res.render('service_classes', template_context);
    });
};