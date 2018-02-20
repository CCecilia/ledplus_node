const RetailEnergyProvider = require('../models/retailEnergyProvider');
const User = require('../models/user');
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const async = require('async');


// remove 
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

// REP: list
exports.rep_list = function(req, res, next) {
    // let user = req.session.user;
    let user = {
        _id: ObjectId("5a7e269087cf600907bb3ae8"),
        admin: false,
        email : 'christian.cecilia1@gmail.com',
        password : '$2a$08$N5EjrC9VdIHzQ5Qmr8vReeJv1aW09YPI/Cr3u3ea.qpo3H7WnMXWO',
        retail_energy_provider : ObjectId('5a7e0075110dfbb0b28b7152'),
        dashboard: '/users/dashboard/5a7e269087cf600907bb3ae8/'
    };

    RetailEnergyProvider.find()
    .sort({name: 1})
    .exec(function(err, rep_list){
        if(err){ return next(err); }

        let template_context = {
            title: 'Retail Energy Providers',
            user: user,
            rep_list: rep_list
        };

        res.render('rep_list', template_context);
    });
};

// REP: detail
exports.details = function(req, res, next) {
    async.parallel({
        rep: function(callback){
            RetailEnergyProvider.findById(req.params.id)
            .exec(callback);
        },
        users: function(callback){
            User.find({retail_energy_provider: ObjectId(req.params.id)})
            .exec(callback);
        }
    }, function(err, results){
        if(err){ return next(err); }

        if(results.rep==null) { 
            var err = new Error('Retail Energy Provider not found');
            err.status = 404;
            return next(err);
        }

        let template_context = {
            title: results.rep.name,
            rep: results.rep,
            users: results.users
        };
        res.render('rep_detail', template_context);
    });
};

// REP: update
exports.update = [
    body('name', 'Name required').isLength({ min: 1 }).trim(),
    sanitizeBody('name').trim().escape(),
    (req, res, next) => {
        RetailEnergyProvider.findById(req.params.id)
        .exec(function(err, rep){
            if(err){ return next(err); }

            if(rep == null) { 
                var err = new Error('Retail Energy Provider not found');
                err.status = 404;
                return next(err);
            }
            let errors = validationResult(req);

            let template_context = {
                title: rep.name,
                rep: rep
            };

            if( !errors.isEmpty() ){
                template_context.errors = errors.array();
                res.render('rep_detail', template_context);
            } else {
                // update rep
                rep.name = req.body.name;
                if(req.files.rep_logo){
                    let bitmap = req.files.rep_logo.data.toString('base64');
                    let mimetype = req.files.rep_logo.mimetype;
                    let encoded_image = `data:${mimetype};base64,${bitmap}`
                    rep.logo = encoded_image;
                }

                rep.save(function(err, updated_rep){
                    if(err){ return next(err); }
                    template_context.rep = updated_rep;
                    res.render('rep_detail', template_context);
                });
            } 
        });  
    }
];

// REP: upload rates
exports.rate_sheet_upload = function(req, res, next) {
    rates = req.body.data;

    if( rates.length > 0 ){
        RetailEnergyProvider.findById(req.params.id)
        .exec(function(err, rep){
            if(err){ return next(err); }

            rep.rates = rates;

            rep.save(function(err){
                if(err){
                    console.log(err);
                    res.send({status: 500, error_msg: 'unable to save rates'});
                }

                res.send({status: 200});
            })
        });
    } else {
        res.send({status: 500, error_msg: 'no rates found in upload'});
    }  
};