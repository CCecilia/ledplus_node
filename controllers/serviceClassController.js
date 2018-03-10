const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const ServiceClass = require('../models/serviceClass');

// ServiceClass: list
exports.service_class_list = (req, res, next) => {
    ServiceClass.find()
    .exec((err, service_classes) => {
        if(err){ return next(err); }

        let template_context = {
            title: 'Service Classes',
            user: req.session.user,
            service_classes: service_classes
        };

        res.render('service_classes', template_context);
    });
};